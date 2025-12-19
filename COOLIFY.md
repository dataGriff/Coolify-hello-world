# Deploying to Coolify

This guide provides detailed instructions for deploying the User Profile Management Application to Coolify.

## Overview

Coolify is a self-hosted alternative to platforms like Heroku and Netlify. This application is fully compatible with Coolify's Docker Compose deployment method.

## Prerequisites

- A running Coolify instance (v4.0 or later)
- Access to Coolify dashboard
- Git repository connected to Coolify
- Basic understanding of environment variables and Docker

## Deployment Methods

### Method 1: Docker Compose (Recommended)

This is the simplest method as Coolify will use the existing `docker-compose.yml` file.

#### Step 1: Create a New Resource

1. Log in to your Coolify dashboard
2. Navigate to your project
3. Click **"+ New"** → **"Resource"**
4. Select **"Docker Compose"**

#### Step 2: Connect Repository

1. Select your Git provider (GitHub, GitLab, etc.)
2. Choose the repository: `dataGriff/Coolify-hello-world`
3. Select the branch you want to deploy (e.g., `main`)
4. Set the base directory to `/` (root)

#### Step 3: Configure Docker Compose

Coolify will detect the `docker-compose.yml` file automatically. You may need to modify it for production:

Create a `docker-compose.coolify.yml` (or modify the existing one):

```yaml
version: '3.8'

services:
  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-userprofile}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      PORT: 3001
      DATABASE_URL: postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD}@database:5432/${POSTGRES_DB:-userprofile}
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      database:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        REACT_APP_API_URL: ${REACT_APP_API_URL}
    depends_on:
      - backend
    labels:
      - "coolify.managed=true"
      - "coolify.port=80"

volumes:
  postgres_data:
```

#### Step 4: Set Environment Variables

In Coolify, navigate to **Environment Variables** and add:

**For the entire stack (shared)**:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<generate-secure-password>
POSTGRES_DB=userprofile
JWT_SECRET=<generate-secure-random-string>
```

**For Backend service**:
```
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://postgres:<password>@database:5432/userprofile
```

**For Frontend service**:
```
REACT_APP_API_URL=https://your-api-domain.com
```

> **Important**: Replace `your-api-domain.com` with your actual backend domain provided by Coolify.

#### Step 5: Configure Domains

1. Go to **Domains** section in Coolify
2. Add domain for frontend (e.g., `app.yourdomain.com`)
3. Add domain for backend (e.g., `api.yourdomain.com`)
4. Enable SSL/TLS certificates (Coolify handles this automatically)

#### Step 6: Deploy

1. Click **"Deploy"** button
2. Monitor the build logs
3. Wait for all services to become healthy
4. Access your application via the configured domain

### Method 2: Separate Services

Deploy frontend and backend as separate services for more control.

#### Deploy Backend

1. **Create New Service**:
   - Click **"+ New"** → **"Application"**
   - Select **"Docker Image"** or **"Dockerfile"**

2. **Configure Backend**:
   - Repository: Your git repository
   - Dockerfile path: `backend/Dockerfile`
   - Port: 3001

3. **Environment Variables**:
   ```
   PORT=3001
   DATABASE_URL=<coolify-postgres-connection-string>
   JWT_SECRET=<secure-random-string>
   NODE_ENV=production
   ```

4. **Connect Database**:
   - Create a PostgreSQL database in Coolify
   - Copy the connection string
   - Update `DATABASE_URL` environment variable

#### Deploy Frontend

1. **Create New Service**:
   - Click **"+ New"** → **"Application"**
   - Select **"Docker Image"** or **"Dockerfile"**

2. **Configure Frontend**:
   - Repository: Your git repository
   - Dockerfile path: `frontend/Dockerfile`
   - Port: 80

3. **Build Arguments**:
   ```
   REACT_APP_API_URL=https://your-backend-domain.com
   ```

4. **Deploy**.

## Database Setup

### Option 1: Coolify Managed PostgreSQL

1. Go to **Databases** in Coolify
2. Click **"+ New Database"**
3. Select **PostgreSQL**
4. Choose version 15
5. Set database name: `userprofile`
6. Generate secure password
7. Deploy
8. Copy the connection string and use it in backend's `DATABASE_URL`

### Option 2: External Database

If you have an external PostgreSQL database:

1. Ensure it's accessible from your Coolify server
2. Update `DATABASE_URL` with the external connection string
3. Ensure firewall rules allow connections

## Environment Variables Reference

### Required Variables

| Variable | Service | Description | Example |
|----------|---------|-------------|---------|
| `DATABASE_URL` | Backend | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Backend | Secret key for JWT tokens | Random 32+ char string |
| `REACT_APP_API_URL` | Frontend | Backend API URL | `https://api.yourdomain.com` |
| `POSTGRES_PASSWORD` | Database | Database password | Secure random string |

### Optional Variables

| Variable | Service | Default | Description |
|----------|---------|---------|-------------|
| `PORT` | Backend | 3001 | Backend server port |
| `NODE_ENV` | Backend | development | Node environment |
| `POSTGRES_USER` | Database | postgres | Database user |
| `POSTGRES_DB` | Database | userprofile | Database name |

## Generating Secure Secrets

### JWT Secret

Generate a secure random string:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Or use any password generator
```

### Database Password

```bash
# Generate 24 character password
openssl rand -base64 24
```

## Post-Deployment Checklist

- [ ] All services are running (check health status)
- [ ] Database is connected and initialized
- [ ] Frontend loads correctly
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Can update profile information
- [ ] Logout functionality works
- [ ] SSL/TLS certificates are active
- [ ] Domains are correctly configured
- [ ] Environment variables are set correctly

## Troubleshooting

### Build Failures

**Issue**: Docker build fails
- Check build logs in Coolify
- Ensure Dockerfile paths are correct
- Verify base images are accessible

**Issue**: npm install fails
- Check package.json files
- Verify Node.js version compatibility
- Check network connectivity

### Runtime Issues

**Issue**: Backend can't connect to database
- Verify `DATABASE_URL` is correct
- Check if database service is running
- Ensure services are in the same network
- Check database logs

**Issue**: Frontend can't reach backend
- Verify `REACT_APP_API_URL` is correct
- Check CORS configuration in backend
- Ensure backend is accessible
- Check nginx proxy configuration

**Issue**: Authentication not working
- Verify `JWT_SECRET` is set
- Check if secret is same across backend instances
- Look at backend logs for JWT errors

### Performance Issues

**Issue**: Slow response times
- Check resource allocation in Coolify
- Increase service resources (CPU/RAM)
- Add database indexes if needed
- Enable connection pooling

**Issue**: Database connection limits
- Increase PostgreSQL max_connections
- Implement connection pooling in backend
- Check for connection leaks

## Monitoring

### View Logs

In Coolify:
1. Go to your application
2. Click **"Logs"**
3. Select service (frontend/backend/database)
4. Monitor real-time logs

### Health Checks

- Frontend: Access your domain
- Backend: Visit `https://api.yourdomain.com/health`
- Database: Check connection from backend logs

## Scaling

### Horizontal Scaling

Coolify supports running multiple instances:

1. Navigate to your service
2. Click **"Scale"**
3. Increase replica count
4. Coolify will load balance automatically

**Note**: Ensure database can handle multiple connections

### Vertical Scaling

Increase resources per service:

1. Go to service settings
2. Adjust **CPU** and **Memory** limits
3. Redeploy the service

## Backup and Recovery

### Database Backups

1. **Manual Backup**:
   ```bash
   # From Coolify server
   docker exec <postgres-container> pg_dump -U postgres userprofile > backup.sql
   ```

2. **Automated Backups**:
   - Configure in Coolify's database settings
   - Set backup schedule
   - Choose retention period

3. **Restore**:
   ```bash
   docker exec -i <postgres-container> psql -U postgres userprofile < backup.sql
   ```

## Updates and Maintenance

### Updating the Application

1. Push changes to your Git repository
2. In Coolify, click **"Redeploy"**
3. Monitor build and deployment
4. Verify application works correctly

### Rolling Back

If deployment fails:

1. Go to **Deployments** tab
2. Find previous successful deployment
3. Click **"Redeploy"** on that version

### Zero-Downtime Deployments

Coolify supports blue-green deployments:

1. New version is deployed alongside old version
2. Health checks verify new version
3. Traffic is switched to new version
4. Old version is stopped

## Security Best Practices

1. **Use Strong Secrets**: Generate cryptographically secure random strings
2. **Enable HTTPS**: Always use SSL/TLS in production
3. **Restrict Database Access**: Limit connections to backend service only
4. **Regular Updates**: Keep dependencies and base images updated
5. **Environment Variables**: Never commit secrets to Git
6. **Rate Limiting**: Consider adding rate limiting to API
7. **Monitoring**: Set up alerts for unusual activity

## Advanced Configuration

### Custom Nginx Configuration

If you need to customize the frontend's nginx:

1. Modify `frontend/nginx.conf`
2. Add custom headers, caching, etc.
3. Rebuild and redeploy

### Database Connection Pooling

For high-traffic applications, consider using PgBouncer:

1. Add PgBouncer service to docker-compose
2. Configure connection pooling
3. Point backend to PgBouncer instead of direct PostgreSQL

### Redis for Session Management

For distributed deployments:

1. Add Redis service
2. Modify backend to use Redis for sessions
3. Update docker-compose.yml

## Cost Optimization

1. **Use Alpine Images**: Already implemented (node:18-alpine)
2. **Multi-stage Builds**: Frontend already uses this
3. **Resource Limits**: Set appropriate CPU/memory limits
4. **Shared Database**: Use one database for multiple projects if appropriate
5. **CDN**: Consider using CDN for static frontend assets

## Support and Resources

- **Coolify Documentation**: https://coolify.io/docs
- **Discord Community**: Join Coolify Discord for support
- **GitHub Issues**: Report bugs in your repository

---

**Deployment Checklist Summary**:

1. ✅ Create Coolify resource (Docker Compose or separate services)
2. ✅ Connect Git repository
3. ✅ Set up PostgreSQL database
4. ✅ Configure environment variables
5. ✅ Set up domains and SSL
6. ✅ Deploy application
7. ✅ Test all functionality
8. ✅ Monitor logs and health
9. ✅ Set up backups
10. ✅ Document configuration

**You're ready to deploy! 🚀**