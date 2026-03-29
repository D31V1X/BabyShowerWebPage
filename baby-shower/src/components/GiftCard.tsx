"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { type Gift } from "@/utils/supabaseClient";

interface GiftCardProps {
  gift: Gift;
  onClick: (gift: Gift) => void;
}

export default function GiftCard({ gift, onClick }: GiftCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(gift)}
      className={`group relative overflow-hidden rounded-2xl bg-belly border-2 border-belly/20 shadow-md cursor-pointer transition-all duration-300 ${
        gift.comprado ? "opacity-60 grayscale-[40%]" : "hover:shadow-lg hover:border-summer/50"
      }`}
    >
      <div className="relative h-48 w-full bg-white flex items-center justify-center p-4">
        {/* Usamos un fallback si no hay imagen, simulando la carga */}
        {gift.imagen_url ? (
           <img
            src={gift.imagen_url}
            alt={gift.nombre}
            className="w-full h-full object-contain p-2"
            loading="lazy"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-totoro/20 animate-pulse" />
        )}
        
        {/* Sello de Comprado */}
        {gift.comprado && (
          <div className="absolute inset-0 bg-totoro/10 backdrop-blur-[1px] flex items-center justify-center">
            <motion.div 
              initial={{ rotate: -15, scale: 0 }}
              animate={{ rotate: -15, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-forest text-belly px-4 py-2 rounded-xl font-bold text-lg shadow-lg border-2 border-belly"
            >
              ¡Elegido!
            </motion.div>
          </div>
        )}

        {/* Micro-animación en hover (Susuwatari/Polvito) */}
        {!gift.comprado && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden transition-opacity duration-300">
             <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-totoro animate-susuwatari opacity-80" />
             <div className="absolute top-4 right-6 w-1 h-1 rounded-full bg-totoro animate-susuwatari opacity-60" style={{ animationDelay: '0.2s'}} />
             <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-forest animate-susuwatari opacity-70" style={{ animationDelay: '0.5s'}} />
          </div>
        )}
      </div>
      
      <div className="p-4 bg-belly text-totoro">
        <span className="text-xs font-bold uppercase tracking-wider text-forest mb-1 block">
          {gift.categoria}
        </span>
        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1">{gift.nombre}</h3>
        <p className="text-sm opacity-80 line-clamp-2">{gift.descripcion}</p>
      </div>
    </motion.div>
  );
}
