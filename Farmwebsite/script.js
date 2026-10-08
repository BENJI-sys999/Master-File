const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const cartCountEl = document.getElementById('cartCount');
const cartButton = document.getElementById('cartButton');

const data = {
  animal: {
    chicken: {title:'Poultry - Chickens', body:'Free-range chickens. Feed: layer pellets, grit. Coop: 2-3 sq ft per bird, fresh water, routine health checks.'},
    goat: {title:'Goats', body:'Goats are pasture-first. Provide minerals, shelter, hoof trimming and vaccination as needed.'},
    cow: {title:'Cattle', body:'Grass-fed cattle. Rotational grazing, mineral supplements, and regular vet care.'}
  }
};

let cart = [];

function updateCartCount(){
  if(!cartCountEl) return;
  cartCountEl.textContent = String(cart.length);
}

function openModal(html){
  modalBody.innerHTML = html;
  modal.setAttribute('aria-hidden','false');
  modalClose.focus();
}
function closeModal(){
  modal.setAttribute('aria-hidden','true');
  modalBody.innerHTML = '';
}

document.addEventListener('click', (e)=>{
  const t = e.target;
  if(t.matches('.more')){
    const type = t.dataset.type;
    const id = t.dataset.id;
    if(type === 'animal'){
      const item = data.animal[id];
      if(item) openModal(`<h3>${item.title}</h3><p>${item.body}</p>`);
    } else if(type === 'product'){
      // find product either from PRODUCTS or custom list
      const all = getAllProducts();
      const item = all.find(p=>p.id===id);
      if(item) openModal(`<h3>${item.title}</h3><p>${item.description || ''}</p>` + (item.price ? `<p class="price">Price: $${item.price}</p>` : '<p class="muted">Contact for pricing</p>'));
    }
  }
  if(t.matches('.add-to-cart')){
    const id = t.dataset.id;
    const all = getAllProducts();
    const item = all.find(p=>p.id===id) || {id,title:id};
    cart.push({id, ...(item||{})});
    updateCartCount();
    // small cart pop animation
    if(cartCountEl){
      cartCountEl.classList.add('pop');
      setTimeout(()=>cartCountEl.classList.remove('pop'),400);
    }
    openModal(`<h3>Added to cart</h3><p>${item.title || id}</p>`);
  }
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });

// close modal with Escape key
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && modal.getAttribute('aria-hidden')==='false') closeModal(); });

if(cartButton){
  cartButton.addEventListener('click', ()=>{
    if(cart.length===0) openModal('<h3>Your cart is empty</h3><p>Add products to your cart to see them here.</p>');
    else{
      const items = cart.map(i=>`<li>${i.title} ${i.price?` — $${i.price}`:''}</li>`).join('');
      openModal(`<h3>Your cart (${cart.length})</h3><ul>${items}</ul><p class="muted">Note: this prototype has no checkout — contact us to place the order.</p>`);
    }
  });
}

// Simple contact form handling
const form = document.getElementById('contactForm');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if(!name || !email || !message){
      alert('Please complete all fields.');
      return;
    }
    form.reset();
    openModal('<h3>Message sent</h3><p>Thank you — we will reply by email soon.</p>');
  });
}

updateCartCount();

// ------------------------
// Dynamic product rendering
// ------------------------

function getCustomProducts(){
  try{ return JSON.parse(localStorage.getItem('customProducts')||'[]') }catch(e){ return [] }
}

function getAllProducts(){
  const seed = window.PRODUCTS || [];
  const custom = getCustomProducts();
  // Custom products may override seed by id
  const map = new Map(seed.map(p=>[p.id,p]));
  for(const p of custom) map.set(p.id,p);
  return Array.from(map.values());
}

function renderProducts(){
  const grid = document.getElementById('productsGrid');
  if(!grid) return;
  const all = getAllProducts();
  grid.innerHTML = all.map(p=>{
    const price = p.price ? `<p class="price">$${p.price}</p>` : `<p class="muted">Contact for pricing</p>`;
    const img = p.img ? `<img src="${p.img}" alt="${p.title}" class="prod-img">` : '';
    return `
      <div class="card product">
        ${img}
        <h4>${p.title}</h4>
        <p>${p.description || ''}</p>
        ${price}
        <div class="card-actions">
          <button class="add-to-cart" data-id="${p.id}">Add to cart</button>
          <button class="more" data-type="product" data-id="${p.id}">Details</button>
        </div>
      </div>`;
  }).join('');
  // animate cards with a small stagger
  const cards = grid.querySelectorAll('.card');
  cards.forEach((c,i)=>{
    // force reflow then add class so animation runs
    c.style.animationDelay = (i * 70) + 'ms';
    c.classList.add('fade-up');
  });
}

// admin form handling
const adminToggle = document.getElementById('adminToggle');
const manageSection = document.getElementById('manage');
const productForm = document.getElementById('productForm');
if(adminToggle && manageSection){
  adminToggle.addEventListener('click', ()=>{
    if(manageSection.style.display === 'none' || !manageSection.style.display) manageSection.style.display = 'block';
    else manageSection.style.display = 'none';
  });
}

function makeId(name){
  return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

if(productForm){
  productForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = productForm.pname.value.trim();
    if(!name) return alert('Enter a name');
    const id = makeId(name);
    const priceVal = productForm.pprice.value.trim();
    const price = priceVal ? Number(priceVal) : null;
    const desc = productForm.pdesc.value.trim();
    const img = productForm.pimg.value.trim();
    const list = getCustomProducts();
    // replace if exists
    const existingIndex = list.findIndex(x=>x.id===id);
    const item = {id,title:name,description:desc,price,img};
    if(existingIndex>=0) list[existingIndex]=item; else list.push(item);
    localStorage.setItem('customProducts', JSON.stringify(list));
    renderProducts();
    productForm.reset();
    openModal('<h3>Product added</h3><p>Your product was saved locally.</p>');
  });
}

// render on load
document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts();
  // hero entrance
  document.querySelector('.hero-copy')?.classList.add('enter');
});

