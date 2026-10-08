import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, isCustomer } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axiosInstance.get(`/services/${id}`);
        setService(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load service details.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setError('');
    setSuccess('');
    setBookingSubmitting(true);

    try {
      await axiosInstance.post('/bookings', {
        serviceId: service.id,
        bookingDate: bookingDate ? new Date(bookingDate).toISOString() : new Date(Date.now() + 86400000).toISOString(),
        address,
        notes,
      });

      setSuccess('Booking created successfully! View it in My Bookings.');
      setTimeout(() => {
        navigate('/bookings');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place booking.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading service details..." />;
  if (error && !service) return <div className="card text-center" style={{ padding: '3rem' }}><ErrorMessage message={error} /></div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/services" style={{ display: 'inline-block', marginBottom: '1.5rem', fontWeight: '600' }}>
        &larr; Back to all services
      </Link>

      <div className="grid-2" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
        {/* Service Overview */}
        <div className="card">
          <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', marginBottom: '1rem' }}>
            {service.categoryName}
          </span>
          
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.75rem', color: '#0f172a' }}>
            {service.name}
          </h1>

          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2563eb', marginBottom: '1.5rem' }}>
            ${service.price} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>per service</span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', color: '#334155' }}>Service Description</h3>
            <p style={{ color: '#475569', whiteSpace: 'pre-line' }}>{service.description}</p>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', color: '#334155' }}>Provider Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', color: '#475569' }}>
              <div>👤 <strong>Name:</strong> {service.providerName}</div>
              <div>📍 <strong>Location / Service Area:</strong> {service.location}</div>
              {service.providerPhone && <div>📞 <strong>Phone:</strong> {service.providerPhone}</div>}
            </div>
          </div>
        </div>

        {/* Booking Form Card */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#0f172a' }}>
            Book This Service
          </h2>

          <ErrorMessage message={error} onClose={() => setError('')} />
          {success && <div className="success-alert">✅ {success}</div>}

          {!isAuthenticated ? (
            <div className="text-center" style={{ padding: '1rem 0' }}>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>Please log in as a customer to book this service.</p>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                Log In to Book
              </Link>
            </div>
          ) : user?.id === service?.providerId ? (
            <div className="text-center" style={{ padding: '1rem 0', color: '#b45309', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
              ⚠️ You are the provider of this service.
            </div>
          ) : (
            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label className="form-label">Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Service Address</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Enter full street address for service visit..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Additional Instructions / Notes</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Special instructions or specific issue details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
                disabled={bookingSubmitting}
              >
                {bookingSubmitting ? 'Submitting Booking...' : 'Confirm Booking'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
