import pandas as pd
import json
import os

# File paths
excel_file = r"c:\class\5120 IE\onboarding_program\5120\Copy of aihw-can-122-CDiA-2023-Book-1a-Cancer-incidence-age-standardised-rates-5-year-age-groups.xlsx"
output_file = r"c:\class\5120 IE\onboarding_program\5120\frontend\src\data\cancerIncidence.json"

def process_data():
    try:
        # Read to find header
        df_raw = pd.read_excel(excel_file, sheet_name='Table S1a.1', header=None)
        
        header_row_idx = None
        for i, row in df_raw.iterrows():
            row_str = row.astype(str)
            if row_str.str.contains("Cancer group/site", case=False, na=False).any():
                header_row_idx = i
                break
        
        if header_row_idx is None:
            print("Header not found")
            return

        df = pd.read_excel(excel_file, sheet_name='Table S1a.1', header=header_row_idx)
        df.columns = df.columns.str.strip()
        
        # Identify columns
        cancer_col = 'Cancer group/site'
        age_col = 'Age group (years)'
        sex_col = 'Sex'
        data_type_col = 'Data type' if 'Data type' in df.columns else None
        
        year_col = next((c for c in df.columns if 'Year' in c), 'Year')
        count_col = next((c for c in df.columns if 'Count' in c or 'Number' in c), None)
        asr_col = next((c for c in df.columns if 'Age-standardised rate' in c and '2001' in c), None)
        if not asr_col:
             asr_col = next((c for c in df.columns if 'Age-standardised rate' in c), None)

        print(f"Using columns: Year={year_col}, Count={count_col}, ASR={asr_col}")

        # Filter: All ages, Persons, Actual
        # We KEEP all Cancer groups for the dynamic chart
        filtered = df[
            (df[age_col] == 'All ages combined') &
            (df[sex_col] == 'Persons')
        ]
        
        if data_type_col:
            filtered = filtered[filtered[data_type_col] == 'Actual']
        
        # Extract and Rename
        result_df = filtered[[cancer_col, year_col, count_col, asr_col]].copy()
        result_df.columns = ['cancerType', 'year', 'count', 'asr']
        
        # Clean types
        result_df['year'] = pd.to_numeric(result_df['year'], errors='coerce')
        result_df = result_df.dropna(subset=['year'])
        result_df = result_df.sort_values(['cancerType', 'year'])
        
        # Output
        data = result_df.to_dict(orient='records')
        
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
            
        print(f"Successfully exported {len(data)} records to {output_file}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    process_data()
