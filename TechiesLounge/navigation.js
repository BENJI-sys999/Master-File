// Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  smoothScrolling();
});

function initializeNavigation() {
  const navLinks = document.querySelectorAll('.links a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function smoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only smooth scroll if on the same page
      if (href !== '#' && href !== '') {
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without reload
          window.history.pushState(null, null, href);
        }
      }
    });
  });
}

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
  const navContainer = document.querySelector('.nav-container');
  navContainer.classList.toggle('mobile-open');
}
