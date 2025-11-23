"""
Script to create a test user for FinSage
Run this script to create a test user account
"""
from database import SessionLocal, init_db
from services.user_service import UserService

def create_test_user():
    """Create a test user"""
    # Initialize database
    init_db()
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Check if user already exists
        existing_user = UserService.get_user_by_username(db, "testuser")
        if existing_user:
            print("✓ Test user already exists!")
            print(f"  Username: testuser")
            print(f"  Email: {existing_user.email}")
            print(f"  Password: testpass123")
            return
        
        # Create test user
        user = UserService.create_user(
            db=db,
            email="test@finsage.com",
            username="testuser",
            password="test123",  # Simpler password
            full_name="Test User"
        )
        
        print("✓ Test user created successfully!")
        print(f"  Username: testuser")
        print(f"  Email: test@finsage.com")
        print(f"  Password: test123")
        print("\nYou can now login with these credentials!")
        
    except Exception as e:
        print(f"Error creating test user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
