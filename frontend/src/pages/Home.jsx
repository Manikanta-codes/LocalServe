import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ServiceCard from '../components/ServiceCard';
import Loading from '../components/Loading';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, servRes] = await Promise.all([
          axiosInstance.get('/categories'),
          axiosInstance.get('/services')
        ]);
        setCategories(catRes.data.data || []);
        setServices(servRes.data.data || []);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '4rem 2rem',
        borderRadius: '16px',
        marginBottom: '3rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
          Find Trusted Local Home Services, On Demand
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '700px', margin: '0 auto 2rem auto' }}>
          Book verified plumbers, electricians, cleaners, and technicians near you with instant booking and transparent pricing.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/services" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
            Explore Services 🔍
          </Link>
          <Link to="/register" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
            Become a Provider 🛠️
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>
          Browse Service Categories
        </h2>
        
        {loading ? (
          <Loading />
        ) : (
          <div className="grid-3">
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/services?category=${cat.id}`}
                className="card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {cat.name.includes('Plumbing') ? '🚰' : 
                   cat.name.includes('Electrical') ? '⚡' : 
                   cat.name.includes('Cleaning') ? '🧹' : 
                   cat.name.includes('Appliance') ? '🔧' : '🌿'}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem', color: '#0f172a' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Popular Services Section */}
      <section>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>
            Popular Services Near You
          </h2>
          <Link to="/services" style={{ fontWeight: '600' }}>
            View All ({services.length}) &rarr;
          </Link>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid-3">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
