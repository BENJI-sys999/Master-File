// Clean, robust Brezzy cart implementation (single IIFE)
(function(){
  const $ = s => document.querySelector(s)
  const $$ = s => Array.from(document.querySelectorAll(s))

  const products = [
    {id:1, category:'phone', title:'Brezzy Pro', price:699.00, desc:'Flagship 6.5" AMOLED, dual cameras'},
    {id:2, category:'phone', title:'Brezzy Lite', price:399.00, desc:'Balanced performance with long battery life'},
    {id:3, category:'accessory', title:'Leather Case', price:39.00, desc:'Premium protective case'},
    {id:4, category:'accessory', title:'Fast Charger', price:29.00, desc:'USB-C 30W fast charger'},
    {id:5, category:'accessory', title:'Earbuds', price:89.00, desc:'True wireless earbuds with ANC'},
    {id:6, category:'accessory', title:'Screen Protector', price:12.00, desc:'Tempered glass screen protector'}
  ]

  // cart stored as array of {id, qty}
  let cart = loadCart()
  const state = { query: '', category: 'all' }

  function loadCart(){
    try{ const raw = localStorage.getItem('brezzy_cart')
      if(!raw) return []
      const parsed = JSON.parse(raw)
      if(!Array.isArray(parsed)) return []
      return parsed.map(i=>({id: Number(i.id), qty: Math.max(1, Number(i.qty)||1)}))
    } catch(e){ return [] }
  }

  function saveCart(){ localStorage.setItem('brezzy_cart', JSON.stringify(cart)) }

  function totalItems(){ return cart.reduce((s,i)=>s + (i.qty||0), 0) }

  function formatPrice(n){ return n.toFixed(2) }

  function findProduct(id){ return products.find(p=>p.id===Number(id)) }

  function renderProducts(){
    const grid = $('#productsGrid'); if(!grid) return
    grid.innerHTML = ''
    const filtered = products.filter(p=>{
      if(state.category !== 'all' && p.category !== state.category) return false
      if(state.query){ const q = state.query.toLowerCase(); return p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) }
      return true
    })
    filtered.forEach(p=>{
      const card = document.createElement('article'); card.className = 'product-card'
      card.dataset.id = p.id
      card.innerHTML = `
        <div class="product-thumb">${p.title.split(' ')[1]||p.title}</div>
        <div class="product-title">${p.title}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-price">$${formatPrice(p.price)}</div>
        <div class="product-actions">
          <button class="btn ghost btn-view" data-id="${p.id}">View</button>
          <button class="btn primary btn-add" data-id="${p.id}">Add</button>
        </div>`
      grid.appendChild(card)
    })

    $$('.btn-add').forEach(b => b.addEventListener('click', e=>{ addToCart(Number(e.currentTarget.dataset.id)) }))
    $$('.btn-view').forEach(b => b.addEventListener('click', e=>{ openProductModal(Number(e.currentTarget.dataset.id)) }))
  }

  function renderCart(){
    const countEl = $('#cartCount'); if(countEl) countEl.textContent = totalItems()
    const list = $('#cartList'); if(!list) return
    list.innerHTML = ''
    let total = 0
    cart.forEach(item=>{
      const p = findProduct(item.id); if(!p) return
      const lineTotal = p.price * item.qty
      total += lineTotal
      const li = document.createElement('li')
      li.innerHTML = `
        <div>
          <strong>${p.title}</strong>
          <div class="cart-qty">Qty: <button class="qty-btn" data-id="${p.id}" data-op="dec">−</button> <span class="qty-val">${item.qty}</span> <button class="qty-btn" data-id="${p.id}" data-op="inc">+</button></div>
        </div>
        <div>
          <span>$${formatPrice(lineTotal)}</span>
          <button class="remove-btn" data-id="${p.id}">Remove</button>
        </div>`
      list.appendChild(li)
    })
    $('#cartTotal').textContent = formatPrice(total)

    $$('.qty-btn').forEach(b => b.addEventListener('click', onQty))
    $$('.remove-btn').forEach(b => b.addEventListener('click', onRemove))
  }

  function addToCart(id, qty = 1){
    const p = findProduct(id); if(!p) return
    const existing = cart.find(i=>i.id===id)
    if(existing) existing.qty = existing.qty + qty
    else cart.push({id, qty})
    saveCart(); renderCart(); flashCartCount()
  }

  function onQty(e){
    const id = Number(e.currentTarget.dataset.id); const op = e.currentTarget.dataset.op
    const item = cart.find(i=>i.id===id); if(!item) return
    if(op === 'inc') item.qty = item.qty + 1
    if(op === 'dec') item.qty = Math.max(1, item.qty - 1)
    saveCart(); renderCart()
  }

  function onRemove(e){
    const id = Number(e.currentTarget.dataset.id)
    cart = cart.filter(i=>i.id!==id)
    saveCart(); renderCart()
  }

  function flashCartCount(){
    const el = $('#cartCount'); if(!el) return
    el.animate([{transform:'scale(1)'},{transform:'scale(1.2)'},{transform:'scale(1)'}],{duration:300})
  }

  function openCart(){ $('#cartModal').hidden = false; renderCart() }
  function closeCart(){ $('#cartModal').hidden = true }

  function openCheckout(){ if(cart.length === 0){ alert('Your cart is empty'); return } $('#checkoutArea').hidden = false; $('#checkoutMessage').hidden = true }
  function closeCheckout(){ $('#checkoutArea').hidden = true }

  function onPlaceOrder(e){
    e.preventDefault()
    const name = $('#custName').value.trim(); const email = $('#custEmail').value.trim(); const address = $('#custAddress').value.trim()
    if(!name || !email || !address){ alert('Please complete all required fields'); return }
    $('#placeOrder').disabled = true; $('#placeOrder').textContent = 'Processing...'
    setTimeout(()=>{
      cart = []
      saveCart(); renderCart()
      $('#checkoutMessage').textContent = `Thanks ${name}! Your order was placed.`; $('#checkoutMessage').hidden = false; $('#checkoutForm').hidden = true
      $('#placeOrder').disabled = false; $('#placeOrder').textContent = 'Place order'
      setTimeout(()=>{ $('#cartModal').hidden = true; $('#checkoutForm').hidden = false; $('#checkoutArea').hidden = true; $('#checkoutMessage').hidden = true; $('#checkoutForm').reset() }, 1600)
    }, 900)
  }

  // product modal
  function openProductModal(id){
    const p = findProduct(id); if(!p) return
    const detail = $('#productDetail'); if(!detail) return
    detail.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <p class="product-price">$${formatPrice(p.price)}</p>
      <div style="margin-top:12px"><button class="btn primary modal-add" data-id="${p.id}">Add to cart</button></div>`
    $('#productModal').hidden = false
    $$('.modal-add').forEach(b=>b.addEventListener('click', (e)=>{ addToCart(Number(e.currentTarget.dataset.id)); $('#productModal').hidden = true }))
  }

  function bindUI(){
    const cartBtn = $('#cartBtn'); if(cartBtn) cartBtn.addEventListener('click', e=>{ e.preventDefault(); openCart() })
    const closeCartBtn = $('#closeCart'); if(closeCartBtn) closeCartBtn.addEventListener('click', closeCart)
    const cartModal = $('#cartModal'); if(cartModal) cartModal.addEventListener('click', e=>{ if(e.target === cartModal) closeCart() })

    $('#checkoutBtn')?.addEventListener('click', openCheckout)
    $('#cancelCheckout')?.addEventListener('click', closeCheckout)
    $('#checkoutForm')?.addEventListener('submit', onPlaceOrder)

    $('#searchInput')?.addEventListener('input', e=>{ state.query = e.target.value.trim(); renderProducts() })
    $$('.cat-btn').forEach(b=> b.addEventListener('click', e=>{ $$('.cat-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); state.category = b.dataset.cat; renderProducts() }))

    $('#productModal')?.addEventListener('click', e=>{ if(e.target === $('#productModal')) $('#productModal').hidden = true })
    $('#closeProduct')?.addEventListener('click', ()=>{ $('#productModal').hidden = true })

    const themeBtn = $('#themeBtn')
    if(themeBtn){ themeBtn.addEventListener('click', ()=>{ toggleTheme(); themeBtn.textContent = document.documentElement.classList.contains('theme-light') ? 'Light' : 'Dark' }) }
  }

  function init(){ renderProducts(); bindUI(); renderCart(); $('#year').textContent = new Date().getFullYear(); $('#newsletterForm')?.addEventListener('submit', e=>{ e.preventDefault(); alert('Thanks — we\'ll keep you posted!'); $('#emailInput').value = '' }) }

  function setTheme(theme){ if(theme === 'light'){ document.documentElement.classList.add('theme-light'); localStorage.setItem('brezzy_theme','light') } else { document.documentElement.classList.remove('theme-light'); localStorage.setItem('brezzy_theme','dark') } const btn = $('#themeBtn'); if(btn) btn.textContent = document.documentElement.classList.contains('theme-light') ? 'Light' : 'Dark' }
  function toggleTheme(){ setTheme(document.documentElement.classList.contains('theme-light') ? 'dark' : 'light') }
  const savedTheme = localStorage.getItem('brezzy_theme') || 'dark'
  if(savedTheme === 'light') document.documentElement.classList.add('theme-light')

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
  else init()

})()