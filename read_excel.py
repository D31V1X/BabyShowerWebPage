import pandas as pd
import json

file_path = r"c:\Users\deivi\Downloads\BabyShoweLyra WebPage\Lista de Regalos.xlsx"
df = pd.read_excel(file_path)

# Fill na values with empty strings to avoid null errors when exporting
df = df.fillna("")

with open(r"c:\Users\deivi\Downloads\BabyShoweLyra WebPage\gifts.json", "w", encoding="utf-8") as f:
    json.dump(df.to_dict(orient="records"), f, ensure_ascii=False, indent=2)
