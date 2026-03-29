"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import ParallaxBackground from "@/components/ParallaxBackground";
import GiftCard from "@/components/GiftCard";
import GiftModal from "@/components/GiftModal";
import { supabase, type Gift } from "@/utils/supabaseClient";
import { motion } from "framer-motion";

export default function Home() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const categories = useMemo(() => {
    const cats = new Set(gifts.map((g) => g.categoria));
    return ["Todos", ...Array.from(cats)];
  }, [gifts]);

  const filteredGifts = useMemo(() => {
    if (selectedCategory === "Todos") return gifts;
    return gifts.filter((g) => g.categoria === selectedCategory);
  }, [gifts, selectedCategory]);

  const purchasedCount = gifts.filter((g) => g.comprado).length;
  const totalCount = gifts.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((purchasedCount / totalCount) * 100);

  // Carga inicial
  const fetchGifts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error("Error cargando los regalos:", error);
      } else {
        setGifts(data || []);
      }
    } catch (err) {
      console.error("Error inesperado:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Fetch initial data
    fetchGifts();

    // 2. Set up realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'gifts',
        },
        (payload) => {
          console.log('Cambio detectado:', payload);
          // Actualización optimista del estado local sin recargar
          setGifts((currentGifts) => 
            currentGifts.map((gift) => 
              gift.id === payload.new.id 
                ? { ...gift, comprado: payload.new.comprado, comprador: payload.new.comprador } 
                : gift
            )
          );
          // Si el modal está abierto en ese mismo regalo, lo actualizamos pero no lo cerramos
          setSelectedGift((current) => {
            if (current && current.id === payload.new.id) {
              return { ...current, comprado: payload.new.comprado, comprador: payload.new.comprador };
            }
            return current;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchGifts]);

  // Manejador para comprar un regalo
  const handlePurchase = async (giftId: string, compradorName: string) => {
    try {
      const { error } = await supabase
        .from('gifts')
        .update({ comprado: true, comprador: compradorName })
        .eq('id', giftId);
      
      if (error) throw error;
      
      // La UI se actualizará automáticamente gracias a la suscripción en tiempo real,
      // pero actualizamos localmente también para que sea inmediato para el usuario que hizo click.
      setGifts(currentGifts => 
        currentGifts.map(g => g.id === giftId ? { ...g, comprado: true, comprador: compradorName } : g)
      );
      
      setSelectedGift(current => current ? { ...current, comprado: true, comprador: compradorName } : null);
      
    } catch (error) {
      console.error("No se pudo marcar como comprado:", error);
      alert("Hubo un error al guardar tu elección. Por favor, intenta de nuevo.");
    }
  };

  return (
    <main className="min-h-screen bg-[#E8E1C4] font-sans pb-20">
      <ParallaxBackground />
      
      <section className="container mx-auto px-4 mt-8 md:mt-12 relative z-20">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5, duration: 0.8 }}
           className="text-center mb-12"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white max-w-2xl mx-auto">
             <h2 className="text-3xl md:text-4xl font-extrabold text-[#5F6366] mb-4">La Magia Comienza</h2>
             <p className="text-lg text-[#5F6366]/80 font-medium">
                Ayúdanos a preparar el camino para Lyra Franchesca. 
                Elige el pedacito de bosque que quieras regalarle.
             </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 bg-[#5F6366] rounded-full animate-pulse shadow-xl flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#E8E1C4]" />
            </div>
          </div>
        ) : (
          <>
            {/* Barra de Progreso y Filtros */}
            <div className="mb-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
              
              {/* Barra de progreso */}
              <div className="w-full bg-white/60 p-6 rounded-3xl shadow-md border border-white/50 backdrop-blur-sm">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[#5F6366] font-bold">Progreso de Regalos</span>
                  <span className="text-[#7BA347] font-black">{purchasedCount} / {totalCount} ({progressPercent}%)</span>
                </div>
                <div className="w-full h-4 bg-[#E8E1C4] rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progressPercent}%` }}
                     transition={{ duration: 1, ease: "easeOut" }}
                     className="h-full bg-gradient-to-r from-[#7BA347] to-[#F2CB52] rounded-full"
                   />
                </div>
              </div>

              {/* Filtros de Categoría */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
                      selectedCategory === cat 
                        ? "bg-[#5F6366] text-[#E8E1C4] scale-105 shadow-md" 
                        : "bg-white text-[#5F6366] hover:bg-[#E8E1C4]/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGifts.map((gift, index) => (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: (index % 10) * 0.05 }}
                >
                  <GiftCard 
                    gift={gift} 
                    onClick={(selected) => setSelectedGift(selected)} 
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Modal / Pop-up de Detalle */}
      <GiftModal 
        gift={selectedGift} 
        onClose={() => setSelectedGift(null)} 
        onPurchase={handlePurchase} 
      />
    </main>
  );
}
