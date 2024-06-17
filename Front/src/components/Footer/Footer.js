import './Footer.css';

export const Footer = () => {
  const footer = document.createElement('footer');
  const footerText = document.createElement('h3');
  footerText.textContent = '© 2024 - Apúntate a eventos. Elena de la Torre.';
  footer.appendChild(footerText);

  document.body.appendChild(footer);
};
