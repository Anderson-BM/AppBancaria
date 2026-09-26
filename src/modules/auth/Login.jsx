import { useMemo, useState } from 'react';
import './Login.css';

export default function Login({ auth }) {
  const isNewUser = useMemo(() => !auth.hasPin(), [auth]);

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  function triggerError(message) {
    setError(message);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (isNewUser) {
      if (pin.length < 4) {
        triggerError('Usa al menos 4 dígitos.');
        return;
      }
      if (pin !== confirmPin) {
        triggerError('Los PIN no coinciden.');
        return;
      }
      auth.createPin(pin);
      return;
    }

    const ok = auth.login(pin);
    if (!ok) {
      triggerError('PIN incorrecto.');
      setPin('');
    }
  }

  return (
    <div className="login-screen">
      <div className={`login-card ${shake ? 'login-card--shake' : ''}`}>
        <div className="login-icon">💳</div>
        <h1>Mis Tarjetas</h1>
        <p className="login-subtitle">
          {isNewUser
            ? 'Crea un PIN para proteger tu información.'
            : 'Ingresa tu PIN para continuar.'}
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            maxLength={8}
            className="login-input"
          />

          {isNewUser && (
            <input
              type="password"
              inputMode="numeric"
              placeholder="Confirmar PIN"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
              maxLength={8}
              className="login-input"
            />
          )}

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            {isNewUser ? 'Crear PIN y entrar' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
