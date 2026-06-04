# RepoLens - GitHub Repo Explorer

RepoLens is a full-stack web application that allows users to explore GitHub profiles and repositories. It features a Node.js proxy backend to handle GitHub API requests, providing security and efficient caching.

This project was built as part of the Studio Graphene Full Stack Developer assessment (Exercise 3).

## Live Demo  : https://repolens-the-project-provider.vercel.app/

## Tech Stack
- **Frontend:** React (Vite), Axios, Lucide React (Icons), Plain CSS.
- **Backend:** Node.js, Express, Axios, Node-Cache (In-memory caching), Cors, Dotenv.

  - **React:** For a responsive and component-based UI.
  - **Express:** Lightweight and flexible backend framework.
  - **Node-Cache:** To implement the required 60-second caching strategy easily.
  - **Lucide React:** For clean and modern iconography.

## How to Run Locally

### Prerequisites
- Node.js installed on your machine.
- (Optional) A GitHub Personal Access Token to avoid rate limiting.

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/anopsingh706/Repolens---The-project-provider.git
   cd repolens
   ```

2. **Install dependencies:**
   ```bash
   # From the root directory
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. **Setup Environment Variables:**
   - Create a `.env` file in the `server` directory.
   - Add your GitHub token (optional):
     ```env
     PORT=5000
     GITHUB_TOKEN=your_github_token_here
     ```

4. **Run the application:**
   ```bash
   # From the root directory
   npm run dev
   ```
   - Frontend will be available at `http://localhost:5173`
   - Backend will be available at `http://localhost:5000`

## API Documentation

### Base URL: `http://localhost:5000/api`

#### GET `/user/:username`
Fetches GitHub profile and repositories for a specific user.

- **URL Params:** `username` (required)
- **Query Params:**
  - `sort`: `updated` (default), `stars`, `name`
  - `page`: Page number for repositories (default: 1)
- **Response Shape:**
  ```json
  {
    "user": {
      "avatar_url": "string",
      "name": "string",
      "bio": "string",
      "followers": number,
      "following": number,
      "public_repos": number,
      "html_url": "string"
    },
    "repos": [
      {
        "id": number,
        "name": "string",
        "description": "string",
        "language": "string",
        "stargazers_count": number,
        "updated_at": "string",
        "html_url": "string",
        "open_issues_count": number,
        "default_branch": "string"
      }
    ]
  }
  ```

## Project Structure
```
repolens/
├── client/           # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx   # Main application logic & components
│   │   ├── App.css   # Styling
│   │   └── main.jsx  # Entry point
├── server/           # Node.js + Express Backend
│   ├── index.js      # Server logic, GitHub proxy & caching
│   └── .env          # Environment variables
└── package.json      # Monorepo scripts
```

## Next Steps / Future Improvements
- [ ] **Pagination:** Add UI controls to load more repositories if the count exceeds 30.
- [ ] **Language Chart:** Use a library like Chart.js to visualize language distribution.
- [ ] **Tests:** Add unit tests for the backend proxy and frontend components using Vitest.
- [ ] **Skeleton Loaders:** Replace the simple loader with skeleton screens for a better UI experience.
- [ ] **Debounced Search:** Currently searches on button click or Enter. Debouncing `onChange` would feel smoother.

---
Built with ❤️ by Anop Singh.
