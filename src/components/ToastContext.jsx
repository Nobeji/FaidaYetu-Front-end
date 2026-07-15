import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)); }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
        {toasts.map(t => (
          <div key={t.id} className="toast-enter" style={{
            padding: '12px 20px', borderRadius: 10,
            background: t.type === 'error' ? '#fef2f2' : t.type === 'success' ? '#f0fdf4' : '#f8fafc',
            color: t.type === 'error' ? '#dc2626' : t.type === 'success' ? '#15803d' : '#475569',
            fontSize: 14, fontWeight: 500,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            border: `1px solid ${t.type === 'error' ? '#fecaca' : t.type === 'success' ? '#bbf7d0' : '#e2e8f0'}`,
            display: 'flex', alignItems: 'center', gap: 8, animation: 'slideIn 0.3s ease',
          }}>
            <span>{t.type === 'error' ? '✕' : t.type === 'success' ? '✓' : 'ℹ'}</span>{t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </ToastContext.Provider>
  );
}

export function useToast() { return useContext(ToastContext); }
