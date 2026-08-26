// ===== Attendance Tracker Logic =====
// Data model: array of { id, name, participantId, status } where status is 'present' | 'absent' | null

const STORAGE_KEY = 'attendance_tracker_participants';

let participants = loadParticipants();

// ----- DOM references -----
const addForm = document.getElementById('addForm');
const nameInput = document.getElementById('participantName');
const idInput = document.getElementById('participantId');
const formError = document.getElementById('formError');

const searchBox = document.getElementById('searchBox');
const filterSelect = document.getElementById('filterSelect');
const resetAllBtn = document.getElementById('resetAllBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

const tbody = document.getElementById('participantsBody');
const emptyState = document.getElementById('emptyState');

const totalCountEl = document.getElementById('totalCount');
const presentCountEl = document.getElementById('presentCount');
const absentCountEl = document.getElementById('absentCount');
const unmarkedCountEl = document.getElementById('unmarkedCount');

// ----- Storage helpers -----
function loadParticipants() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load participants', e);
    return [];
  }
}

function saveParticipants() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
}

// ----- Add participant -----
addForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = nameInput.value.trim();
  const participantId = idInput.value.trim();

  formError.textContent = '';

  if (!name || !participantId) {
    formError.textContent = 'Please fill in both Name and Participant ID.';
    return;
  }

  const duplicate = participants.some(
    p => p.participantId.toLowerCase() === participantId.toLowerCase()
  );
  if (duplicate) {
    formError.textContent = 'A participant with this ID already exists.';
    return;
  }

  participants.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name,
    participantId,
    status: null // not marked yet
  });

  saveParticipants();
  nameInput.value = '';
  idInput.value = '';
  nameInput.focus();
  render();
});

// ----- Mark attendance -----
function markStatus(id, status) {
  const p = participants.find(p => p.id === id);
  if (!p) return;
  // toggle off if clicking the same status again
  p.status = p.status === status ? null : status;
  saveParticipants();
  render();
}

// ----- Remove participant -----
function removeParticipant(id) {
  if (!confirm('Remove this participant?')) return;
  participants = participants.filter(p => p.id !== id);
  saveParticipants();
  render();
}

// ----- Bulk actions -----
resetAllBtn.addEventListener('click', function () {
  if (participants.length === 0) return;
  if (!confirm('Mark ALL participants as Absent for this session?')) return;
  participants.forEach(p => p.status = 'absent');
  saveParticipants();
  render();
});

clearAllBtn.addEventListener('click', function () {
  if (participants.length === 0) return;
  if (!confirm('This will permanently delete all participants and attendance data. Continue?')) return;
  participants = [];
  saveParticipants();
  render();
});

// ----- Search & filter -----
searchBox.addEventListener('input', render);
filterSelect.addEventListener('change', render);

// ----- Render -----
function render() {
  const query = searchBox.value.trim().toLowerCase();
  const filter = filterSelect.value;

  let visible = participants.filter(p => {
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.participantId.toLowerCase().includes(query);

    const statusKey = p.status || 'unmarked';
    const matchesFilter = filter === 'all' || statusKey === filter;

    return matchesSearch && matchesFilter;
  });

  tbody.innerHTML = '';

  if (participants.length === 0) {
    emptyState.style.display = 'block';
    emptyState.textContent = 'No participants added yet. Add one above to get started.';
  } else if (visible.length === 0) {
    emptyState.style.display = 'block';
    emptyState.textContent = 'No participants match your search/filter.';
  } else {
    emptyState.style.display = 'none';
  }

  visible.forEach((p, index) => {
    const tr = document.createElement('tr');

    const statusLabel = p.status === 'present' ? 'Present' : p.status === 'absent' ? 'Absent' : 'Not Marked';
    const statusClass = p.status === 'present' ? 'status-present' : p.status === 'absent' ? 'status-absent' : 'status-unmarked';

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(p.participantId)}</td>
      <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
      <td>
        <div class="mark-btns">
          <button class="mark-btn present-btn ${p.status === 'present' ? 'active' : ''}" data-id="${p.id}" data-status="present">Present</button>
          <button class="mark-btn absent-btn ${p.status === 'absent' ? 'active' : ''}" data-id="${p.id}" data-status="absent">Absent</button>
        </div>
      </td>
      <td><button class="remove-btn" data-id="${p.id}" title="Remove participant">✕</button></td>
    `;

    tbody.appendChild(tr);
  });

  // attach event listeners for the newly created buttons
  tbody.querySelectorAll('.mark-btn').forEach(btn => {
    btn.addEventListener('click', () => markStatus(btn.dataset.id, btn.dataset.status));
  });
  tbody.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeParticipant(btn.dataset.id));
  });

  updateSummary();
}

function updateSummary() {
  const total = participants.length;
  const present = participants.filter(p => p.status === 'present').length;
  const absent = participants.filter(p => p.status === 'absent').length;
  const unmarked = total - present - absent;

  totalCountEl.textContent = total;
  presentCountEl.textContent = present;
  absentCountEl.textContent = absent;
  unmarkedCountEl.textContent = unmarked;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// initial render
render();
