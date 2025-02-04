import React from 'react';
import './FlightDetailsModal.css';

const FlightDetailsModal = ({ flightDetails, onClose }) => {
    if (!flightDetails) return null;

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>

                <div className="flight-details">
                    <h2>Flight Details</h2>

                    {flightDetails.itinerary?.legs.map((leg, index) => (
                        <div key={leg.id} className="leg-details">
                            <div className="leg-header">
                                <h3>Flight {index + 1}</h3>
                                <span className="duration">
                                    Duration: {formatDuration(leg.duration)}
                                </span>
                            </div>

                            {leg.segments.map(segment => (
                                <div key={segment.id} className="segment">
                                    <div className="carrier-info">
                                        <img
                                            src={segment.marketingCarrier.logo}
                                            alt={segment.marketingCarrier.name}
                                            className="carrier-logo"
                                        />
                                        <span>{segment.marketingCarrier.name}</span>
                                        <span className="flight-number">Flight {segment.flightNumber}</span>
                                    </div>

                                    <div className="segment-details">
                                        <div className="departure">
                                            <div className="time">{formatTime(segment.departure)}</div>
                                            <div className="date">{formatDate(segment.departure)}</div>
                                            <div className="airport">
                                                {segment.origin.name} ({segment.origin.displayCode})
                                            </div>
                                            <div className="city">{segment.origin.city}</div>
                                        </div>

                                        <div className="flight-path">
                                            <div className="duration">
                                                {formatDuration(segment.duration)}
                                            </div>
                                            <div className="path-line"></div>
                                        </div>

                                        <div className="arrival">
                                            <div className="time">{formatTime(segment.arrival)}</div>
                                            <div className="date">{formatDate(segment.arrival)}</div>
                                            <div className="airport">
                                                {segment.destination.name} ({segment.destination.displayCode})
                                            </div>
                                            <div className="city">{segment.destination.city}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    <div className="pricing-options">
                        <h3>Booking Options</h3>
                        <div className="agents-list">
                            {flightDetails.itinerary?.pricingOptions.map((option, index) => (
                                <div key={index} className="agent-option">
                                    {option.agents.map(agent => (
                                        <div key={agent.id} className="agent-details">
                                            <div className="agent-name">{agent.name}</div>
                                            <div className="agent-rating">
                                                Rating: {agent.rating?.value.toFixed(1)} ({agent.rating?.count} reviews)
                                            </div>
                                            <div className="agent-price">${agent.price}</div>
                                            <a
                                                href={agent.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="book-button"
                                            >
                                                Book Now
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightDetailsModal; 