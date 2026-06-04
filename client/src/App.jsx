import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, User, Book, Star, Calendar, ExternalLink, AlertCircle, History, Filter } from 'lucide-react';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveRecentSearch = (name) => {
    setRecentSearches(prev => {
      const updated = [name, ...prev.filter(i => i !== name)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const fetchData = async (searchName) => {
    if (!searchName) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${searchName}`, {
        params: { sort: sortBy }
      });
      setUserData(response.data);
      saveRecentSearch(searchName);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(username);
  };

  const handleRecentClick = (name) => {
    setUsername(name);
    fetchData(name);
  };

  useEffect(() => {
    if (userData && userData.user) {
      fetchData(username);
    }
  }, [sortBy]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>RepoLens</h1>
        <p>Explore GitHub profiles and repositories with ease.</p>
      </header>

      <main className="main-content">
        <section className="search-section">
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : <Search size={20} />}
            </button>
          </form>

          {recentSearches.length > 0 && (
            <div className="recent-searches">
              <span className="recent-label"><History size={16} /> Recent:</span>
              {recentSearches.map(name => (
                <button key={name} onClick={() => handleRecentClick(name)} className="recent-tag">
                  {name}
                </button>
              ))}
            </div>
          )}
        </section>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading && <div className="loader">Searching for {username}...</div>}

        {userData && !loading && (
          <div className="profile-grid">
            {/* User Profile Info */}
            <aside className="profile-sidebar">
              <div className="user-card">
                <img src={userData.user.avatar_url} alt={userData.user.name} className="avatar" />
                <h2>{userData.user.name || username}</h2>
                <p className="bio">{userData.user.bio}</p>
                <div className="user-stats">
                  <div><strong>{userData.user.followers}</strong> Followers</div>
                  <div><strong>{userData.user.following}</strong> Following</div>
                  <div><strong>{userData.user.public_repos}</strong> Repos</div>
                </div>
                <a href={userData.user.html_url} target="_blank" rel="noopener noreferrer" className="github-link">
                  View Profile <ExternalLink size={16} />
                </a>
              </div>
            </aside>

            {/* Repositories List */}
            <section className="repos-section">
              <div className="repos-header">
                <h3>Public Repositories</h3>
                <div className="sort-controls">
                  <Filter size={16} />
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="updated">Last Updated</option>
                    <option value="stars">Stars</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>

              <div className="repos-list">
                {userData.repos.map(repo => (
                  <div key={repo.id} className="repo-card">
                    <div className="repo-info">
                      <h4>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                          {repo.name}
                        </a>
                      </h4>
                      <p>{repo.description || 'No description available'}</p>
                      <div className="repo-meta">
                        {repo.language && (
                          <span className="meta-item">
                            <Book size={14} /> {repo.language}
                          </span>
                        )}
                        <span className="meta-item">
                          <Star size={14} /> {repo.stargazers_count}
                        </span>
                        <span className="meta-item">
                          <Calendar size={14} /> {new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="repo-details">
                      <details>
                        <summary>View Details</summary>
                        <div className="details-content">
                          <p><strong>Open Issues:</strong> {repo.open_issues_count}</p>
                          <p><strong>Default Branch:</strong> {repo.default_branch}</p>
                        </div>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 RepoLens | Studio Graphene Assessment</p>
      </footer>
    </div>
  );
}

export default App;
