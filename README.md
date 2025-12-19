# User Profile Management Application

A full-stack application for managing user profiles with authentication. Users can register, login, and update their username and favourite colour.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication system
- **User Registration**: Create new accounts with username and password
- **User Login**: Authenticate existing users
- **Profile Management**: View and update user profile (username and favourite colour)
- **Containerized**: Fully dockerized application ready for deployment
- **Task Automation**: Taskfile for easy development and deployment tasks

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 with modern hooks-based architecture
- **Backend**: Node.js with Express.js REST API
- **Database**: PostgreSQL 15
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Containerization**: Docker and Docker Compose
- **Task Runner**: Taskfile for automation

### Application Structure

```
.
├── backend/              # Node.js Express API
│   ├── server.js        # Main server file with API endpoints
│   ├── package.json     # Backend dependencies
│   ├── Dockerfile       # Backend container configuration
│   └── .env.example     # Environment variables template
├── frontend/            # React application
│   ├── src/
│   │   ├── App.js      # Main React component
│   │   ├── App.css     # Styling
│   │   └── index.js    # React entry point
│   ├── public/
│   ├── package.json    # Frontend dependencies
│   ├── Dockerfile      # Frontend container configuration
│   └── nginx.conf      # Nginx configuration for production
├── docker-compose.yml  # Local development orchestration
├── Taskfile.yml        # Task automation
└── README.md          # This file
```

## 📋 Prerequisites

### For Local Development

- [Docker](https://docs.docker.com/get-docker/) (20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (1.29+)
- [Task](https://taskfile.dev/installation/) (optional but recommended)

### For Manual Development (without Docker)

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

## 🚀 Running Locally

### Method 1: Using Taskfile (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Coolify-hello-world
   ```

2. **Start the application**:
   ```bash
   task start
   ```
   
   This will:
   - Build all Docker images
   - Start PostgreSQL database
   - Start backend API
   - Start frontend application

3. **Access the application**:
   - Frontend UI: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

4. **View logs**:
   ```bash
   task logs
   ```

5. **Stop the application**:
   ```bash
   task stop
   ```

### Method 2: Using Docker Compose Directly

1. **Start all services**:
   ```bash
   docker-compose up -d
   ```

2. **View logs**:
   ```bash
   docker-compose logs -f
   ```

3. **Stop services**:
   ```bash
   docker-compose down
   ```

### Method 3: Manual Development Setup

1. **Start PostgreSQL**:
   ```bash
   # Using Docker
   docker run -d \
     --name postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=userprofile \
     -p 5432:5432 \
     postgres:15-alpine
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   npm install
   npm start
   ```

3. **Setup Frontend**:
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your backend URL
   npm install
   npm start
   ```

## 📖 How to Use the Application

1. **Register a New Account**:
   - Open http://localhost:3000
   - Click "Register here"
   - Enter a username and password
   - Optionally enter your favourite colour
   - Click "Register"

2. **Login**:
   - Enter your username and password
   - Click "Login"

3. **Update Profile**:
   - After logging in, you'll see your profile page
   - Update your favourite colour
   - Click "Update Profile"

4. **Logout**:
   - Click the "Logout" button in the top-right corner

## 🔒 Security Features

- **Password Hashing**: Passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured CORS for API security
- **SQL Injection Prevention**: Parameterized queries using pg library
- **Environment Variables**: Sensitive data stored in environment variables

## 🐳 Deployment on Coolify

### Prerequisites for Coolify Deployment

- A Coolify instance (v4.0+)
- Docker support enabled on your Coolify server
- A PostgreSQL database (can be provisioned through Coolify)

### Deployment Steps

1. **Create a New Application in Coolify**:
   - Login to your Coolify dashboard
   - Click "Add New Resource"
   - Select "Docker Compose"
   - Connect your Git repository

2. **Configure Environment Variables**:
   
   Set these environment variables in Coolify for the backend service:
   ```
   PORT=3001
   DATABASE_URL=postgresql://username:password@db-host:5432/dbname
   JWT_SECRET=<generate-a-secure-random-string>
   NODE_ENV=production
   ```
   
   Set these for the frontend service:
   ```
   REACT_APP_API_URL=https://your-backend-domain.com
   ```

3. **Database Setup**:
   - Create a PostgreSQL database in Coolify
   - Note the connection string
   - Update the `DATABASE_URL` environment variable

4. **Deploy**:
   - Push your code to the connected Git repository
   - Coolify will automatically build and deploy your application
   - Access your application via the provided URL

### Alternative: Docker Image Deployment

You can also build and push Docker images to a registry and deploy them:

1. **Build Images**:
   ```bash
   docker build -t your-registry/userprofile-backend:latest ./backend
   docker build -t your-registry/userprofile-frontend:latest ./frontend
   ```

2. **Push to Registry**:
   ```bash
   docker push your-registry/userprofile-backend:latest
   docker push your-registry/userprofile-frontend:latest
   ```

3. **Deploy in Coolify**:
   - Create services for backend and frontend
   - Use the pushed image tags
   - Configure environment variables
   - Connect to database

## 🛠️ Available Tasks

Run `task --list` to see all available tasks:

```bash
task install         # Install dependencies
task start          # Start the application
task stop           # Stop the application
task restart        # Restart the application
task logs           # View application logs
task clean          # Clean up containers and volumes
task test           # Run tests
task docker-build   # Build Docker images
task help           # Show available tasks
```

## 🔧 Configuration

### Backend Configuration (.env)

```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@database:5432/userprofile
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

### Frontend Configuration (.env)

```env
REACT_APP_API_URL=http://localhost:3001
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "username": "string",
    "password": "string",
    "favouriteColour": "string" (optional)
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### Profile Management (Requires Authentication)

- `GET /api/profile` - Get user profile
  - Headers: `Authorization: Bearer <token>`

- `PUT /api/profile` - Update user profile
  - Headers: `Authorization: Bearer <token>`
  ```json
  {
    "favouriteColour": "string"
  }
  ```

### Health Check

- `GET /health` - Check API health

## 🧪 Testing

### Test Backend

```bash
task test-backend
```

### Test Frontend

```bash
task test-frontend
```

### Run All Tests

```bash
task test
```

## 🐛 Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Ensure PostgreSQL is running
2. Check database credentials in .env
3. Verify database is accessible: `docker-compose logs database`

### Port Conflicts

If ports 3000, 3001, or 5432 are already in use:

1. Stop conflicting services
2. Or modify ports in docker-compose.yml

### Frontend Can't Connect to Backend

1. Ensure backend is running: `curl http://localhost:3001/health`
2. Check CORS configuration in backend/server.js
3. Verify REACT_APP_API_URL is set correctly

## 📝 Development Notes

### Database Schema

The application uses a single `users` table:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  favourite_colour VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Adding New Features

1. Backend changes: Modify `backend/server.js`
2. Frontend changes: Modify `frontend/src/App.js`
3. Database changes: Add migration logic in `backend/server.js` initDB function
4. Rebuild containers: `task docker-build`

## 📄 License

This project is provided as-is for educational and demonstration purposes.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

**Happy Coding! 🎉**