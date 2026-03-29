import json

with open(r"c:\Users\deivi\Downloads\BabyShoweLyra WebPage\gifts.json", "r", encoding="utf-8") as f:
    gifts = json.load(f)

sql = """-- supabase/schema.sql

-- Eliminar tabla si ya existe (cuidado en producción)
DROP TABLE IF EXISTS public.gifts;

-- Crear tabla
CREATE TABLE public.gifts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria text NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  imagen_url text,
  tienda_url text,
  comprado boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir lectura
CREATE POLICY "Permitir lectura publica" ON public.gifts FOR SELECT TO public USING (true);

-- Política 2: Permitir actualización
CREATE POLICY "Permitir actualizacion anonima de estado comprado" ON public.gifts FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Insertar todos los datos
INSERT INTO public.gifts (categoria, nombre, descripcion, imagen_url, tienda_url)
VALUES
"""

values = []
for gift in gifts:
    cat = gift.get("Categoría", "").replace("'", "''")
    nombre = gift.get("Nombre del Regalo", "").replace("'", "''")
    desc = gift.get("Descripción", "").replace("'", "''")
    
    img = gift.get("Imagen del Producto", "")
    if img == "No encontrado" or not img.startswith("http"):
        img = "/assets/971-9712230_my-neighbor-totoro.png"
    img = img.replace("'", "''")
    
    enlace = gift.get("Enlace", "")
    if enlace == "Ver Producto":
        enlace = "https://www.google.com/search?q=" + nombre.replace(" ", "+")

    values.append(f"  ('{cat}', '{nombre}', '{desc}', '{img}', '{enlace}')")

sql += ",\n".join(values) + ";"

with open(r"c:\Users\deivi\Downloads\BabyShoweLyra WebPage\baby-shower\supabase\schema.sql", "w", encoding="utf-8") as f:
    f.write(sql)

print("SQL generated successfully.")
