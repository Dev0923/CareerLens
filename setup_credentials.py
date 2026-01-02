"""
Credentials Setup & Authentication Guide
=========================================

This script helps you set up and manage user credentials for the Resume Analyzer.
Run this to create/update user accounts with hashed passwords.
"""

from auth_config import hash_password, save_config, get_config, create_default_config
import yaml

def create_credentials_interactive():
    """
    Interactive tool to create/update user credentials.
    """
    print("\n" + "="*60)
    print("📝 RESUME ANALYZER - USER CREDENTIALS SETUP")
    print("="*60)
    
    config = get_config()
    
    while True:
        print("\n📋 Choose an option:")
        print("1. Add new user")
        print("2. Update user password")
        print("3. Remove user")
        print("4. View all users")
        print("5. Reset to default users")
        print("6. Exit")
        
        choice = input("\nEnter choice (1-6): ").strip()
        
        if choice == "1":
            add_user(config)
        elif choice == "2":
            update_password(config)
        elif choice == "3":
            remove_user(config)
        elif choice == "4":
            view_users(config)
        elif choice == "5":
            reset_defaults(config)
        elif choice == "6":
            print("\n✅ Setup complete! Exiting...")
            break
        else:
            print("❌ Invalid choice. Please try again.")

def add_user(config: dict) -> None:
    """Add a new user to the credentials."""
    print("\n➕ ADD NEW USER")
    print("-" * 40)
    
    username = input("Username: ").strip().lower()
    
    # Check if user exists
    if username in config['credentials']['usernames']:
        print("❌ User already exists!")
        return
    
    name = input("Full Name: ").strip()
    email = input("Email: ").strip()
    password = input("Password: ").strip()
    confirm = input("Confirm Password: ").strip()
    
    if password != confirm:
        print("❌ Passwords don't match!")
        return
    
    if len(password) < 6:
        print("❌ Password must be at least 6 characters!")
        return
    
    # Add user
    config['credentials']['usernames'][username] = {
        'name': name,
        'password': hash_password(password),
        'email': email
    }
    
    save_config(config)
    print(f"✅ User '{username}' added successfully!")

def update_password(config: dict) -> None:
    """Update a user's password."""
    print("\n🔐 UPDATE PASSWORD")
    print("-" * 40)
    
    username = input("Username: ").strip().lower()
    
    if username not in config['credentials']['usernames']:
        print("❌ User not found!")
        return
    
    password = input("New Password: ").strip()
    confirm = input("Confirm Password: ").strip()
    
    if password != confirm:
        print("❌ Passwords don't match!")
        return
    
    if len(password) < 6:
        print("❌ Password must be at least 6 characters!")
        return
    
    config['credentials']['usernames'][username]['password'] = hash_password(password)
    save_config(config)
    print(f"✅ Password for '{username}' updated successfully!")

def remove_user(config: dict) -> None:
    """Remove a user from credentials."""
    print("\n🗑️  REMOVE USER")
    print("-" * 40)
    
    username = input("Username to remove: ").strip().lower()
    
    if username not in config['credentials']['usernames']:
        print("❌ User not found!")
        return
    
    confirm = input(f"Are you sure? This cannot be undone (yes/no): ").strip().lower()
    
    if confirm == "yes":
        del config['credentials']['usernames'][username]
        save_config(config)
        print(f"✅ User '{username}' removed successfully!")
    else:
        print("❌ Operation cancelled.")

def view_users(config: dict) -> None:
    """Display all users in the system."""
    print("\n👥 ALL USERS")
    print("-" * 40)
    
    users = config['credentials']['usernames']
    
    if not users:
        print("No users found.")
        return
    
    for i, (username, info) in enumerate(users.items(), 1):
        print(f"\n{i}. Username: {username}")
        print(f"   Name: {info.get('name', 'N/A')}")
        print(f"   Email: {info.get('email', 'N/A')}")
        print(f"   Status: ✅ Active")

def reset_defaults(config: dict) -> None:
    """Reset credentials to default demo users."""
    print("\n⚠️  RESET TO DEFAULTS")
    print("-" * 40)
    confirm = input("This will overwrite all users. Continue? (yes/no): ").strip().lower()
    
    if confirm == "yes":
        config = create_default_config()
        save_config(config)
        print("✅ Reset to default users successfully!")
        print("\nDefault Users:")
        print("1. admin / admin123")
        print("2. demo / demo123")
        print("3. john_doe / password123")
    else:
        print("❌ Operation cancelled.")

def print_quick_start():
    """Print quick start guide."""
    print("\n" + "="*60)
    print("🚀 QUICK START - DEFAULT USERS")
    print("="*60)
    print("\nThe following default users have been created:")
    print("\n1️⃣  Admin Account:")
    print("   Username: admin")
    print("   Password: admin123")
    print("   (Change in production!)")
    
    print("\n2️⃣  Demo Account:")
    print("   Username: demo")
    print("   Password: demo123")
    
    print("\n3️⃣  Sample User Account:")
    print("   Username: john_doe")
    print("   Password: password123")
    
    print("\n⚠️  IMPORTANT SECURITY NOTES:")
    print("• Never commit config.yaml with real passwords to git")
    print("• Always use strong passwords (min 8 characters)")
    print("• Passwords are hashed with bcrypt - never stored in plain text")
    print("• Add config.yaml to .gitignore for production")
    print("• Change default passwords before going to production")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    config = get_config()
    
    # Check if default config was just created
    if not any(config['credentials']['usernames']):
        print_quick_start()
    
    create_credentials_interactive()
