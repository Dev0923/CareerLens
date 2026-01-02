"""
Authentication Configuration Module
Handles user credentials and password hashing with bcrypt
"""

import bcrypt
import yaml
import os
from pathlib import Path

# Path to credentials file
CREDENTIALS_FILE = "config.yaml"

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt for secure storage.
    
    Args:
        password (str): Plain text password
        
    Returns:
        str: Hashed password
    """
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def user_exists(username: str) -> bool:
    """
    Check if a user already exists in the configuration.

    Args:
        username (str): Username to check

    Returns:
        bool: True if user exists, False otherwise
    """
    cfg = load_or_create_config()
    usernames = cfg.get('credentials', {}).get('usernames', {})
    return username.lower() in {u.lower(): v for u, v in usernames.items()}

def add_user(username: str, name: str, email: str, password: str) -> tuple[bool, str]:
    """
    Add a new user to the config with a securely hashed password.

    Args:
        username (str): Desired username (lowercase recommended)
        name (str): Full display name
        email (str): Email address
        password (str): Plain text password to hash

    Returns:
        tuple[bool, str]: (success flag, message)
    """
    # Basic validations suitable for demos & production-ready prototypes
    username = (username or "").strip().lower()
    name = (name or "").strip()
    email = (email or "").strip()
    password = (password or "").strip()

    if not username or not name or not email or not password:
        return False, "All fields are required."
    if len(username) < 3:
        return False, "Username must be at least 3 characters."
    if len(password) < 8:
        return False, "Password must be at least 8 characters."
    if user_exists(username):
        return False, "Username already exists. Please choose another."

    cfg = load_or_create_config()
    cfg.setdefault('credentials', {}).setdefault('usernames', {})
    cfg['credentials']['usernames'][username] = {
        'name': name,
        'password': hash_password(password),
        'email': email
    }

    # Automatically add user to preauthorized list
    cfg.setdefault('preauthorized', {}).setdefault('emails', [])
    if email not in cfg['preauthorized']['emails']:
        cfg['preauthorized']['emails'].append(email)

    try:
        save_config(cfg)
        return True, "Account created successfully. You can now log in."
    except Exception as e:
        return False, f"Failed to save user: {e}"

def create_default_config() -> dict:
    """
    Create default configuration with sample users.
    Uses hashed passwords for security.
    
    Returns:
        dict: Configuration dictionary
    """
    return {
        'credentials': {
            'usernames': {
                'admin': {
                    'name': 'Admin User',
                    'password': hash_password('admin123'),  # Change in production
                    'email': 'admin@example.com'
                },
                'demo': {
                    'name': 'Demo User',
                    'password': hash_password('demo123'),  # Change in production
                    'email': 'demo@example.com'
                },
                'john_doe': {
                    'name': 'John Doe',
                    'password': hash_password('password123'),  # Change in production
                    'email': 'john@example.com'
                }
            }
        },
        'cookie': {
            'expiry_days': 30,
            'key': 'streamlit_resume_analyzer',
            'name': 'resume_analyzer_auth'
        },
        'preauthorized': {
            'emails': [
                'admin@example.com',
                'demo@example.com',
                'john@example.com'
            ]
        }
    }

def load_or_create_config() -> dict:
    """
    Load credentials from YAML file or create default config if not exists.
    
    Returns:
        dict: Configuration dictionary
    """
    if os.path.exists(CREDENTIALS_FILE):
        try:
            with open(CREDENTIALS_FILE, 'r') as f:
                config = yaml.safe_load(f)
                if config:
                    return config
        except Exception as e:
            print(f"⚠️ Error loading config: {e}. Creating new config.")
    
    # Create and save default config if file doesn't exist
    config = create_default_config()
    save_config(config)
    return config

def save_config(config: dict) -> None:
    """
    Save configuration to YAML file.
    
    Args:
        config (dict): Configuration dictionary to save
    """
    try:
        with open(CREDENTIALS_FILE, 'w') as f:
            yaml.dump(config, f, default_flow_style=False)
    except Exception as e:
        raise Exception(f"Error saving configuration: {e}")

def get_config() -> dict:
    """
    Get or create authentication configuration.
    
    Returns:
        dict: Authentication configuration
    """
    return load_or_create_config()

# Initialize config on module load
if not os.path.exists(CREDENTIALS_FILE):
    get_config()
