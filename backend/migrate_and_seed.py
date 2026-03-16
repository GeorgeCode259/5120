
import os
import subprocess
import sys
from dotenv import load_dotenv

def run_migration_and_seed():
    # Load environment variables
    load_dotenv()
    
    # 1. Configure for Migration (Use Direct Connection)
    # Neon recommends using the direct connection (unpooled) for migrations
    # to avoid issues with prepared statements or transaction handling in poolers.
    direct_url = os.environ.get("DATABASE_URL_UNPOOLED") or os.environ.get("DIRECT_URL")
    
    if not direct_url:
        print("❌ Error: Could not find DATABASE_URL_UNPOOLED or DIRECT_URL in .env")
        print("   Please ensure you have a direct connection string configured for migrations.")
        return False

    print(f"🔄 Setting DATABASE_URL to Direct Connection for migration...")
    # Override DATABASE_URL for the subprocess
    env = os.environ.copy()
    env["DATABASE_URL"] = direct_url
    
    # 2. Run Flask Migration
    print("\n🚀 Running Database Migrations (flask db upgrade)...")
    try:
        # We use sys.executable to ensure we use the same python interpreter
        subprocess.run([sys.executable, "-m", "flask", "db", "upgrade"], env=env, check=True)
        print("✅ Migrations applied successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Migration failed with exit code {e.returncode}")
        return False

    # 3. Run Data Seeding
    print("\n🌱 Seeding Database (seed_cancer_data.py)...")
    try:
        # Import the seed function directly to run it
        # We need to make sure the env var is set for this process too if it uses create_app
        os.environ["DATABASE_URL"] = direct_url
        from seed_cancer_data import seed_data
        seed_data()
        print("✅ Data seeding completed!")
    except Exception as e:
        print(f"❌ Seeding failed: {e}")
        return False

    return True

if __name__ == "__main__":
    success = run_migration_and_seed()
    sys.exit(0 if success else 1)
