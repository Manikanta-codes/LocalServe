import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add Service Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    categoryId: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookRes, catRes, servRes] = await Promise.all([
        axiosInstance.get('/bookings/provider'),
        axiosInstance.get('/categories'),
        axiosInstance.get('/services')
      ]);

      setBookings(bookRes.data.data || []);
      setCategories(catRes.data.data || []);
      
      // Filter services for current provider
      const allServices = servRes.data.data || [];
      const myUser = JSON.parse(localStorage.getItem('localserve_user') || '{}');
      setServices(allServices.filter(s => s.providerId === myUser.id || s.providerEmail === myUser.email));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load provider data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusAction = async (bookingId, action) => {
    try {
      if (action === 'accept') {
        await axiosInstance.put(`/bookings/${bookingId}/accept`);
      } else if (action === 'reject') {
        await axiosInstance.put(`/bookings/${bookingId}/reject`);
      } else {
        await axiosInstance.put(`/bookings/${bookingId}/status`, { status: action });
      }
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axiosInstance.post('/services', {
        ...newService,
        price: parseFloat(newService.price),
        categoryId: parseInt(newService.categoryId),
      });

      setSuccess('Service created successfully!');
      setShowAddModal(false);
      setNewService({ name: '', description: '', price: '', location: '', categoryId: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service.');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axiosInstance.delete(`/services/${serviceId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete service.');
    }
  };

  if (loading) return <Loading message="Loading provider dashboard..." />;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>
            Provider Workspace
          </h1>
          <p style={{ color: '#64748b' }}>Manage your assigned bookings and active service listings</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Assigned Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`btn ${activeTab === 'services' ? 'btn-primary' : 'btn-secondary'}`}
          >
            My Services ({services.length})
          </button>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />
      {success && <div className="success-alert">✅ {success}</div>}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          {bookings.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem' }}>
              <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>No assigned bookings yet</h3>
              <p style={{ color: '#94a3b8' }}>When customers book your services, they will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {bookings.map((b) => (
                <div key={b.id} className="card">
                  <div className="flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span className={`badge badge-${b.status}`} style={{ marginRight: '0.75rem' }}>
                        {b.status}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Booking #{b.id}</span>
                    </div>
                    <div style={{ fontWeight: '700', color: '#2563eb', fontSize: '1.1rem' }}>
                      ${b.servicePrice}
                    </div>
                  </div>

                  <div className="grid-2" style={{ marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem' }}>
                        {b.serviceName}
                      </h3>
                      <div style={{ fontSize: '0.9rem', color: '#475569' }}>
                        <div>📍 <strong>Address:</strong> {b.address}</div>
                        <div>📅 <strong>Date:</strong> {new Date(b.bookingDate).toLocaleString()}</div>
                        {b.notes && <div>📝 <strong>Customer Notes:</strong> {b.notes}</div>}
                      </div>
                    </div>

                    <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>
                        Customer Info
                      </h4>
                      <div style={{ fontSize: '0.9rem', color: '#475569' }}>
                        <div>👤 {b.customerName}</div>
                        <div>✉️ {b.customerEmail}</div>
                        {b.customerPhone && <div>📞 {b.customerPhone}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    {b.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleStatusAction(b.id, 'accept')} className="btn btn-success btn-sm">
                          Accept Booking ✅
                        </button>
                        <button onClick={() => handleStatusAction(b.id, 'reject')} className="btn btn-danger btn-sm">
                          Reject Booking ❌
                        </button>
                      </>
                    )}

                    {b.status === 'ACCEPTED' && (
                      <button onClick={() => handleStatusAction(b.id, 'IN_PROGRESS')} className="btn btn-primary btn-sm">
                        Mark IN PROGRESS 🚀
                      </button>
                    )}

                    {b.status === 'IN_PROGRESS' && (
                      <button onClick={() => handleStatusAction(b.id, 'COMPLETED')} className="btn btn-success btn-sm">
                        Mark COMPLETED 🎉
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div>
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>My Listed Services</h2>
            <button onClick={() => setShowAddModal(!showAddModal)} className="btn btn-primary">
              {showAddModal ? 'Cancel' : '+ Add New Service'}
            </button>
          </div>

          {/* Create Service Form Modal/Card */}
          {showAddModal && (
            <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', color: '#0f172a' }}>
                Create New Service Listing
              </h3>
              <form onSubmit={handleCreateService}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Service Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Master Plumbing Repair"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={newService.categoryId}
                      onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      placeholder="99.00"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Service Location / Area</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Downtown Metro Region"
                      value={newService.location}
                      onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Describe what your service includes..."
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                  Publish Service Listing
                </button>
              </form>
            </div>
          )}

          {services.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem' }}>
              <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>No services published</h3>
              <p style={{ color: '#94a3b8' }}>Click "+ Add New Service" above to list your first service.</p>
            </div>
          ) : (
            <div className="grid-2">
              {services.map((s) => (
                <div key={s.id} className="card flex-between">
                  <div>
                    <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', marginBottom: '0.5rem' }}>
                      {s.categoryName}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{s.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>📍 {s.location}</p>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#2563eb', marginTop: '0.5rem' }}>
                      ${s.price}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteService(s.id)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
