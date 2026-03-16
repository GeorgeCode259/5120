
import os
import sys
import time
import psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv

def verify_connection():
    print("Verifying Neon Database Connection...")
    
    # Load environment variables from .env file
    load_dotenv()
    
    # Check environment variables
    db_url = os.environ.get("DATABASE_URL")
    # Support both naming conventions: DIRECT_URL (Neon default) or DATABASE_URL_UNPOOLED (Prisma/Vercel template)
    direct_url = os.environ.get("DIRECT_URL") or os.environ.get("DATABASE_URL_UNPOOLED")
    
    if not db_url:
        print("❌ Error: DATABASE_URL environment variable is not set.")
        return False
        
    print(f"✅ DATABASE_URL is set.")
    
    # Mask password for display
    masked_url = db_url
    try:
        parsed = urlparse(db_url)
        if parsed.password:
            masked_url = db_url.replace(parsed.password, "******")
    except:
        pass
    print(f"   URL: {masked_url}")

    # Test Pooled Connection (for App)
    print("\nTesting Pooled Connection (DATABASE_URL)...")
    start_time = time.time()
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        cur.fetchone()
        latency = (time.time() - start_time) * 1000
        print(f"✅ Connection Successful!")
        print(f"   Latency: {latency:.2f} ms")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
        return False

    # Test Direct Connection (for Migrations)
    if direct_url:
        print("\nTesting Direct Connection (DIRECT_URL)...")
        start_time = time.time()
        try:
            conn = psycopg2.connect(direct_url)
            cur = conn.cursor()
            cur.execute("SELECT 1;")
            cur.fetchone()
            latency = (time.time() - start_time) * 1000
            print(f"✅ Connection Successful!")
            print(f"   Latency: {latency:.2f} ms")
            cur.close()
            conn.close()
        except Exception as e:
            print(f"❌ Connection Failed: {e}")
            # Non-blocking for app, but important for migrations
    else:
        print("\n⚠️ DIRECT_URL not set. Migrations might fail if using pooled connection.")

    return True

if __name__ == "__main__":
    success = verify_connection()
    sys.exit(0 if success else 1)
