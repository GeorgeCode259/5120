# Charts and Data Documentation

## Overview
The UV Awareness page features two charts visualizing cancer statistics:
1. **Skin Cancer Statistics (Melanoma)**: A static dual-axis line chart showing Age-Standardised Rate (ASR) and Total Cases for Melanoma.
2. **Cancer Incidence Trends**: A dynamic interactive chart allowing users to explore various cancer types, time ranges, and metrics.

## Data Source
- **Source File**: `aihw-can-122-CDiA-2023-Book-1a-Cancer-incidence-age-standardised-rates-5-year-age-groups.xlsx`
- **Sheet**: `Table S1a.1`
- **Filters Applied**:
  - Age group: "All ages combined"
  - Sex: "Persons"
  - Data type: "Actual"

## Data Update Process
The frontend uses a pre-processed JSON file `src/data/cancerIncidence.json`. To update the data:

1. Place the new Excel file in the project root (or update the path in the script).
2. Run the processing script:
   ```bash
   python process_cancer_data.py
   ```
3. This will regenerate `frontend/src/data/cancerIncidence.json`.
4. Rebuild the frontend to reflect changes.

## Component Configuration

### SkinCancerChart
- **File**: `src/components/SkinCancerChart.tsx`
- **Type**: Line Chart (Chart.js)
- **Configuration**:
  - Hardcoded to filter `cancerType === "Melanoma of the skin"`.
  - Left Y-axis: Rate per 100,000 (Blue).
  - Right Y-axis: Total Cases (Red Dashed).

### CancerIncidenceChart
- **File**: `src/components/CancerIncidenceChart.tsx`
- **Type**: Line Chart (Chart.js) with `chartjs-plugin-zoom`.
- **Features**:
  - **Cancer Type Selector**: Populated dynamically from data.
  - **Year Range**: Dual slider inputs.
  - **Metric Toggle**: Switch between Rate, Count, or Both.
  - **Zoom**: Pan/Zoom enabled on X-axis (Year).

## Dependencies
- `chart.js`
- `react-chartjs-2`
- `chartjs-plugin-zoom`
