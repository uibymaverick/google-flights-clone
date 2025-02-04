import React, { useState } from 'react';
import axios from 'axios';
import './FlightResults.css';
import FlightDetailsModal from './FlightDetailsModal';

const FlightResults = ({ flights, currentPage, totalPages, onPageChange, sessionId }) => {
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [loading, setLoading] = useState(false);

    const getFlightDetails = async (flight) => {
        setLoading(true);
        try {
            const options = {
                method: 'GET',
                url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/getFlightDetails',
                params: {
                    legs: JSON.stringify(flight.legs.map(leg => ({
                        origin: leg.origin.displayCode,
                        destination: leg.destination.displayCode,
                        date: leg.departure.split('T')[0]
                    }))),
                    adults: '1',
                    currency: 'USD',
                    locale: 'en-US',
                    market: 'en-US',
                    cabinClass: 'economy',
                    countryCode: 'US',
                    sessionId: sessionId
                },
                headers: {
                    'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
                    'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
                }
            };

            const response = await axios.request(options);
            setSelectedFlight(response.data.data);
        } catch (error) {
            console.error('Error fetching flight details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!flights || flights.length === 0) {
        return <div className="no-flights">No flights found</div>;
    }

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const renderPaginationButtons = () => {
        return (
            <>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                    aria-label="Previous page"
                >
                    ←
                </button>
                <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                    aria-label="Next page"
                >
                    →
                </button>
            </>
        );
    };

    return (
        <>
            <div className="flight-results">
                {flights.map((flight) => (
                    <div
                        key={flight.id}
                        className="flight-card"
                        onClick={() => getFlightDetails(flight)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="flight-header">
                            <div className="price">{flight.price.formatted}</div>
                            <div className="airline">
                                {flight.legs[0].carriers.marketing[0].name}
                                {flight.legs[0].carriers.marketing[0].logoUrl && (
                                    <img
                                        src={flight.legs[0].carriers.marketing[0].logoUrl}
                                        alt="airline logo"
                                        className="airline-logo"
                                    />
                                )}
                            </div>
                        </div>

                        {flight.legs.map((leg, index) => (
                            <div key={index} className="flight-leg">
                                <div className="flight-times">
                                    <div className="departure">
                                        <div className="time">{formatTime(leg.departure)}</div>
                                        <div className="date">{formatDate(leg.departure)}</div>
                                        <div className="airport">{leg.origin.displayCode}</div>
                                    </div>
                                    <div className="flight-duration">
                                        <div className="duration">{formatDuration(leg.durationInMinutes)}</div>
                                        <div className="stops">
                                            {leg.stopCount === 0 ? 'Direct' :
                                                `${leg.stopCount} stop${leg.stopCount > 1 ? 's' : ''}`}
                                        </div>
                                    </div>
                                    <div className="arrival">
                                        <div className="time">{formatTime(leg.arrival)}</div>
                                        <div className="date">{formatDate(leg.arrival)}</div>
                                        <div className="airport">{leg.destination.displayCode}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {loading && <div className="loading-overlay">Loading flight details...</div>}

            {selectedFlight && (
                <FlightDetailsModal
                    flightDetails={selectedFlight}
                    onClose={() => setSelectedFlight(null)}

                />
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    {renderPaginationButtons()}
                </div>
            )}
        </>
    );
};

export default FlightResults; 