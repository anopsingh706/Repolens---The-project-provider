# RepoLens - GitHub Repo Explorer

RepoLens is a full-stack web application. It allows users to search for any GitHub profile and explore their public repositories in a clean, responsive interface. 

The application acts as a secure proxy to the GitHub REST API, implementing a 60-second caching strategy to optimize performance, minimize API calls, and ensure a smooth user experience even under rate-limiting constraints.

## 🚀 Live Demo
**Live Link:** [https://repolens-the-project-provider.vercel.app/](https://repolens-the-project-provider.vercel.app/)

## 🛠️ Tech Stack

### Frontend
- **React (Vite):** Chosen for its fast development cycle and efficient component-based rendering.
- **Lucide React:** Provides a consistent and modern set of icons for the UI.
- **Axios:** Used for robust HTTP requests to the backend proxy.
- **Plain CSS:** Utilized for styling to demonstrate core CSS skills and ensure maximum control over the visual presentation.

### Backend
- **Node.js & Express:** A lightweight and flexible foundation for building the proxy server.
- **Node-Cache:** Implemented to satisfy the 60-second caching requirement efficiently without the overhead of a database.
- **Dotenv:** Used to securely manage environment variables like the `GITHUB_TOKEN`.
- **Cors:** Configured to allow secure communication between the frontend and backend.

## 💻 How to Run Locally

Follow these steps to set up the project on your local machine. This assumes you have **Node.js** installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anopsingh706/Repolens---The-project-provider.git
   cd repolens
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables:**
   Create a file named `.env` in the `server` directory and add the following:
   ```env
   PORT=5000
   GITHUB_TOKEN=your_github_personal_access_token # Optional but recommended
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```
   - The **Frontend** will be running at `http://localhost:5173`
   - The **Backend** will be running at `http://localhost:5000`

## 📖 API Documentation

### Base URL
- **Production:** `https://repolens-the-project-provider.onrender.com/api`
- **Local:** `http://localhost:5000/api`

#### GET `/user/:username`
Fetches GitHub profile information and a list of public repositories for a specific user.

- **Method:** `GET`
- **Path:** `/user/:username`
- **Request Body:** None
- **Query Parameters:**
  - `sort`: `updated` (default), `stars`, or `name`.
  - `page`: Page number (default: 1).
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

## 📂 Project Structure

```text
repolens/
├── client/           # React Frontend (Vite)
│   ├── src/          # Application source code
│   │   ├── App.jsx   # Main UI logic and state management
│   │   ├── App.css   # Styles for the entire application
│   │   └── main.jsx  # Frontend entry point
│   └── public/       # Static assets like icons and logos
├── server/           # Node.js + Express Backend
│   ├── index.js      # Server logic, GitHub proxy, and caching middleware
│   └── .env          # Environment configuration
└── package.json      # Root configuration with monorepo scripts
```

## 🚀 Next Steps

### What I chose not to do (for this scope):
- **User Authentication:** Kept it simple with a public search to focus on the proxy and caching logic.
- **Complex State Management:** Used React Hooks (`useState`, `useEffect`) instead of Redux, as the application's state is currently manageable without it.

### What I would build next:
- **Pagination UI:** Currently, the API supports pagination, but the frontend needs controls to navigate through multiple pages of repositories.
- **Enhanced Visualizations:** Integrate a library like Chart.js to visualize the distribution of programming languages across a user's repositories.
- **Unit & Integration Tests:** Add a testing suite using Vitest (frontend) and Supertest (backend) to ensure long-term stability.
- **Skeleton Loading:** Implement skeleton screens for a more polished perceived performance during data fetching.

---
Built with ❤️ by [Anop Singh](https://github.com/anopsingh706)
