// Scroll and Animation Effects
document.addEventListener('DOMContentLoaded', function() {
  initializeScrollEffects();
  observeElements();
});

function initializeScrollEffects() {
  // Add scroll event listener for navbar
  let lastScrollTop = 0;
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      navbar.style.boxShadow = '0 8px 24px rgba(11,22,60,0.2)';
    } else {
      navbar.style.boxShadow = '0 6px 18px rgba(11,22,60,0.15)';
    }
    
    lastScrollTop = scrollTop;
  });
}

function observeElements() {
  // Observe elements for fade-in animation when they come into view
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe cards for animation
  const cards = document.querySelectorAll('.service-card, .portfolio-card, .team-member, .testimonial-card, .blog-card, .pricing-card');
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

// Back to top button functionality
function createBackToTopButton() {
  const button = document.createElement('button');
  button.id = 'backToTop';
  button.innerHTML = '↑';
  button.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(90deg, var(--accent), var(--accent-dark));
    color: white;
    border: none;
    cursor: pointer;
    font-size: 24px;
    display: none;
    z-index: 99;
    box-shadow: 0 8px 20px rgba(107, 124, 255, 0.3);
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(button);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
    } else {
      button.style.display = 'none';
    }
  });
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  button.addEventListener('hover', () => {
    button.style.transform = 'translateY(-5px)';
  });
}

// Initialize back to top button when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createBackToTopButton);
} else {
  createBackToTopButton();
}
