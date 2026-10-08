// Form Validation and Handling
document.addEventListener('DOMContentLoaded', function() {
  initializeForms();
});

function initializeForms() {
  const contactForm = document.querySelector('.contact-form');
  const loginForm = document.querySelector('form[action*="login"]') || document.querySelector('.auth-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginForm);
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateForm(formElement) {
  const inputs = formElement.querySelectorAll('input[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      showError(input, 'This field is required');
      isValid = false;
    } else if (input.type === 'email' && !validateEmail(input.value)) {
      showError(input, 'Please enter a valid email');
      isValid = false;
    } else {
      clearError(input);
    }
  });
  
  return isValid;
}

function showError(input, message) {
  clearError(input);
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.color = '#f5576c';
  errorDiv.style.fontSize = '0.85rem';
  errorDiv.style.marginTop = '4px';
  input.parentNode.appendChild(errorDiv);
  input.style.borderColor = '#f5576c';
}

function clearError(input) {
  const errorDiv = input.parentNode.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.remove();
  }
  input.style.borderColor = '';
}

function handleContactForm(e) {
  e.preventDefault();
  
  if (validateForm(this)) {
    const formData = new FormData(this);
    console.log('Form submitted:', Object.fromEntries(formData));
    
    // Simulate success
    showSuccessMessage(this, 'Message sent successfully!');
    this.reset();
  }
}

function handleLoginForm(e) {
  e.preventDefault();
  
  if (validateForm(this)) {
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    console.log('Login attempt:', { email, password });
    
    // Simulate login
    showSuccessMessage(this, 'Login successful!');
    
    // Redirect after 1.5 seconds
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }
}

function showSuccessMessage(formElement, message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  successDiv.style.color = '#6b7cff';
  successDiv.style.padding = '12px';
  successDiv.style.marginBottom = '16px';
  successDiv.style.borderRadius = '8px';
  successDiv.style.backgroundColor = 'rgba(107, 124, 255, 0.1)';
  successDiv.style.fontWeight = '600';
  
  formElement.insertBefore(successDiv, formElement.firstChild);
  
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}
