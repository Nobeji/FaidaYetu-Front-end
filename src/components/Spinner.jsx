import { useEffect } from 'react';

const styleId = 'spinner-keyframes';

export default function Spinner({ size = 14, color = '#fff' }) {
  useEffect(() => {
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <span style={{
      display: 'inline-block',
      width: size,
      height: size,
      border: `2px solid ${color}44`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite',
      verticalAlign: 'middle',
      flexShrink: 0,
    }} />
  );
}
