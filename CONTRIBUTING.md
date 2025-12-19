# Contributing to User Profile Application

Thank you for your interest in contributing to this project! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 15+ (for local development)
- Git

### Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Coolify-hello-world.git
   cd Coolify-hello-world
   ```

2. **Install Dependencies**
   ```bash
   # Install Task (if not already installed)
   # See: https://taskfile.dev/installation/
   
   # Or manually install dependencies
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Start Development Environment**
   ```bash
   # Option 1: Using Docker (recommended for consistency)
   task start
   
   # Option 2: Manual setup
   # Terminal 1 - Database
   docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=userprofile -p 5432:5432 postgres:15-alpine
   
   # Terminal 2 - Backend
   cd backend
   cp .env.example .env
   npm run dev
   
   # Terminal 3 - Frontend
   cd frontend
   cp .env.example .env
   npm start
   ```

## Project Structure

```
.
├── backend/              # Express.js API server
│   ├── server.js        # Main server file
│   ├── package.json     # Backend dependencies
│   └── Dockerfile       # Backend container
├── frontend/            # React application
│   ├── src/
│   │   ├── App.js      # Main component
│   │   └── App.css     # Styles
│   ├── public/
│   ├── package.json    # Frontend dependencies
│   └── Dockerfile      # Frontend container
├── docker-compose.yml  # Local development setup
├── Taskfile.yml        # Task automation
└── docs/               # Documentation
```

## Making Changes

### Backend Changes

The backend is a Node.js/Express application located in `backend/`.

**Key files:**
- `server.js` - All API endpoints and database logic

**Adding a new endpoint:**

```javascript
// Add to backend/server.js

app.post('/api/new-endpoint', authenticateToken, async (req, res) => {
  try {
    // Your logic here
    res.json({ message: 'Success' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

**Database changes:**

Modify the `initDB` function in `backend/server.js`:

```javascript
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS your_table (
        id SERIAL PRIMARY KEY,
        field VARCHAR(255)
      )
    `);
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};
```

### Frontend Changes

The frontend is a React application in `frontend/src/`.

**Key files:**
- `App.js` - Main component with all UI logic
- `App.css` - Styling
- `index.js` - Entry point

**Adding a new feature:**

```jsx
// Add to frontend/src/App.js

const handleNewFeature = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/api/new-endpoint`,
      { data: 'value' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSuccess(response.data.message);
  } catch (err) {
    setError(err.response?.data?.error || 'An error occurred');
  }
};
```

### Testing Your Changes

1. **Manual Testing**
   ```bash
   # Restart services to apply changes
   task restart
   
   # Test in browser
   open http://localhost:3000
   ```

2. **API Testing**
   ```bash
   # Run the test script
   ./test-api.sh
   
   # Or test individual endpoints
   curl http://localhost:3001/health
   ```

3. **Check Logs**
   ```bash
   task logs
   ```

## Code Style

### JavaScript/Node.js
- Use ES6+ features
- Use async/await for asynchronous code
- Add error handling for all async operations
- Use meaningful variable names

### React
- Use functional components with hooks
- Keep components small and focused
- Use meaningful state variable names
- Add proper error handling

### General
- Keep lines under 100 characters when possible
- Add comments for complex logic
- Follow existing code patterns

## Security Guidelines

### Always:
- Validate all user inputs
- Use parameterized queries (never string concatenation)
- Hash passwords with bcrypt
- Use HTTPS in production
- Keep dependencies updated
- Use environment variables for secrets

### Never:
- Commit secrets or API keys
- Store passwords in plain text
- Trust user input without validation
- Expose internal error details to users

## Commit Guidelines

Follow the conventional commits format:

```
type(scope): subject

body (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(backend): add email field to user profile
fix(frontend): resolve login form validation issue
docs(readme): update installation instructions
```

## Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clear, concise code
   - Add comments where necessary
   - Test thoroughly

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Include screenshots for UI changes

6. **Address Review Feedback**
   - Be responsive to comments
   - Make requested changes
   - Push updates to your branch

## Adding Dependencies

### Backend Dependencies

```bash
cd backend
npm install package-name
npm install --save-dev dev-package-name
```

Update `backend/package.json` and ensure it works in Docker.

### Frontend Dependencies

```bash
cd frontend
npm install package-name
```

Update `frontend/package.json` and test the build.

## Testing Checklist

Before submitting a PR, ensure:

- [ ] Code builds without errors
- [ ] Application runs in Docker
- [ ] All existing features still work
- [ ] New features have been tested manually
- [ ] API test script passes: `./test-api.sh`
- [ ] No console errors or warnings
- [ ] Code follows project style
- [ ] Documentation is updated if needed

## Docker Development

### Rebuild Containers

```bash
# Rebuild after dependency changes
task docker-build

# Or with docker compose
docker compose build
```

### Clean Build

```bash
# Remove all containers and volumes
task clean

# Then rebuild
task docker-build
task start
```

### Debug Container

```bash
# Enter a running container
docker exec -it userprofile-backend sh
docker exec -it userprofile-frontend sh

# Check logs
docker compose logs -f backend
docker compose logs -f frontend
```

## Common Tasks

### Add a New Database Field

1. Update the schema in `backend/server.js` `initDB()` function
2. Update relevant API endpoints to handle the new field
3. Update frontend forms to display/edit the field
4. Test with API script

### Add Authentication to an Endpoint

```javascript
app.get('/api/protected', authenticateToken, async (req, res) => {
  // req.user contains decoded JWT payload
  const userId = req.user.id;
  // Your logic here
});
```

### Add a New UI Component

1. Add component in `frontend/src/`
2. Import in `App.js`
3. Add state management if needed
4. Update `App.css` for styling

## Need Help?

- Check existing issues
- Review the [README](README.md)
- Look at the code - it's well-commented
- Open a discussion or issue

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing! 🙌**
