import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Review state
  const [reviewBookingId, setReviewBookingId] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/bookings/my-bookings');
      setBookings(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this pending booking?')) return;
    try {
      await axiosInstance.put(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      await axiosInstance.post(`/bookings/${reviewBookingId}/review`, {
        review: reviewText,
        rating,
      });
      setReviewBookingId(null);
      setReviewText('');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const filteredBookings = filterStatus === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === filterStatus);

  if (loading) return <Loading message="Fetching your bookings..." />;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>
            My Bookings
          </h1>
          <p style={{ color: '#64748b' }}>Track status and history of your service appointments</p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {filteredBookings.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>No bookings found</h3>
          <p style={{ color: '#94a3b8' }}>You don't have any bookings in this status.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredBookings.map((b) => (
            <div key={b.id} className="card">
              <div className="flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span className={`badge badge-${b.status}`} style={{ marginRight: '0.75rem' }}>
                    {b.status}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Booking ID: #{b.id}
                  </span>
                </div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#2563eb' }}>
                  ${b.servicePrice}
                </div>
              </div>

              <div className="grid-2" style={{ marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.4rem', color: '#0f172a' }}>
                    {b.serviceName}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div>📍 <strong>Address:</strong> {b.address}</div>
                    <div>📅 <strong>Date:</strong> {new Date(b.bookingDate).toLocaleString()}</div>
                    {b.notes && <div>📝 <strong>Notes:</strong> {b.notes}</div>}
                  </div>
                </div>

                <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>
                    Provider Details
                  </h4>
                  <div style={{ fontSize: '0.9rem', color: '#475569' }}>
                    <div>👤 {b.providerName}</div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {b.review && (
                    <div style={{ fontSize: '0.85rem', color: '#16a34a', fontStyle: 'italic' }}>
                      ⭐ Rating: {b.rating}/5 — "{b.review}"
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {b.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Cancel Booking
                    </button>
                  )}

                  {b.status === 'COMPLETED' && !b.review && (
                    <button
                      onClick={() => setReviewBookingId(b.id)}
                      className="btn btn-secondary btn-sm"
                    >
                      Write Review ⭐
                    </button>
                  )}
                </div>
              </div>

              {/* Review Modal Form */}
              {reviewBookingId === b.id && (
                <form onSubmit={handleSubmitReview} style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#0f172a' }}>Review Service</h4>
                  <div className="form-group">
                    <label className="form-label">Rating (1 to 5 Stars)</label>
                    <select
                      className="form-select"
                      value={rating}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 - Good)</option>
                      <option value={3}>⭐⭐⭐ (3 - Average)</option>
                      <option value={2}>⭐⭐ (2 - Poor)</option>
                      <option value={1}>⭐ (1 - Terrible)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Comments / Feedback</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      placeholder="Share your experience..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={reviewSubmitting}>
                      Submit Review
                    </button>
                    <button type="button" onClick={() => setReviewBookingId(null)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
