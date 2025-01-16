import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import { useCallback } from "react";

function App() {
  const [cats, setCats] = useState([]);
  const [favoriteCats, setFavoriteCats] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://api.thecatapi.com/v1/images/search', {
        params: { limit: 10, page },
        headers: {
          'x-api-key': 'live_lTgYhkq1qPCI0etkSFXE9LU1e3gQfh98mvj1u3ZbkUq3juIoDSKB89W7dQYJQgDO', 
        },
      });
      setCats((prevCats) => [...prevCats, ...response.data]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Ошибка при загрузке котиков:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCats();

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !isLoading
      ) {
        fetchCats();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchCats, isLoading, page]);

  const toggleFavorite = (cat) => {
    setFavoriteCats((prevFavorites) =>
      prevFavorites.some((fav) => fav.id === cat.id)
        ? prevFavorites.filter((fav) => fav.id !== cat.id)
        : [...prevFavorites, cat]
    );
  };

  return (
    <Router basename="/frontend-challenge">
      <nav className="navigation">
        <Link to="/" className="nav-link">
          Все котики
        </Link>
        <Link to="/favorites" className="nav-link">
          Любимые котики
        </Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <section className="gallery">
              <div className="cat-grid">
                {cats.map((cat, index) => (
                  <div key={`${cat.id}-${index}`} className="cat-item">
                    <div className="image-container">
                      <img src={cat.url} alt="Cat" />
                      <button
                        className={`favorite-button ${
                          favoriteCats.some((fav) => fav.id === cat.id) ? 'active' : ''
                        }`}
                        onClick={() => toggleFavorite(cat)}
                      >
                        {favoriteCats.some((fav) => fav.id === cat.id) ? '❤️' : '🤍'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {isLoading && <p className="loading-text">...загрузка котиков...</p>}
            </section>
          }
        />
        <Route
          path="/favorites"
          element={
            <section className="favorites">
              <div className="cat-grid">
                {favoriteCats.map((cat, index) => (
                  <div key={`${cat.id}-${index}`} className="cat-item">
                    <div className="image-container">
                      <img src={cat.url} alt="Cat" />
                      <button
                        className="favorite-button active"
                        onClick={() => toggleFavorite(cat)}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
