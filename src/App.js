import { useState } from 'react';
import axios from 'axios';
import './App.css';
import SearchForm from './components/SearchForm';
import FlightResults from './components/FlightResults';

const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY;
const ITEMS_PER_PAGE = 5; // Number of flights to show per page

function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const searchFlights = async (searchData) => {
    setLoading(true);
    setError(null);
    setCurrentPage(1); // Reset to first page on new search

    try {
      const options = {
        method: 'GET',
        url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights',
        params: {
          originSkyId: searchData.originSkyId,
          destinationSkyId: searchData.destinationSkyId,
          originEntityId: searchData.originEntityId.toString(),
          destinationEntityId: searchData.destinationEntityId.toString(),
          date: searchData.date,
          cabinClass: 'economy',
          adults: searchData.adults.toString(),
          sortBy: 'best',
          currency: searchData.currency,
          market: 'en-US',
          countryCode: 'US'
        },
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      console.log(response.data);
      setSessionId(response.data.sessionId);
      setFlights(response.data.data.itineraries || []);
    } catch (err) {
      setError('Failed to fetch flights. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination values
  const totalPages = Math.ceil(flights.length / ITEMS_PER_PAGE);
  const indexOfLastFlight = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstFlight = indexOfLastFlight - ITEMS_PER_PAGE;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Flight Search</h1>
      </header>
      <main className="app-main">
        <SearchForm onSearch={searchFlights} />
        {loading && <div className="loading">Loading flights...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && (
          <FlightResults
            flights={currentFlights}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            sessionId={sessionId}
          />
        )}
      </main>
    </div>
  );
}

export default App;
