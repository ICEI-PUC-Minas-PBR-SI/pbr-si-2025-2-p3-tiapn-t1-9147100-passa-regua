import React from 'react';

/*
 * Header component used across pages to render a consistent top bar. It accepts
 * callbacks for back, exit, edit and notification actions. When no action is
 * provided on either side, a placeholder preserves spacing to maintain
 * alignment. Modern inline SVG icons are included to remove reliance on
 * emojis and provide a cleaner, more professional look.
 */

/**
 * Simple icon library. Each entry returns an SVG element sized at 20x20 with
 * a stroked outline. The icons were designed by hand based on popular
 * open‑source icon sets (e.g. Heroicons) and therefore do not require any
 * external dependencies. Feel free to extend this list with additional
 * names if new icons are needed elsewhere.
 */
export function Icon({ type }) {
  switch (type) {
    case 'back':
      // Left arrow
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      );
    case 'exit':
      // Cross used for exit/close
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </svg>
      );
    case 'edit':
      // Pencil/edit icon
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z" />
        </svg>
      );
    case 'bell':
      // Notification bell
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case 'plus':
      // Plus symbol
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case 'minus':
      // Minus symbol
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case 'check':
      // Check mark
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case 'x':
      // Cross (small) for cancellation
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    case 'eye':
      // Eye/view icon
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'mail':
      // Envelope/mail icon
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case 'trash':
      // Trash/delete icon
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
      );
    case 'logout':
      // Logout/leave icon (arrow exiting a door)
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 17l-5-5 5-5" />
          <path d="M15 12H5" />
          <path d="M19 21V3a2 2 0 0 0-2-2h-3" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Header({ title, onBack, onExit, onEdit, onNotification, notificationCount = 0 }) {
  return (
    <div className="header">
      {onBack ? (
        <button type="button" className="header-btn" onClick={onBack} aria-label="Voltar">
          <Icon type="back" />
        </button>
      ) : onExit ? (
        <button type="button" className="header-btn" onClick={onExit} aria-label="Sair">
          <Icon type="exit" />
        </button>
      ) : (
        <span className="header-placeholder" />
      )}
      <div className="header-title">{title}</div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {onEdit && (
          <button type="button" className="header-btn" onClick={onEdit} aria-label="Editar">
            <Icon type="edit" />
          </button>
        )}
        {onNotification && (
          <button type="button" className="header-btn" onClick={onNotification} aria-label="Notificações" style={{ position: 'relative' }}>
            <Icon type="bell" />
            {notificationCount > 0 && <span className="badge">{notificationCount}</span>}
          </button>
        )}
        {!onEdit && !onNotification && <span className="header-placeholder" />}
      </div>
    </div>
  );
}
