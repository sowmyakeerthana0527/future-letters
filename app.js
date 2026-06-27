let dreams = JSON.parse(localStorage.getItem('tmfs-dreams') || '[]');
let checkins = JSON.parse(localStorage.getItem('tmfs-checkins') || '{}');

// ── Navigation ──
function openVault() {
  document.getElementById('cover').classList.add('hidden');
  document.getElementById('vault').classList.remove('hidden');
}

function showTab(name) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.remove('hidden');
  event.target.classList.add('active');

  if (name === 'dreams') renderDreams();
  if (name === 'checkin') renderCheckin();
}

// ── Save dream ──
function saveDream() {
  const title = document.getElementById('f-title').value.trim();
  const body = document.getElementById('f-body').value.trim();
  const date = document.getElementById('f-date').value;
  const cat = document.getElementById('f-cat').value;

  if (!title || !body || !date) {
    alert('fill in all fields before sealing ✨');
    return;
  }

  const dream = {
    id: Date.now(),
    title, body, date, cat,
    created: new Date().toISOString().split('T')[0]
  };

  dreams.push(dream);
  localStorage.setItem('tmfs-dreams', JSON.stringify(dreams));

  // reset form
  document.getElementById('f-title').value = '';
  document.getElementById('f-body').value = '';
  document.getElementById('f-date').value = '';

  showTab('dreams');
  document.querySelectorAll('.nav-btn')[0].classList.add('active');
  document.querySelectorAll('.nav-btn')[2].classList.remove('active');
}

// ── Render dreams ──
const catLabel = {
  career: 'Career & Finance',
  health: 'Health & Fitness',
  skills: 'Skills & Learning',
  travel: 'Travel & Experiences'
};

function renderDreams() {
  const el = document.getElementById('dream-cards');
  if (!dreams.length) {
    el.innerHTML = '<p class="empty-msg">nothing here yet. write your first dream ✨</p>';
    return;
  }
  el.innerHTML = dreams.map(d => `
    <div class="dream-card">
      <span class="cat-tag">${catLabel[d.cat]}</span>
      <h3>${d.title}</h3>
      <p>${d.body}</p>
      <div class="meta">
        <span>check in: ${d.date}</span>
        <span>written: ${d.created}</span>
        <button class="delete-btn" onclick="deleteDream(${d.id})">remove</button>
      </div>
    </div>
  `).join('');
}

// ── Render check-in ──
function renderCheckin() {
  const el = document.getElementById('checkin-cards');
  if (!dreams.length) {
    el.innerHTML = '<p class="empty-msg">no dreams to check in on yet.</p>';
    return;
  }
  el.innerHTML = dreams.map(d => `
    <div class="dream-card">
      <span class="cat-tag">${catLabel[d.cat]}</span>
      <h3>${d.title}</h3>
      <p>${d.body}</p>
      <div class="status-row">
        <button class="status-btn ${checkins[d.id]==='not started' ? 'active' : ''}"
          onclick="setStatus(${d.id}, 'not started', this)">not started</button>
        <button class="status-btn ${checkins[d.id]==='in progress' ? 'active' : ''}"
          onclick="setStatus(${d.id}, 'in progress', this)">in progress</button>
        <button class="status-btn ${checkins[d.id]==='achieved' ? 'active' : ''}"
          onclick="setStatus(${d.id}, 'achieved', this)">achieved ✓</button>
      </div>
    </div>
  `).join('');
}

// ── Status ──
function setStatus(id, status, btn) {
  checkins[id] = status;
  localStorage.setItem('tmfs-checkins', JSON.stringify(checkins));
  btn.closest('.status-row').querySelectorAll('.status-btn')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ── Delete ──
function deleteDream(id) {
  if (!confirm('remove this dream from your vault?')) return;
  dreams = dreams.filter(d => d.id !== id);
  localStorage.setItem('tmfs-dreams', JSON.stringify(dreams));
  renderDreams();
}

// Load on start
renderDreams();