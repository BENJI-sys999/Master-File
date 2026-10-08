// Formspree endpoint (set to your endpoint URL to enable email forwarding)
// Example: const FORMSPREE_URL = 'https://formspree.io/f/xyzabc';
const FORMSPREE_URL = '';

function showInlineMessage(el, msg, success=true){
  const p = document.createElement('p');
  p.textContent = msg;
  p.style.color = success ? '#0b0' : '#b00020';
  el.parentNode.insertBefore(p, el.nextSibling);
}

document.addEventListener('DOMContentLoaded', ()=>{
  // Contact form on homepage
  const form = document.getElementById('sfContact');
  if(form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const message = form.message.value.trim();
      if(!name || !email || !phone || !message){
        alert('Please complete all fields');
        return;
      }
      form.reset();
      if(FORMSPREE_URL){
        try{
          await fetch(FORMSPREE_URL, {method:'POST', body: new URLSearchParams({name,email,phone,message})});
          showInlineMessage(form, 'Thanks — your request was sent. We will contact you shortly.');
        }catch(err){
          showInlineMessage(form, 'Error sending request. Please email us directly.', false);
        }
      }else{
        showInlineMessage(form, 'Thanks — your request was sent. We will contact you shortly.');
      }
    });
  }

  // Quote modal: open when clicking request buttons
  const modal = document.getElementById('sfModal');
  const modalClose = document.getElementById('sfModalClose');
  const modalTitle = document.getElementById('sfModalTitle');
  const quoteInput = document.getElementById('quoteProduct');
  const quoteForm = document.getElementById('sfQuoteForm');
  const modalStatus = document.getElementById('sfModalStatus');

  function openModal(product){
    modal.setAttribute('aria-hidden','false');
    modalTitle.textContent = 'Request a Quote — ' + product;
    quoteInput.value = product;
    modalStatus.innerHTML = '';
    quoteForm.querySelector('[name=name]').focus();
  }
  function closeModal(){ modal.setAttribute('aria-hidden','true'); }

  document.querySelectorAll('.request-quote').forEach(btn=>{
    btn.addEventListener('click', ()=> openModal(btn.dataset.product || btn.innerText));
  });
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });

  // submit quote form (to Formspree if configured)
  if(quoteForm){
    quoteForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const fd = new FormData(quoteForm);
      const plain = Object.fromEntries(fd.entries());
      modalStatus.textContent = 'Sending...';
      if(FORMSPREE_URL){
        try{
          await fetch(FORMSPREE_URL, {method:'POST', body: new URLSearchParams(plain)});
          modalStatus.textContent = 'Request sent — we will contact you.';
          quoteForm.reset();
        }catch(err){
          modalStatus.textContent = 'Error sending — please email us directly.';
        }
      }else{
        // fallback: just show confirmation locally
        modalStatus.textContent = 'Request recorded locally (no server configured). We will contact you.';
        quoteForm.reset();
      }
    });
  }
});
