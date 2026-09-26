// Capa de persistencia. Hoy guarda todo en localStorage;
// mañana, si conectas un backend, solo tienes que reescribir
// las funciones de este archivo (misma forma de datos hacia afuera).

const STORAGE_KEY = 'mis-tarjetas:data:v1';
const SESSION_KEY = 'mis-tarjetas:session';

const DEFAULT_DATA = {
  pin: null, // se define la primera vez que se usa la app
  cards: [],
  expenses: [],
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_DATA,
      ...parsed,
      cards: Array.isArray(parsed.cards) ? parsed.cards : [],
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
    };
  } catch (err) {
    console.error('No se pudo leer el almacenamiento local:', err);
    return { ...DEFAULT_DATA };
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('No se pudo guardar el almacenamiento local:', err);
    return false;
  }
}

export function exportBackup() {
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mis-tarjetas-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importBackup(jsonText) {
  const parsed = JSON.parse(jsonText);
  saveData({
    ...DEFAULT_DATA,
    ...parsed,
    cards: Array.isArray(parsed.cards) ? parsed.cards : [],
    expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
  });
}

// --- sesión (login) ---

export function setSessionActive() {
  sessionStorage.setItem(SESSION_KEY, '1');
}

export function isSessionActive() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// --- tema (claro / oscuro) ---

const THEME_KEY = 'mis-tarjetas:theme';

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
