"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function ParallaxBackground() {
  const { scrollY } = useScroll();
  // El fondo se mueve más lento que el scroll para crear efecto de profundidad
  const yBg = useTransform(scrollY, [0, 1000], [0, 150]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden flex justify-center items-center shadow-inner">

      {/* Imagen de Fondo (Wallpaper completo) */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 z-0 w-full h-[120%] -top-[10%]"
      >
        <img
          src="/assets/Gemini_Generated_Image_4w6ca24w6ca24w6c.png"
          alt="Bosque Totoro"
          className="w-full h-full object-cover object-center"
        />
        {/* Capa oscura/clara para que el texto siga siendo muy legible sobre la imagen */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#E8E1C4] via-transparent to-transparent opacity-90" />
      </motion.div>

      {/* Título Principal */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-20 text-center px-4"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#5F6366] drop-shadow-[0_4px_4px_rgba(255,255,255,0.8)] mb-4">
          Baby Shower
        </h1>
        <h2 className="text-4xl md:text-6xl font-black text-[#7BA347] drop-shadow-[0_4px_4px_rgba(255,255,255,0.9)] bg-white/70 px-8 py-3 rounded-[2rem] backdrop-blur-md border-2 border-white inline-block shadow-lg">
          Lyra Franchesca
        </h2>
        <div className="mt-8">
          <p className="text-xl text-white font-bold bg-[#5F6366]/80 backdrop-blur-md px-6 py-2 rounded-full inline-block shadow-md border border-white/20">
            ¡Acompáñanos en esta mágica aventura!
          </p>
        </div>
      </motion.div>

      {/* Decoración Totoro (Cutout) */}
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 1.5, type: "spring" }}
        className="absolute bottom-0 right-[5%] z-10 pointer-events-none w-48 h-48 md:w-80 md:h-80"
      >
        <img
          src="/assets/Totoro-PNG-Cutout.png"
          alt="Totoro Decoración"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </motion.div>
    </div>
  );
}
