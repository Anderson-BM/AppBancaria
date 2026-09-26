import { useMemo, useState } from 'react';
import FixedExpenseForm from './FixedExpenseForm.jsx';
import FixedExpensesTable from './FixedExpensesTable.jsx';
import PieChart from './PieChart.jsx';
import { formatCurrency } from '../../utils/format.js';
import { genId } from '../../utils/format.js';
import './FixedExpensesPage.css';

export default function FixedExpensesPage({ data, setData }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const items = data.fixedExpenses;
  const total = useMemo(() => items.reduce((sum, i) => sum + i.amount, 0), [items]);
  const limit = data.fixedLimit || 0;
  const percentUsed = limit > 0 ? Math.min((total / limit) * 100, 100) : 0;
  const overLimit = total > limit;

  let barClass = 'bar-fill';
  if (percentUsed >= 100) barClass += ' bar-fill--danger';
  else if (percentUsed >= 75) barClass += ' bar-fill--warning';

  function handleSave(itemForm) {
    setData((prev) => {
      if (editingItem) {
        return {
          ...prev,
          fixedExpenses: prev.fixedExpenses.map((i) =>
            i.id === editingItem.id ? { ...i, ...itemForm } : i,
          ),
        };
      }
      return { ...prev, fixedExpenses: [...prev.fixedExpenses, { ...itemForm, id: genId() }] };
    });
    setShowForm(false);
    setEditingItem(null);
  }

  function handleDelete(itemId) {
    setData((prev) => ({
      ...prev,
      fixedExpenses: prev.fixedExpenses.filter((i) => i.id !== itemId),
    }));
    setShowForm(false);
    setEditingItem(null);
  }

  function handleLimitChange(value) {
    const num = Number(value.replace(/[^\d.]/g, '')) || 0;
    setData((prev) => ({ ...prev, fixedLimit: num }));
  }

  return (
    <div className="fixed-page">
      <div className="section-heading">
        <h3>Gastos fijos del mes</h3>
        <button className="btn-add-expense" onClick={() => { setEditingItem(null); setShowForm(true); }}>
          + Gasto fijo
        </button>
      </div>

      <div className="summary-limit-card">
        <div className="summary-limit-top">
          <span className="summary-label">Total gastos fijos</span>
          <span className={`summary-spent ${overLimit ? 'summary-spent--over' : ''}`}>
            {formatCurrency(total)}
          </span>
        </div>
        <div className="bar-track">
          <div className={barClass} style={{ width: `${percentUsed}%` }} />
        </div>
        <div className="summary-limit-bottom">
          <span>{overLimit ? '¡Superaste el límite!' : `${formatCurrency(Math.max(limit - total, 0))} disponible`}</span>
          <span className="fixed-limit-edit">
            No pasar de
            <input
              type="text"
              inputMode="decimal"
              value={limit}
              onChange={(e) => handleLimitChange(e.target.value)}
            />
          </span>
        </div>
      </div>

      <FixedExpensesTable items={items} onEdit={(item) => { setEditingItem(item); setShowForm(true); }} />

      <PieChart items={items} />

      {showForm && (
        <FixedExpenseForm
          initialItem={editingItem}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => { setShowForm(false); setEditingItem(null); }}
        />
      )}
    </div>
  );
}
