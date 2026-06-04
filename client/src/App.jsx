import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, User, Book, Star, Calendar, ExternalLink, AlertCircle, History, Filter } from 'lucide-react';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Main App Component
 * Manages state for searching, user profile data, sorting, and history.
 */
function App() {
  // State for the search input
  const [username, setUsername] = useState('');
  // State for the data returned from our proxy server
  const [userData, setUserData] = useState(null);
  // Loading state for UI feedback
  const [loading, setLoading] = useState(false);
  // Error state for displaying user-friendly messages
  const [error, setError] = useState('');
  // Sort criteria for repositories
  const [sortBy, setSortBy] = useState('updated');
  // History of recent searches stored in localStorage
  const [recentSearches, setRecentSearches] = useState([]);

  // EFFECT: Load recent searches from localStorage when the app starts
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  /**
   * Helper: Saves a successful search to localStorage (max 5 items)
   */
  const saveRecentSearch = (name) => {
    setRecentSearches(prev => {
      const updated = [name, ...prev.filter(i => i !== name)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  /**
   * CORE: Fetches data from our Node.js backend proxy
   */
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
      // Handle 404, rate limits, or network errors
      setError(err.response?.data?.message || 'Something went wrong while fetching data');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * HANDLER: Form submission
   */
  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(username);
  };

  /**
   * HANDLER: Clicking a tag in the recent searches list
   */
  const handleRecentClick = (name) => {
    setUsername(name);
    fetchData(name);
  };

  /**
   * EFFECT: Refetch data when sort criteria changes
   */
  useEffect(() => {
    if (userData && userData.user) {
      fetchData(username);
    }
  }, [sortBy]);

  return (
    <div className="app-container">
      {/* HEADER SECTION */}
      <header className="app-header">
        <h1>RepoLens</h1>
        <p>Explore GitHub profiles and repositories with ease.</p>
      </header>

      <main className="main-content">
        {/* SEARCH & HISTORY SECTION */}
        <section className="search-section">
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : <Search size={20} />}
            </button>
          </form>

          {/* RECENT SEARCHES HISTORY */}
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

        {/* ERROR FEEDBACK */}
        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* LOADING INDICATOR */}
        {loading && <div className="loader">Searching for {username}...</div>}

        {/* PROFILE & REPOS DISPLAY */}
        {userData && !loading && (
          <div className="profile-grid">
            
            {/* SIDEBAR: USER PROFILE */}
            <aside className="profile-sidebar">
              <div className="user-card">
                <img src={userData.user.avatar_url} alt={userData.user.name} className="avatar" />
                <h2>{userData.user.name || username}</h2>
                <p className="bio">{userData.user.bio || 'No bio available'}</p>
                
                <div className="user-stats">
                  <div><strong>{userData.user.followers}</strong> Followers</div>
                  <div><strong>{userData.user.following}</strong> Following</div>
                  <div><strong>{userData.user.public_repos}</strong> Repos</div>
                </div>

                <a href={userData.user.html_url} target="_blank" rel="noopener noreferrer" className="github-link">
                  View on GitHub <ExternalLink size={16} />
                </a>
              </div>
            </aside>

            {/* MAIN: REPOSITORIES LIST */}
            <section className="repos-section">
              <div className="repos-header">
                <h3>Public Repositories ({userData.user.public_repos})</h3>
                
                {/* SORT DROPDOWN */}
                <div className="sort-controls">
                  <Filter size={16} />
                  <label htmlFor="sort">Sort by:</label>
                  <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="updated">Last Updated</option>
                    <option value="stars">Most Stars</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
              </div>

              <div className="repos-list">
                {userData.repos.length === 0 ? (
                  <p className="no-repos">This user has no public repositories.</p>
                ) : (
                  userData.repos.map(repo => (
                    <div key={repo.id} className="repo-card">
                      <div className="repo-info">
                        <h4>
                          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                            {repo.name}
                          </a>
                        </h4>
                        <p>{repo.description || 'No description available'}</p>
                        
                        {/* REPO METADATA */}
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

                      {/* ADDITIONAL REPO DETAILS (EXPANDABLE) */}
                      <div className="repo-details">
                        <details>
                          <summary>Technical Details</summary>
                          <div className="details-content">
                            <p><strong>Open Issues:</strong> {repo.open_issues_count}</p>
                            <p><strong>Default Branch:</strong> {repo.default_branch}</p>
                          </div>
                        </details>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <p>&copy; 2026 RepoLens | Studio Graphene Assessment</p>
      </footer>
    </div>
  );
}

export default App;
