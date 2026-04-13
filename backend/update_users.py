from sqlalchemy import text
from app.db.session import engine
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN phone_number VARCHAR"))
        conn.execute(text("ALTER TABLE users ADD COLUMN address VARCHAR"))
        conn.execute(text("ALTER TABLE users ADD COLUMN nin_url VARCHAR"))
        conn.commit()
        print("Verification columns added to 'users' table.")
    except Exception as e:
        print(f"Error adding columns: {e}")
