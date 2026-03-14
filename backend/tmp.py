import pandas as pd
df = pd.read_csv('s:/Trichoguard/backend/data/hair_fall_dataset.csv')
with open('s:/Trichoguard/backend/data_info.txt', 'w') as f:
    for col in df.columns:
        f.write(f"{col}: {list(df[col].unique())}\n")
