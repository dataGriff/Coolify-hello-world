# Quick Start Guide

Get the User Profile application running in 5 minutes!

## Prerequisites

Make sure you have installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop) or Docker Engine
- [Task](https://taskfile.dev/installation/) (optional but recommended)

## 🚀 Quick Start (3 Steps)

### Step 1: Clone the Repository

```bash
git clone https://github.com/dataGriff/Coolify-hello-world.git
cd Coolify-hello-world
```

### Step 2: Set JWT Secret (Required)

```bash
# Copy environment template
cp .env.example .env

# Generate a secure JWT secret
openssl rand -base64 32

# Edit .env and paste the generated secret as JWT_SECRET value
```

Or set it directly:
```bash
export JWT_SECRET=$(openssl rand -base64 32)
```

### Step 3: Start the Application

**Option A: Using Task (Recommended)**
```bash
task start
```

**Option B: Using Docker Compose**
```bash
docker compose up -d
```

### Step 4: Open Your Browser

Visit [http://localhost:3000](http://localhost:3000)

That's it! 🎉

## What You Can Do Now

1. **Register a New Account**
   - Click "Register here"
   - Enter a username and password
   - Optionally add your favourite colour
   - Click "Register"

2. **Login**
   - Enter your credentials
   - Click "Login"

3. **Update Your Profile**
   - Change your favourite colour
   - Click "Update Profile"

4. **Logout**
   - Click "Logout" button

## 📊 View Logs

```bash
# Using Task
task logs

# Using Docker Compose
docker compose logs -f
```

## 🛑 Stop the Application

```bash
# Using Task
task stop

# Using Docker Compose
docker compose down
```

## 🧪 Test the API

Run the automated test script:

```bash
./test-api.sh
```

## 🔧 Environment Configuration (Optional)

For production or custom setups:

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set your values:
   ```bash
   JWT_SECRET=your-secure-random-string
   ```

3. Generate a secure JWT secret:
   ```bash
   openssl rand -base64 32
   ```

## 📚 Need More Details?

Check out these guides:
- [README.md](README.md) - Full documentation
- [COOLIFY.md](COOLIFY.md) - Deploy to Coolify
- [Taskfile.yml](Taskfile.yml) - Available commands

## 🐛 Troubleshooting

### Port Already in Use

If you see "port already in use" errors:

1. Check what's using the ports:
   ```bash
   # On Linux/Mac
   lsof -i :3000
   lsof -i :3001
   lsof -i :5432
   
   # On Windows
   netstat -ano | findstr :3000
   netstat -ano | findstr :3001
   netstat -ano | findstr :5432
   ```

2. Stop the conflicting service or modify `docker-compose.yml` to use different ports.

### Can't Connect to Database

```bash
# Check if database is healthy
docker compose ps

# View database logs
docker compose logs database

# Restart the application
task restart
```

### Frontend Can't Connect to Backend

1. Ensure backend is running:
   ```bash
   curl http://localhost:3001/health
   ```

2. Check logs:
   ```bash
   docker compose logs backend
   ```

### Permission Denied on Linux

If you get permission errors with Docker:

```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Then logout and login again
```

## 🎯 Development Tips

### Running in Development Mode

For hot-reload during development:

1. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database**: Keep using Docker
   ```bash
   docker run -d \
     --name postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=userprofile \
     -p 5432:5432 \
     postgres:15-alpine
   ```

## 📞 Need Help?

- Check the [full README](README.md)
- Review [Coolify deployment guide](COOLIFY.md)
- Open an issue on GitHub
- Check Docker logs: `docker compose logs`

---

**Enjoy building! 🚀**
