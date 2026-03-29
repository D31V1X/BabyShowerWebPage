"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type Gift } from "@/utils/supabaseClient";
import Image from "next/image";
import { X, ExternalLink, CheckCircle } from "lucide-react";
import { useState } from "react";

interface GiftModalProps {
  gift: Gift | null;
  onClose: () => void;
  onPurchase: (giftId: string) => Promise<void>;
}

export default function GiftModal({ gift, onClose, onPurchase }: GiftModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!gift) return null;

  const handlePurchase = async () => {
    setIsUpdating(true);
    await onPurchase(gift.id);
    setIsUpdating(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-totoro/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative bg-belly w-full max-w-lg rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-totoro bg-belly/50 backdrop-blur-md rounded-full hover:bg-forest hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* Imagen */}
          <div className="relative h-48 sm:h-64 w-full bg-white flex items-center justify-center shrink-0">
            {gift.imagen_url && (
              <img
                src={gift.imagen_url}
                alt={gift.nombre}
                className="w-full h-full object-contain p-6"
                loading="lazy"
              />
            )}
            
            {/* Decoración tipo Ghibli en esquinas */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-[8px] border-belly border-opacity-30 mix-blend-multiply rounded-t-3xl" />
          </div>

          {/* Información y Acciones */}
          <div className="p-8 text-totoro">
            <div className="mb-6 text-center">
              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase rounded-full tracking-wider mb-2">
                {gift.categoria}
              </span>
              <h2 className="text-3xl font-extrabold text-totoro mb-2">{gift.nombre}</h2>
              <p className="text-sm font-medium leading-relaxed opacity-80">{gift.descripcion}</p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Opción 1: Ver detalles externos */}
              {gift.tienda_url && (
                <a
                  href={gift.tienda_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold bg-white text-forest shadow-sm hover:shadow border-2 border-forest hover:bg-forest/5 transition-all"
                >
                  <ExternalLink size={20} />
                  Ver Producto en Tienda
                </a>
              )}

              {/* Opción 2: Marcar como Comprado */}
              {!gift.comprado ? (
                <button
                  onClick={handlePurchase}
                  disabled={isUpdating}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold bg-sunset text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isUpdating ? (
                    <span className="animate-pulse">Actualizando la magia...</span>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      ¡Ya lo compré!
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full py-4 text-center rounded-xl bg-forest/20 text-forest font-bold border-2 border-dashed border-forest/30 flex items-center justify-center gap-2">
                  <CheckCircle size={24} />
                  Este regalo ya fue elegido
                </div>
              )}
              
              <button
                onClick={onClose}
                className="w-full py-2 mt-2 text-sm font-semibold text-totoro/70 hover:text-totoro underline decoration-dotted transition-colors"
                >
                 Volver y seguir explorando
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
