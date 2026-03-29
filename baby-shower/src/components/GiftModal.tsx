"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type Gift } from "@/utils/supabaseClient";
import Image from "next/image";
import { X, ExternalLink, CheckCircle } from "lucide-react";
import { useState } from "react";

interface GiftModalProps {
  gift: Gift | null;
  onClose: () => void;
  onPurchase: (giftId: string, compradorName: string) => Promise<void>;
}

export default function GiftModal({ gift, onClose, onPurchase }: GiftModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [compradorName, setCompradorName] = useState("");

  if (!gift) return null;

  const handlePurchase = async () => {
    if (!compradorName.trim()) return;
    setIsUpdating(true);
    await onPurchase(gift.id, compradorName.trim());
    setIsUpdating(false);
  };

  const handleClose = () => {
    setShowInput(false);
    setCompradorName("");
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-totoro/60 backdrop-blur-sm"
        onClick={handleClose}
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
            onClick={handleClose}
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
                showInput ? (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    className="flex flex-col gap-2 mt-2"
                  >
                    <label className="text-sm font-bold ml-1">¿A nombre de quién estará este regalo?</label>
                    <input 
                      type="text" 
                      placeholder="Tu nombre completo"
                      value={compradorName}
                      onChange={(e) => setCompradorName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-forest/30 bg-white font-medium focus:outline-none focus:border-forest"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => setShowInput(false)}
                        className="w-1/3 py-2 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                        disabled={isUpdating}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handlePurchase}
                        disabled={isUpdating || !compradorName.trim()}
                        className="w-2/3 flex items-center justify-center gap-2 py-2 rounded-xl font-bold bg-sunset text-white shadow-md hover:bg-sunset/90 transition-all disabled:opacity-50"
                      >
                        {isUpdating ? "Confirmando..." : "Confirmar Elegido"}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setShowInput(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold bg-sunset text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    <CheckCircle size={20} />
                    ¡Lo voy a dar yo!
                  </button>
                )
              ) : (
                <div className="w-full py-4 text-center rounded-xl bg-forest/20 text-forest font-bold border-2 border-dashed border-forest/30 flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={24} />
                    Este regalo ya fue elegido
                  </div>
                  {gift.comprador && (
                     <span className="text-sm opacity-80 mt-1">por {gift.comprador}</span>
                  )}
                </div>
              )}
              
              <button
                onClick={handleClose}
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
