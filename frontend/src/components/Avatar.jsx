import React from 'react';

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < (str || '').length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const COLORS = [
  '#6b7280', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'
];

export default function Avatar({ name = '', email = '', size = 28, className = '' }) {
  const seed = email || name || '?';
  const idx = hashCode(seed) % COLORS.length;
  const bg = COLORS[idx];
  const initial = (name || email || '?').trim().charAt(0).toUpperCase() || '?';

  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: bg,
    color: '#fff',
    marginRight: 10,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: Math.max(10, Math.floor(size * 0.5)),
    lineHeight: 1,
    userSelect: 'none',
  };

  return (
    <div className={`avatar ${className}`} style={style} aria-hidden>
      {initial}
    </div>
  );
}

