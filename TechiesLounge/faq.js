// FAQ Functionality
document.addEventListener('DOMContentLoaded', function() {
  initializeFAQ();
});

function initializeFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', function() {
        toggleFAQ(item);
      });
    }
  });
}

function toggleFAQ(item) {
  const isActive = item.classList.toggle('active');
  const toggle = item.querySelector('.faq-toggle');
  
  if (toggle) {
    toggle.textContent = isActive ? '−' : '+';
  }
  
  // Close other FAQ items (optional: for accordion effect)
  // closeOtherFAQs(item);
}

function closeOtherFAQs(activeItem) {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    if (item !== activeItem && item.classList.contains('active')) {
      item.classList.remove('active');
      const toggle = item.querySelector('.faq-toggle');
      if (toggle) {
        toggle.textContent = '+';
      }
    }
  });
}
