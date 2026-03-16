
import json
import os
import sys
from app import create_app, db
from app.models import CancerIncidence

def seed_data():
    app = create_app()
    with app.app_context():
        # Path to the JSON file
        json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'data', 'cancerIncidence.json'))
        
        if not os.path.exists(json_path):
            print(f"Error: Data file not found at {json_path}")
            return

        print(f"Reading data from {json_path}...")
        try:
            with open(json_path, 'r') as f:
                data = json.load(f)
        except Exception as e:
            print(f"Error reading JSON file: {e}")
            return

        print(f"Found {len(data)} records. clearing existing data...")
        
        # Clear existing data
        try:
            CancerIncidence.query.delete()
            db.session.commit()
        except Exception as e:
            print(f"Error clearing table: {e}")
            db.session.rollback()
            return

        print("Inserting new data...")
        count = 0
        for item in data:
            record = CancerIncidence(
                cancer_type=item['cancerType'],
                year=item['year'],
                count=item.get('count'),
                asr=item.get('asr')
            )
            db.session.add(record)
            count += 1
        
        try:
            db.session.commit()
            print(f"Successfully seeded {count} records.")
        except Exception as e:
            print(f"Error committing to database: {e}")
            db.session.rollback()

if __name__ == "__main__":
    seed_data()
