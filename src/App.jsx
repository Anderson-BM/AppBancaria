import { useEffect, useMemo, useState } from 'react';
import './App.css';

import { useAuth } from './modules/auth/useAuth.js';
import Login from './modules/auth/Login.jsx';
import { useTheme } from './hooks/useTheme.js';

import CardFloating from './modules/cards/CardFloating.jsx';
import CardSelector from './modules/cards/CardSelector.jsx';
import CardForm from './modules/cards/CardForm.jsx';

import MonthSelector from './modules/expenses/MonthSelector.jsx';
import ExpenseForm from './modules/expenses/ExpenseForm.jsx';
import ExpenseTable from './modules/expenses/ExpenseTable.jsx';

import SummaryCards from './modules/dashboard/SummaryCards.jsx';
import CategoryBreakdown from './modules/dashboard/CategoryBreakdown.jsx';

import { loadData, saveData, exportBackup } from './storage/storage.js';
import { genId, currentMonthKey, monthKeyFromDate } from './utils/format.js';

export default function App() {
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!auth.authenticated) {
    return (
      <>
        <button className="theme-toggle theme-toggle--floating" onClick={toggleTheme} title="Cambiar tema">
          {theme === 'dark' ? '☀' : '🌙'}
        </button>
        <Login auth={auth} />
      </>
    );
  }

  return <MainApp auth={auth} theme={theme} toggleTheme={toggleTheme} />;
}

function MainApp({ auth, theme, toggleTheme }) {
  const [data, setData] = useState(() => loadData());
  const [activeCardId, setActiveCardId] = useState(() => loadData().cards[0]?.id ?? null);
  const [monthKey, setMonthKey] = useState(currentMonthKey());

  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    if (!activeCardId && data.cards.length > 0) {
      setActiveCardId(data.cards[0].id);
    }
  }, [data.cards, activeCardId]);

  const activeCard = useMemo(
    () => data.cards.find((c) => c.id === activeCardId) || null,
    [data.cards, activeCardId],
  );

  const monthExpenses = useMemo(() => {
    if (!activeCard) return [];
    return data.expenses.filter(
      (e) => e.cardId === activeCard.id && monthKeyFromDate(e.date) === monthKey,
    );
  }, [data.expenses, activeCard, monthKey]);

  const totalSpent = useMemo(
    () => monthExpenses.reduce((sum, e) => sum + e.amount, 0),
    [monthExpenses],
  );

  // --- acciones sobre tarjetas ---
  function handleSaveCard(cardForm) {
    setData((prev) => {
      if (editingCard) {
        return {
          ...prev,
          cards: prev.cards.map((c) => (c.id === editingCard.id ? { ...c, ...cardForm } : c)),
        };
      }
      const newCard = { ...cardForm, id: genId() };
      setActiveCardId(newCard.id);
      return { ...prev, cards: [...prev.cards, newCard] };
    });
    setShowCardForm(false);
    setEditingCard(null);
  }

  function handleDeleteCard(cardId) {
    if (!confirm('¿Eliminar esta tarjeta y todos sus gastos registrados?')) return;
    setData((prev) => ({
      ...prev,
      cards: prev.cards.filter((c) => c.id !== cardId),
      expenses: prev.expenses.filter((e) => e.cardId !== cardId),
    }));
    setShowCardForm(false);
    setEditingCard(null);
    setActiveCardId((id) => (id === cardId ? null : id));
  }

  // --- acciones sobre gastos ---
  function handleSaveExpense(expenseForm) {
    if (!activeCard) return;
    const newExpense = { ...expenseForm, id: genId(), cardId: activeCard.id };
    setData((prev) => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
    setShowExpenseForm(false);
  }

  function handleDeleteExpense(expenseId) {
    setData((prev) => ({ ...prev, expenses: prev.expenses.filter((e) => e.id !== expenseId) }));
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">Hola de nuevo</p>
          <h1>Mis Tarjetas</h1>
        </div>
        <div className="app-header-actions">
          <button className="icon-btn" onClick={toggleTheme} title="Cambiar tema">
            {theme === 'dark' ? '☀' : '🌙'}
          </button>
          <button className="icon-btn" onClick={exportBackup} title="Descargar respaldo">
            ⬇
          </button>
          <button className="icon-btn" onClick={auth.logout} title="Cerrar sesión">
            ⏻
          </button>
        </div>
      </header>

      <CardFloating
        card={activeCard}
        onEdit={() => {
          if (!activeCard) return;
          setEditingCard(activeCard);
          setShowCardForm(true);
        }}
      />

      <CardSelector
        cards={data.cards}
        activeCardId={activeCardId}
        onSelect={setActiveCardId}
        onAdd={() => {
          setEditingCard(null);
          setShowCardForm(true);
        }}
      />

      {activeCard ? (
        <>
          <MonthSelector monthKey={monthKey} onChange={setMonthKey} />
          <SummaryCards card={activeCard} totalSpent={totalSpent} />
          <CategoryBreakdown expenses={monthExpenses} />

          <div className="section-heading">
            <h3>Movimientos</h3>
            <button className="btn-add-expense" onClick={() => setShowExpenseForm(true)}>
              + Gasto
            </button>
          </div>
          <ExpenseTable expenses={monthExpenses} onDelete={handleDeleteExpense} />
        </>
      ) : (
        <div className="no-cards-hint">
          <p>Agrega tu primera tarjeta para empezar a llevar el control.</p>
        </div>
      )}

      {showCardForm && (
        <CardForm
          initialCard={editingCard}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
          onClose={() => {
            setShowCardForm(false);
            setEditingCard(null);
          }}
        />
      )}

      {showExpenseForm && activeCard && (
        <ExpenseForm
          cardName={activeCard.name}
          onSave={handleSaveExpense}
          onClose={() => setShowExpenseForm(false)}
        />
      )}
    </div>
  );
}
