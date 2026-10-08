import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ServiceCard from '../components/ServiceCard';
import Loading from '../components/Loading';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        let url = '/services';
        const params = new URLSearchParams();
        if (selectedCategory) params.append('categoryId', selectedCategory);
        if (searchTerm) params.append('search', searchTerm);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await axiosInstance.get(url);
        setServices(res.data.data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchServices();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, searchTerm]);

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>
            Available Local Services
          </h1>
          <p style={{ color: '#64748b' }}>Browse and book verified professionals in your area</p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '220px' }}
          />

          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Loading message="Searching services..." />
      ) : services.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>No services found</h3>
          <p style={{ color: '#94a3b8' }}>Try adjusting your search criteria or category filter.</p>
        </div>
      ) : (
        <div className="grid-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
