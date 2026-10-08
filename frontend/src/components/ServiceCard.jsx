import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
            {service.categoryName || 'General'}
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2563eb' }}>
            ${service.price}
          </span>
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: '#0f172a' }}>
          {service.name}
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {service.description}
        </p>
      </div>

      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem' }}>
          <span>📍 {service.location}</span>
          <span>👤 {service.providerName}</span>
        </div>
        <Link to={`/services/${service.id}`} className="btn btn-primary" style={{ width: '100%' }}>
          View Details & Book
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
