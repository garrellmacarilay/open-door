import { useState } from 'react';
import './ReviewsSection.css';

function ReviewsSection() {
  const [activeTab, setActiveTab] = useState('reviews');

  const reviews = [
    {
      id: 1,
      name: 'Jeremy Ortega',
      email: 'ortega@gmail.com',
      avatar: 'https://via.placeholder.com/40x40/4A90E2/FFFFFF?text=JO',
      idNumber: 'EL40017',
      role: 'Buyer',
      location: 'United State',
      phone: '1252655',
      status: 'Not available',
      statusColor: 'red'
    },
    {
      id: 2,
      name: 'Garrell Macarilay',
      email: 'macarilay@gmail.com',
      avatar: 'https://via.placeholder.com/40x40/50C878/FFFFFF?text=GM',
      idNumber: 'EL40012',
      role: 'Buyer',
      location: 'United State',
      phone: '1254785',
      status: 'Available',
      statusColor: '#007d34'
    },
    {
      id: 3,
      name: 'Rolando Majait',
      email: 'majait@gmail.com',
      avatar: 'https://via.placeholder.com/40x40/FF6B6B/FFFFFF?text=RM',
      idNumber: 'EL40013',
      role: 'Seller',
      location: 'Australia',
      phone: '1285685',
      status: 'Available',
      statusColor: '#007d34'
    },
    {
      id: 4,
      name: 'Romar Samson',
      email: 'samson@gmail.com',
      avatar: 'https://via.placeholder.com/40x40/9B59B6/FFFFFF?text=RS',
      idNumber: 'EL40014',
      role: 'Buyer',
      location: 'United State',
      phone: '1254795',
      status: 'Not available',
      statusColor: 'red'
    }
  ];

  const ratingReviews = [
    {
      id: 1,
      name: 'Shandi Belen',
      email: 'shandibelen@gmail.com',
      avatar: 'https://via.placeholder.com/33x33/4A90E2/FFFFFF?text=SB',
      office: 'Dental and Medical Services',
      date: '2025-10-10',
      service: 'Medical Checkup',
      rating: 3
    },
    {
      id: 2,
      name: 'Amber Rosana',
      email: 'amberrosana@gmail.com',
      avatar: 'https://via.placeholder.com/33x33/50C878/FFFFFF?text=AR',
      office: 'Communications',
      date: '2025-10-10',
      service: 'Posting Guidelines',
      rating: 4
    },
    {
      id: 3,
      name: 'Estela mae Jalac',
      email: 'estelamaejalac@gmail.com',
      avatar: 'https://via.placeholder.com/33x33/FF6B6B/FFFFFF?text=EM',
      office: 'Guidance and Counseling',
      date: '2025-10-10',
      service: 'Mental Health Advice',
      rating: 5
    },
    {
      id: 4,
      name: 'Eunice Lugtu',
      email: 'eunicelugto@gmail.com',
      avatar: 'https://via.placeholder.com/33x33/9B59B6/FFFFFF?text=EL',
      office: 'Student Publication',
      date: '2025-10-10',
      service: 'News Writing Guidance',
      rating: 4
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h3 className="reviews-title">Reviews</h3>
        <div className="reviews-tabs">
          <button 
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Staff Reviews
          </button>
          <button 
            className={`tab ${activeTab === 'ratings' ? 'active' : ''}`}
            onClick={() => setActiveTab('ratings')}
          >
            Service Ratings
          </button>
        </div>
      </div>

      {activeTab === 'reviews' ? (
        <div className="reviews-list">
          <div className="reviews-header-row">
            <span className="header-name">Name</span>
            <span className="header-id">ID</span>
            <span className="header-role">Role</span>
            <span className="header-location">Location</span>
            <span className="header-phone">Phone</span>
            <span className="header-status">Status</span>
          </div>
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-user">
                <img src={review.avatar} alt={review.name} className="user-avatar" />
                <div className="user-info">
                  <div className="user-name">{review.name}</div>
                  <div className="user-email">{review.email}</div>
                </div>
              </div>
              <div className="review-id">{review.idNumber}</div>
              <div className="review-role">{review.role}</div>
              <div className="review-location">{review.location}</div>
              <div className="review-phone">{review.phone}</div>
              <div className="review-status" style={{ color: review.statusColor }}>
                {review.status}
              </div>
              {review.status === 'Available' && (
                <button className="edit-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#6f757e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#6f757e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="ratings-list">
          {ratingReviews.map((rating) => (
            <div key={rating.id} className="rating-item">
              <img src={rating.avatar} alt={rating.name} className="rating-avatar" />
              <div className="rating-info">
                <div className="rating-user-name">{rating.name}</div>
                <div className="rating-user-email">{rating.email}</div>
              </div>
              <div className="rating-office">{rating.office}</div>
              <div className="rating-date">{rating.date}</div>
              <div className="rating-service">{rating.service}</div>
              <div className="rating-stars">
                {renderStars(rating.rating)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsSection;
