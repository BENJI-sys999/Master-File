(function(){
  const LS_PREFIX = 'studentcomm_'
  const $ = s => document.querySelector(s)
  const $$ = s => document.querySelectorAll(s)

  let state = { rooms: [], current: null, username: null, polls: null, resources: [], events: [], highlights: [], lang: 'en', highContrast: false }

  function saveRooms(){localStorage.setItem(LS_PREFIX+'rooms', JSON.stringify(state.rooms))}
  function loadRooms(){return JSON.parse(localStorage.getItem(LS_PREFIX+'rooms')||'null')}
  function getMessages(room){return JSON.parse(localStorage.getItem(LS_PREFIX+'msgs_'+room)||'[]')}
  function saveMessages(room,msgs){localStorage.setItem(LS_PREFIX+'msgs_'+room, JSON.stringify(msgs))}

  function renderRooms(){
    const ul = $('#roomsList'); ul.innerHTML=''
    state.rooms.forEach(r=>{
      const li = document.createElement('li'); li.textContent = r
      if(r===state.current) li.classList.add('active')
      li.addEventListener('click', ()=>{ switchRoom(r) })
      // animate newly added room
      if(state.lastAdded === r){ li.classList.add('pop'); setTimeout(()=>li.classList.remove('pop'), 700); state.lastAdded = null }
      ul.appendChild(li)
    })
  }

  function renderMessages(){
    const box = $('#messages'); box.innerHTML=''
    const msgs = getMessages(state.current)
    msgs.forEach(m=>{
      const d = document.createElement('div'); d.className='msg'+(m.user===state.username?' me':'')
      const meta = document.createElement('div'); meta.className='meta'; meta.textContent = m.user+' • '+new Date(m.time).toLocaleTimeString()
      const body = document.createElement('div'); body.className='body'; body.textContent = m.text
      d.appendChild(meta); d.appendChild(body); box.appendChild(d)
      // trigger entry animation
      requestAnimationFrame(()=>{ d.classList.add('msg-enter'); setTimeout(()=>d.classList.remove('msg-enter'),400) })
    })
    box.scrollTop = box.scrollHeight
  }

  function renderResources(){
    const ul = document.getElementById('resourcesList'); if(!ul) return
    ul.innerHTML = ''
    state.resources.forEach(r=>{
      const li = document.createElement('li')
      const a = document.createElement('a'); a.href = r.href||'#'; a.textContent = r.title
      li.appendChild(a); ul.appendChild(li)
    })
  }

  function renderEvents(){
    const ul = document.getElementById('eventsList'); if(!ul) return
    ul.innerHTML = ''
    if(state.events.length===0){ ul.innerHTML = '<li>No upcoming events.</li>'; return }
    state.events.forEach(e=>{ const li=document.createElement('li'); li.textContent = e; ul.appendChild(li) })
  }

  function renderHighlights(){
    const ul = document.getElementById('highlightsList'); if(!ul) return
    ul.innerHTML = ''
    state.highlights.forEach(h=>{ const li=document.createElement('li'); li.textContent = h; ul.appendChild(li) })
  }

  function renderPoll(){
    const box = document.getElementById('pollBox'); if(!box) return
    const poll = state.polls
    if(!poll){ box.textContent = 'No poll yet.'; return }
    box.innerHTML = ''
    const q = document.createElement('div'); q.textContent = poll.question; box.appendChild(q)
    poll.options.forEach((opt,idx)=>{
      const row = document.createElement('div'); row.className='poll-option'
      const label = document.createElement('div'); label.textContent = opt.text + ' ('+ (opt.votes||0) +')'
      const btn = document.createElement('button'); btn.textContent = 'Vote'
      btn.addEventListener('click', ()=>{ opt.votes = (opt.votes||0)+1; localStorage.setItem(LS_PREFIX+'poll', JSON.stringify(poll)); renderPoll() })
      btn.addEventListener('click', ()=>{
        opt.votes = (opt.votes||0)+1; localStorage.setItem(LS_PREFIX+'poll', JSON.stringify(poll));
        // briefly highlight the option
        row.classList.add('voted'); setTimeout(()=>row.classList.remove('voted'),400)
        renderPoll()
      })
      row.appendChild(label); row.appendChild(btn); box.appendChild(row)
    })
  }

  function toggleLayout(){
    const using = document.documentElement.classList.toggle('layout-split')
    localStorage.setItem(LS_PREFIX+'layout', using ? 'split' : 'sidebar')
    // small visual feedback
    const btn = document.getElementById('layoutBtn'); if(btn){ btn.textContent = using? 'Split' : 'Layout' }
  }

  function updateAvatar(){
    const el = document.getElementById('avatar'); if(!el) return
    const name = state.username||''; const initials = name.split(' ').map(s=>s[0]).filter(Boolean).slice(0,2).join('').toUpperCase()||'?'
    el.textContent = initials
  }

  function toggleContrast(){
    state.highContrast = !state.highContrast
    document.documentElement.classList.toggle('high-contrast', state.highContrast)
    localStorage.setItem(LS_PREFIX+'contrast', state.highContrast? '1':'0')
  }

  function setLanguage(lang){ state.lang = lang; document.documentElement.lang = lang; localStorage.setItem(LS_PREFIX+'lang', lang) }

  function switchRoom(name){ state.current = name; localStorage.setItem(LS_PREFIX+'current', name); $('#roomTitle').textContent = name; renderRooms(); renderMessages() }

  function postMessage(text){
    if(!text) return
    const msgs = getMessages(state.current)
    msgs.push({user: state.username||'Anonymous', text, time: Date.now()})
    saveMessages(state.current, msgs); renderMessages()
  }

  function init(){
    state.username = localStorage.getItem(LS_PREFIX+'username') || ''
    $('#usernameInput').value = state.username
    state.rooms = loadRooms() || ['General']
    state.current = localStorage.getItem(LS_PREFIX+'current') || state.rooms[0]
    const ann = localStorage.getItem(LS_PREFIX+'announcement')
    if(ann) $('#announcement').textContent = ann
    // load extras
    state.resources = JSON.parse(localStorage.getItem(LS_PREFIX+'resources')||'[]')
    state.events = JSON.parse(localStorage.getItem(LS_PREFIX+'events')||'[]')
    state.highlights = JSON.parse(localStorage.getItem(LS_PREFIX+'highlights')||'[]')
    state.polls = JSON.parse(localStorage.getItem(LS_PREFIX+'poll')||'null')
    state.lang = localStorage.getItem(LS_PREFIX+'lang') || state.lang
    state.highContrast = !!localStorage.getItem(LS_PREFIX+'contrast')
    renderRooms(); switchRoom(state.current)
    renderResources(); renderEvents(); renderHighlights(); renderPoll(); updateAvatar(); if(state.highContrast) document.documentElement.classList.add('high-contrast')

    $('#setNameBtn').addEventListener('click', ()=>{
      state.username = $('#usernameInput').value.trim(); localStorage.setItem(LS_PREFIX+'username', state.username)
      updateAvatar()
    })

    $('#newRoomBtn').addEventListener('click', ()=>{
      const name = prompt('Room name')
      if(!name) return
      if(state.rooms.includes(name)) return alert('Room exists')
      state.rooms.push(name); saveRooms(); switchRoom(name)
    })

    $('#sendForm').addEventListener('submit', e=>{ e.preventDefault(); const v = $('#messageInput').value.trim(); if(!v) return; if(!state.username) { alert('Set your name first'); return } postMessage(v); $('#messageInput').value=''; })

    $('#announceBtn').addEventListener('click', ()=>{
      const a = $('#announceInput').value.trim(); if(!a) return; localStorage.setItem(LS_PREFIX+'announcement', a); $('#announcement').textContent = a; $('#announceInput').value=''
    })

    // language selector
    const langSel = document.getElementById('langSelect')
    if(langSel){ langSel.value = state.lang; langSel.addEventListener('change', e=>{ setLanguage(e.target.value) }) }

    const contrast = document.getElementById('contrastBtn')
    if(contrast) contrast.addEventListener('click', toggleContrast)

    const layoutBtn = document.getElementById('layoutBtn')
    if(layoutBtn) layoutBtn.addEventListener('click', toggleLayout)

    // restore layout preference
    const savedLayout = localStorage.getItem(LS_PREFIX+'layout')
    if(savedLayout === 'split') document.documentElement.classList.add('layout-split')

    // sample data if none
    if(state.resources.length===0){ state.resources = [{title:'Student handbook', href:'#'},{title:'Peer tutoring', href:'#'}]; localStorage.setItem(LS_PREFIX+'resources', JSON.stringify(state.resources)) }
    if(state.events.length===0){ state.events = ['Orientation — Sep 1']; localStorage.setItem(LS_PREFIX+'events', JSON.stringify(state.events)) }
    if(!state.polls){ state.polls = {question:'Preferred study time?', options:[{text:'Morning'},{text:'Afternoon'},{text:'Evening'}]}; localStorage.setItem(LS_PREFIX+'poll', JSON.stringify(state.polls)) }
    renderResources(); renderEvents(); renderHighlights(); renderPoll();
  }

  document.addEventListener('DOMContentLoaded', init)
})();
