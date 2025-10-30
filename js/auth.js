// Authentication and Portal JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Portal Login Form Handling
    const loginForms = document.querySelectorAll('.login-form-content');
    
    loginForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const username = formData.get('username');
            const password = formData.get('password');
            
            // Simple validation
            if (!username || !password) {
                showMessage('Please enter both username and password.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.btn-login-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            submitBtn.disabled = true;
            
            // Simulate login process
            setTimeout(() => {
                // This is a demo - in real implementation, you would make an API call
                if (password.length >= 6) {
                    showMessage('Login successful! Redirecting...', 'success');
                    // Redirect to dashboard (simulated)
                    setTimeout(() => {
                        window.location.href = 'portal-dashboard.html';
                    }, 1500);
                } else {
                    showMessage('Invalid credentials. Please try again.', 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }, 2000);
        });
    });
    
    // Password visibility toggle
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        const toggle = document.createElement('span');
        toggle.innerHTML = '<i class="fas fa-eye"></i>';
        toggle.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: var(--text-light);
        `;
        
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        wrapper.appendChild(toggle);
        
        toggle.addEventListener('click', function() {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    });
    
    // Remember me functionality
    const rememberCheckboxes = document.querySelectorAll('input[name="remember"]');
    rememberCheckboxes.forEach(checkbox => {
        // Check if there's a saved login
        const savedUsername = localStorage.getItem('rememberedUsername');
        if (savedUsername && checkbox.checked) {
            const usernameInput = checkbox.closest('form').querySelector('input[type="text"]');
            if (usernameInput) {
                usernameInput.value = savedUsername;
            }
        }
        
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                const username = this.closest('form').querySelector('input[type="text"]').value;
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }
        });
    });
    
    // Forgot password functionality
    const forgotLinks = document.querySelectorAll('.forgot-password');
    forgotLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showForgotPasswordModal();
        });
    });
});

// Show message function
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? 'var(--accent-color)' : type === 'success' ? 'var(--success-color)' : 'var(--secondary-color)'};
        color: white;
        padding: 1rem 2rem 1rem 1rem;
        border-radius: 5px;
        box-shadow: var(--shadow);
        z-index: 10000;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}

// Forgot password modal
function showForgotPasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Reset Password</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Enter your email address and we'll send you instructions to reset your password.</p>
                <form class="forgot-password-form">
                    <div class="form-group">
                        <label for="reset-email">Email Address</label>
                        <input type="email" id="reset-email" required>
                    </div>
                    <div class="form-group">
                        <label for="user-type">User Type</label>
                        <select id="user-type" required>
                            <option value="">Select User Type</option>
                            <option value="student">Student</option>
                            <option value="parent">Parent</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Send Reset Instructions</button>
                </form>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 10px;
        max-width: 400px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Form submission
    modal.querySelector('.forgot-password-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('#reset-email').value;
        const userType = this.querySelector('#user-type').value;
        
        if (email && userType) {
            showMessage('Password reset instructions have been sent to your email.', 'success');
            modal.remove();
        }
    });
}

// Session management (basic)
const Auth = {
    isLoggedIn: function() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },
    
    login: function(userData) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
    },
    
    logout: function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        window.location.href = 'portal-login.html';
    },
    
    getUser: function() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Auth, showMessage };
}