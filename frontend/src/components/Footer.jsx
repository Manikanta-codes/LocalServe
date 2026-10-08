import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p>&copy; {new Date().getFullYear()} <strong>LOCAL SERVE</strong> - Local On-Demand Services Platform.</p>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#64748b' }}>
          Connecting homeowners with trusted local service professionals.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
