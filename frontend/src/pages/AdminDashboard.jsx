import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Category Form State
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [uRes, cRes, sRes, bRes] = await Promise.all([
        axiosInstance.get('/users/all'),
        axiosInstance.get('/categories'),
        axiosInstance.get('/services'),
        axiosInstance.get('/bookings/all'),
      ]);

      setUsers(uRes.data.data || []);
      setCategories(cRes.data.data || []);
      setServices(sRes.data.data || []);
      setBookings(bRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingCategory) {
        await axiosInstance.put(`/categories/${editingCategory.id}`, categoryForm);
        setSuccess('Category updated successfully!');
      } else {
        await axiosInstance.post('/categories', categoryForm);
        setSuccess('Category created successfully!');
      }

      setCategoryForm({ name: '', description: '' });
      setEditingCategory(null);
      setShowCategoryForm(false);
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Category action failed.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category? Services using this category may be affected.')) return;
    try {
      await axiosInstance.delete(`/categories/${id}`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete service listing?')) return;
    try {
      await axiosInstance.delete(`/services/${id}`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete service.');
    }
  };

  if (loading) return <Loading message="Loading system administration portal..." />;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>
            Admin Control Center
          </h1>
          <p style={{ color: '#64748b' }}>System-wide management of categories, services, users, and platform bookings</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['categories', 'services', 'bookings', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {tab} ({tab === 'categories' ? categories.length : tab === 'services' ? services.length : tab === 'bookings' ? bookings.length : users.length})
            </button>
          ))}
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />
      {success && <div className="success-alert">✅ {success}</div>}

      {/* Categories Management Tab */}
      {activeTab === 'categories' && (
        <div>
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>Categories Directory</h2>
            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', description: '' });
                setShowCategoryForm(!showCategoryForm);
              }}
              className="btn btn-primary"
            >
              {showCategoryForm ? 'Cancel' : '+ Add New Category'}
            </button>
          </div>

          {showCategoryForm && (
            <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: '#0f172a' }}>
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <form onSubmit={handleCategorySubmit}>
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Carpentry & Furniture"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Category overview..."
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Save Category</button>
              </form>
            </div>
          )}

          <div className="grid-3">
            {categories.map((c) => (
              <div key={c.id} className="card flex-between" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem' }}>{c.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>{c.description}</p>
                </div>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setEditingCategory(c);
                      setCategoryForm({ name: c.name, description: c.description || '' });
                      setShowCategoryForm(true);
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteCategory(c.id)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Management Tab */}
      {activeTab === 'services' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>All System Services</h2>
          <div className="grid-2">
            {services.map((s) => (
              <div key={s.id} className="card flex-between">
                <div>
                  <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', marginBottom: '0.5rem' }}>{s.categoryName}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{s.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Provider: {s.providerName} | 📍 {s.location}</p>
                  <div style={{ fontWeight: '800', color: '#2563eb', marginTop: '0.25rem' }}>${s.price}</div>
                </div>
                <button onClick={() => handleDeleteService(s.id)} className="btn btn-danger btn-sm">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings View Tab */}
      {activeTab === 'bookings' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>System Wide Bookings Log</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '0.85rem', color: '#475569' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Service</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Provider</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>#{b.id}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{b.serviceName}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{b.customerName}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{b.providerName}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '700', color: '#2563eb' }}>${b.servicePrice}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge badge-${b.status}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Directory Tab */}
      {activeTab === 'users' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>Registered Users Directory</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '0.85rem', color: '#475569' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Phone</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>#{u.id}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>{u.name}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{u.phone || 'N/A'}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className="user-role-tag" style={{ backgroundColor: u.role === 'ADMIN' ? '#ef4444' : u.role === 'PROVIDER' ? '#2563eb' : '#10b981' }}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
