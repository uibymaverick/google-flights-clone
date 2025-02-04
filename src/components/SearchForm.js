import { useState } from 'react';
import axios from 'axios';
import './SearchForm.css';

const SearchForm = ({ onSearch }) => {
    const [searchData, setSearchData] = useState({
        origin: '',
        destination: '',
        originEntityId: '',
        destinationEntityId: '',
        originSkyId: '',
        destinationSkyId: '',
        date: '',
        adults: 1,
        currency: 'USD'
    });

    const [airports, setAirports] = useState({
        origin: [],
        destination: []
    });

    const [loading, setLoading] = useState({
        origin: false,
        destination: false
    });

    const searchAirports = async (query, type) => {
        if (!query.trim()) {
            setAirports(prev => ({ ...prev, [type]: [] }));
            return;
        }

        setLoading(prev => ({ ...prev, [type]: true }));

        try {
            const options = {
                method: 'GET',
                url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
                params: {
                    query,
                    locale: 'en-US'
                },
                headers: {
                    'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
                    'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
                }
            };

            const response = await axios.request(options);
            console.log(response.data);
            setAirports(prev => ({ ...prev, [type]: response.data.data || [] }));
        } catch (error) {
            console.error('Airport search error:', error);
            setAirports(prev => ({ ...prev, [type]: [] }));
        } finally {
            setLoading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleAirportSelect = (airport, type) => {
        setSearchData(prev => ({
            ...prev,
            [type]: airport.name,
            [`${type}EntityId`]: airport.entityId,
            [`${type}SkyId`]: airport.skyId
        }));
        setAirports(prev => ({ ...prev, [type]: [] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Get today's date in YYYY-MM-DD format for min date attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="origin">From</label>
                    <div className="search-input-container">
                        <input
                            type="text"
                            id="origin"
                            value={searchData.origin}
                            onChange={(e) => {
                                handleChange(e);
                                searchAirports(e.target.value, 'origin');
                            }}
                            placeholder="Search airport"
                            required
                        />
                        {loading.origin && <div className="loader"></div>}
                        {airports.origin.length > 0 && (
                            <ul className="airport-dropdown">
                                {airports.origin.map((airport) => (
                                    <li
                                        key={airport.entityId}
                                        onClick={() => handleAirportSelect(airport, 'origin')}
                                    >
                                        {airport.name} ({airport.skyId})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="destination">To</label>
                    <div className="search-input-container">
                        <input
                            type="text"
                            id="destination"
                            value={searchData.destination}
                            onChange={(e) => {
                                handleChange(e);
                                searchAirports(e.target.value, 'destination');
                            }}
                            placeholder="Search airport"
                            required
                        />
                        {loading.destination && <div className="loader"></div>}
                        {airports.destination.length > 0 && (
                            <ul className="airport-dropdown">
                                {airports.destination.map((airport) => (
                                    <li
                                        key={airport.entityId}
                                        onClick={() => handleAirportSelect(airport, 'destination')}
                                    >
                                        {airport.name} ({airport.skyId})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="date">Departure Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={searchData.date}
                        onChange={handleChange}
                        min={today}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="adults">Passengers</label>
                    <input
                        type="number"
                        id="adults"
                        name="adults"
                        min="1"
                        max="9"
                        value={searchData.adults}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="currency">Currency</label>
                    <select
                        id="currency"
                        name="currency"
                        value={searchData.currency}
                        onChange={handleChange}
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                    </select>
                </div>
            </div>
            <button type="submit" className="search-button">Search Flights</button>
        </form>
    );
};

export default SearchForm; 