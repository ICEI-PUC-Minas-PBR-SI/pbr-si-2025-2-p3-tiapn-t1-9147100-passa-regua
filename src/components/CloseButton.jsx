import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CloseButton renders an "X" icon positioned in the top left corner
 * of the auth container. Clicking it will navigate the user back to
 * the previous page or the login screen if no history exists. It
 * supports custom onClick behaviour via props.
 */
export default function CloseButton({ onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    else navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
      }}
      aria-label="Fechar"
    >
      ×
    </button>
  );
}