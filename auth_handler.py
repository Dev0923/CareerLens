"""
Authentication Handler Module
Manages user authentication, session state, and access control
"""

import streamlit as st
import streamlit_authenticator as stauth
from auth_config import get_config, add_user
import bcrypt
from datetime import datetime

class AuthManager:
    """
    Manages all authentication-related operations including:
    - User login/logout
    - Session management
    - Access control
    - User feedback messages
    """
    
    def __init__(self):
        """Initialize authentication manager with config."""
        self.config = get_config()
        # Note: streamlit_authenticator is not used for login UI anymore
        self.authenticator = None
    
    def render_login_page(self) -> bool:
        """
        Render the authentication portal with Login and Sign Up.

        Returns:
            bool: True if user is authenticated, False otherwise
        """
        # Reload config so newly signed-up users are recognized
        self.config = get_config()
        # Create centered container
        col1, col2, col3 = st.columns([1, 2, 1])

        with col2:
            st.markdown("""
            <style>
                .login-container {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    border-radius: 16px;
                    padding: 24px 24px 8px 24px;
                    border: 1px solid #475569;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }
            </style>
            <div class="login-container"></div>
            """, unsafe_allow_html=True)

            st.markdown("# 🔐 Resume Analyzer")
            st.markdown("### Secure Access Portal")
            st.markdown("---")

            tabs = st.tabs(["Login", "Sign Up"])

            # Login tab
            with tabs[0]:
                with st.form("login_form"):
                    username_input = st.text_input("Username")
                    password_input = st.text_input("Password", type="password")
                    submitted = st.form_submit_button("Login")

                if submitted:
                    users = self.config.get('credentials', {}).get('usernames', {})
                    user_cfg = users.get(username_input)
                    if user_cfg:
                        stored_pw = user_cfg.get('password', '').encode('utf-8')
                        if bcrypt.checkpw(password_input.encode('utf-8'), stored_pw):
                            st.session_state['authentication_status'] = True
                            st.session_state['username'] = username_input
                            st.session_state['name'] = user_cfg.get('name', username_input)
                        else:
                            st.session_state['authentication_status'] = False
                            st.error("Incorrect password.")
                    else:
                        st.session_state['authentication_status'] = False
                        st.error("User not found. Please sign up.")
                else:
                    # Clear stale errors when the user hasn't submitted in this run
                    if st.session_state.get('authentication_status') is False:
                        st.session_state['authentication_status'] = None

            # Sign Up tab
            with tabs[1]:
                st.caption("Create a new account to access the dashboard")
                with st.form("signup_form", clear_on_submit=False):
                    new_name = st.text_input("Full Name")
                    new_username = st.text_input("Username", help="Lowercase, 3+ characters")
                    new_email = st.text_input("Email")
                    new_password = st.text_input("Password", type="password")
                    new_password2 = st.text_input("Confirm Password", type="password")
                    agree = st.checkbox("I agree to the Terms and Privacy Policy")
                    submitted = st.form_submit_button("Create Account")

                    if submitted:
                        if not agree:
                            st.error("Please agree to the terms to continue.")
                        elif new_password != new_password2:
                            st.error("Passwords do not match.")
                        else:
                            ok, msg = add_user(new_username, new_name, new_email, new_password)
                            if ok:
                                st.success("✅ Account created! You can now log in.")
                                st.info(f"Username: **{new_username}** is ready. Switch to the Login tab.")
                                # Trigger rerun so new user is loaded into authenticator on next cycle
                                import time
                                time.sleep(1)
                                st.rerun()
                            else:
                                st.error(f"❌ {msg}")

        return st.session_state.get('authentication_status', False)
    
    def show_auth_feedback(self, authentication_status: bool | None, username: str | None) -> None:
        """
        Show appropriate feedback messages based on authentication status.
        
        Args:
            authentication_status (bool | None): Authentication status
            username (str | None): Authenticated username
        """
        if authentication_status:
            st.success(f"✅ Successfully logged in as **{username}**!")
        elif authentication_status == False:
            st.error("❌ **Invalid Username/Password** - Please try again")
        elif authentication_status == None:
            st.info("👤 Please login to access the Resume Analyzer")
    
    def render_logout_button(self) -> None:
        """Render secure logout button in sidebar."""
        col1, col2, col3 = st.columns([1, 1.5, 1])
        
        with col2:
            if st.button("🚪 Logout", use_container_width=True, key="logout_btn"):
                st.session_state['authentication_status'] = False
                st.session_state['username'] = None
                st.session_state['name'] = None
                
                # Clear any stored data
                for key in list(st.session_state.keys()):
                    if key not in ['authentication_status', 'username', 'name']:
                        del st.session_state[key]
                
                st.success("👋 You have been logged out successfully!")
                st.rerun()
    
    def get_user_info(self) -> dict | None:
        """
        Get current user information from session.
        
        Returns:
            dict | None: User information or None if not authenticated
        """
        if not self.is_authenticated():
            return None
        
        return {
            'username': st.session_state.get('username'),
            'name': st.session_state.get('name'),
            'login_time': st.session_state.get('login_time', datetime.now())
        }
    
    def is_authenticated(self) -> bool:
        """
        Check if user is currently authenticated.
        
        Returns:
            bool: True if user is authenticated, False otherwise
        """
        return st.session_state.get('authentication_status', False) == True
    
    def require_login(self) -> bool:
        """
        Require user to be logged in to proceed.
        Stops app execution if not authenticated.
        
        Returns:
            bool: True if authenticated, otherwise stops the app
        """
        if not self.is_authenticated():
            st.stop()
        return True
    
    def render_user_header(self) -> None:
        """Render user information header with logout option."""
        if self.is_authenticated():
            user_info = self.get_user_info()
            
            col1, col2, col3 = st.columns([2, 1, 1])
            
            with col1:
                st.markdown(f"""
                **👤 User:** {user_info['name']} ({user_info['username']})
                """)
            
            with col3:
                if st.button("Logout", key="sidebar_logout"):
                    st.session_state['authentication_status'] = False
                    st.session_state['username'] = None
                    st.session_state['name'] = None
                    st.success("Logged out successfully!")
                    st.rerun()

def initialize_auth_session() -> None:
    """
    Initialize session state variables for authentication.
    Should be called at the start of the app.
    """
    if 'authentication_status' not in st.session_state:
        st.session_state['authentication_status'] = None
    if 'username' not in st.session_state:
        st.session_state['username'] = None
    if 'name' not in st.session_state:
        st.session_state['name'] = None
    if 'login_time' not in st.session_state:
        st.session_state['login_time'] = None
