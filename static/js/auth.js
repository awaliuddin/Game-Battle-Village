class AuthManager {
    constructor() {
        this.currentUser = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Show login modal when play button is clicked
        document.getElementById('play-button').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-modal').classList.add('visible');
        });

        // Switch between login and register
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-modal').classList.remove('visible');
            document.getElementById('register-modal').classList.add('visible');
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-modal').classList.remove('visible');
            document.getElementById('login-modal').classList.add('visible');
        });

        // Handle login form submission
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Handle register form submission
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });
    }

    async login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                this.currentUser = data.username;
                this.onLoginSuccess();
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    }

    async register() {
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                // After successful registration, log in automatically
                document.getElementById('username').value = username;
                document.getElementById('password').value = password;
                this.login();
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        }
    }

    onLoginSuccess() {
        // Hide modals
        document.getElementById('login-modal').classList.remove('visible');
        document.getElementById('register-modal').classList.remove('visible');
        
        // Hide splash screen
        document.getElementById('splash-screen').classList.add('hidden');
        
        // Update player info display
        document.getElementById('player-info').textContent = `Player: ${this.currentUser}`;
        
        // Start the game
        if (window.game) {
            window.game.startGame();
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth manager
window.authManager = new AuthManager();
