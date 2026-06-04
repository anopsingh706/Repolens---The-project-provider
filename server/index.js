require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const NodeCache = require('node-cache');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

/**
 * CACHE SETUP
 * We use node-cache to store GitHub API responses for 60 seconds.
 * stdTTL: 60 means keys expire after 60 seconds by default.
 */
const cache = new NodeCache({ stdTTL: 60 });

app.use(cors()); // Enable CORS for frontend communication
app.use(express.json());

// GitHub API Base URL
const GITHUB_API = 'https://api.github.com';

/**
 * CACHE MIDDLEWARE
 * Checks if the requested username's data exists in memory.
 * If found, returns cached data to save GitHub API rate limit.
 */
const checkCache = (req, res, next) => {
  const { username } = req.params;
  const cachedData = cache.get(username);
  if (cachedData) {
    console.log(`Cache hit for ${username}`);
    return res.json(cachedData);
  }
  next();
};

/**
 * GET /api/user/:username
 * Main proxy endpoint. It fetches:
 * 1. Basic user profile (avatar, bio, stats)
 * 2. User's public repositories (paginated and sorted)
 */
app.get('/api/user/:username', checkCache, async (req, res) => {
  const { username } = req.params;
  const { sort = 'updated', page = 1 } = req.query;

  try {
    // Add authorization header if token is provided in .env
    const headers = {};
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // Step 1: Fetch User Profile
    const userResponse = await axios.get(`${GITHUB_API}/users/${username}`, { headers });
    const user = userResponse.data;

    // Step 2: Fetch User Repositories
    // We map sort values to GitHub API standards
    const reposResponse = await axios.get(`${GITHUB_API}/users/${username}/repos`, {
      headers,
      params: {
        sort: sort === 'name' ? 'full_name' : sort,
        direction: sort === 'name' ? 'asc' : 'desc',
        per_page: 30, // GitHub default per page
        page: page
      }
    });
    const repos = reposResponse.data;

    // Step 3: Clean and Format Response
    // We only send necessary fields to the frontend
    const responseData = {
      user: {
        avatar_url: user.avatar_url,
        name: user.name,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        public_repos: user.public_repos,
        html_url: user.html_url
      },
      repos: repos.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        updated_at: repo.updated_at,
        html_url: repo.html_url,
        open_issues_count: repo.open_issues_count,
        default_branch: repo.default_branch
      }))
    };

    // Step 4: Store results in cache before sending
    cache.set(username, responseData);

    res.json(responseData);
  } catch (error) {
    // Step 5: Graceful Error Handling
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return res.status(404).json({ message: 'GitHub user not found' });
      }
      if (status === 403) {
        return res.status(403).json({ message: 'GitHub API rate limit exceeded. Please try again later.' });
      }
    }
    console.error('Error fetching data from GitHub:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
