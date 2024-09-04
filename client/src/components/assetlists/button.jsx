import React from 'react';

const Button = ({ className, onClick, children }) => (
  <button className={`px-4 py-2 rounded-lg ${className}`} onClick={onClick}>
    {children}
  </button>
);

export default Button;
