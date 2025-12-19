# Deployment Checklist

Use this checklist when deploying the User Profile Application to production.

## Pre-Deployment

### 🔐 Security

- [ ] **Generate Strong JWT Secret**
  ```bash
  openssl rand -base64 32
  ```
  Store this securely and set as `JWT_SECRET` environment variable

- [ ] **Set Strong Database Password**
  ```bash
  openssl rand -base64 24
  ```
  Use this for `POSTGRES_PASSWORD`

- [ ] **Review CORS Configuration**
  - Ensure `cors()` in `backend/server.js` is configured for your domain
  - Consider restricting origins in production

- [ ] **Verify Environment Variables**
  - [ ] `JWT_SECRET` is set and secure
  - [ ] `DATABASE_URL` points to production database
  - [ ] `NODE_ENV=production`
  - [ ] `REACT_APP_API_URL` points to production backend URL

### 🔍 Code Review

- [ ] **Check for Hardcoded Secrets**
  ```bash
  grep -r "password" --exclude-dir={node_modules,.git}
  grep -r "secret" --exclude-dir={node_modules,.git}
  grep -r "key" --exclude-dir={node_modules,.git}
  ```

- [ ] **Verify .gitignore**
  - [ ] `.env` is ignored
  - [ ] `node_modules/` is ignored
  - [ ] Build artifacts are ignored

- [ ] **Remove Debug Code**
  - [ ] No `console.log` statements with sensitive data
  - [ ] No debug endpoints
  - [ ] Error messages don't expose internal details

### 🧪 Testing

- [ ] **Run Local Tests**
  ```bash
  ./test-api.sh
  ```

- [ ] **Test All Features Locally**
  - [ ] User registration works
  - [ ] User login works
  - [ ] Profile viewing works
  - [ ] Profile updating works
  - [ ] Logout works
  - [ ] Token expiration works (wait 24 hours or modify code to test)
  - [ ] Invalid credentials are rejected

- [ ] **Test Error Handling**
  - [ ] Duplicate username registration fails gracefully
  - [ ] Invalid login shows appropriate error
  - [ ] Expired tokens are handled
  - [ ] Network errors are caught

### 📦 Dependencies

- [ ] **Audit Dependencies**
  ```bash
  cd backend && npm audit
  cd frontend && npm audit
  ```

- [ ] **Update Dependencies** (if needed)
  ```bash
  npm update
  ```

- [ ] **Review Package Versions**
  - Check for known vulnerabilities
  - Ensure compatibility

## Deployment Steps

### 1️⃣ Coolify Setup

- [ ] **Create Coolify Account/Instance**
  - [ ] Access to Coolify dashboard
  - [ ] Server resources adequate (minimum 2GB RAM, 2 CPU cores)

- [ ] **Connect Git Repository**
  - [ ] Repository is connected to Coolify
  - [ ] Correct branch is selected
  - [ ] Webhook is configured (if using auto-deploy)

### 2️⃣ Database Setup

- [ ] **Create PostgreSQL Database**
  - [ ] Database created in Coolify
  - [ ] Connection string obtained
  - [ ] Database is accessible from backend

- [ ] **Configure Database**
  ```sql
  -- Verify the database is initialized
  \c userprofile
  \dt
  SELECT * FROM users LIMIT 1;
  ```

### 3️⃣ Environment Configuration

- [ ] **Backend Environment Variables**
  ```
  PORT=3001
  DATABASE_URL=postgresql://user:pass@host:5432/dbname
  JWT_SECRET=<your-secure-secret>
  NODE_ENV=production
  ```

- [ ] **Frontend Environment Variables**
  ```
  REACT_APP_API_URL=https://api.yourdomain.com
  ```

### 4️⃣ Domain Configuration

- [ ] **Configure Domains**
  - [ ] Frontend domain: `app.yourdomain.com`
  - [ ] Backend domain: `api.yourdomain.com`
  - [ ] DNS records are set correctly

- [ ] **SSL/TLS Certificates**
  - [ ] Certificates are provisioned (Coolify does this automatically)
  - [ ] HTTPS is working
  - [ ] HTTP redirects to HTTPS

### 5️⃣ Deploy Application

- [ ] **Trigger Deployment**
  - [ ] Push to Git triggers build (or manual deploy)
  - [ ] Watch build logs for errors
  - [ ] All services start successfully

- [ ] **Verify Build**
  - [ ] Frontend container is running
  - [ ] Backend container is running
  - [ ] Database container is running

## Post-Deployment

### ✅ Verification

- [ ] **Access Frontend**
  - [ ] https://app.yourdomain.com loads
  - [ ] No console errors
  - [ ] UI looks correct

- [ ] **Test Backend**
  ```bash
  curl https://api.yourdomain.com/health
  ```
  Should return: `{"status":"ok","service":"user-profile-backend"}`

- [ ] **Test API with Script**
  ```bash
  ./test-api.sh https://api.yourdomain.com
  ```

- [ ] **Test Full User Flow**
  - [ ] Register new account
  - [ ] Login with account
  - [ ] View profile
  - [ ] Update profile
  - [ ] Logout
  - [ ] Login again

### 📊 Monitoring Setup

- [ ] **Configure Health Checks**
  - [ ] Frontend health check: `GET /` returns 200
  - [ ] Backend health check: `GET /health` returns 200
  - [ ] Database health check: Connection test

- [ ] **Set Up Alerts** (if available)
  - [ ] Service down alerts
  - [ ] High error rate alerts
  - [ ] High response time alerts

- [ ] **Log Monitoring**
  - [ ] Access to application logs
  - [ ] Error logging is working
  - [ ] No sensitive data in logs

### 🔒 Security Verification

- [ ] **SSL/TLS Check**
  ```bash
  curl -I https://app.yourdomain.com
  ```
  Should show `Strict-Transport-Security` header

- [ ] **CORS Check**
  - [ ] Only allowed origins can access API
  - [ ] Credentials are handled correctly

- [ ] **Authentication Check**
  - [ ] Cannot access protected endpoints without token
  - [ ] Invalid tokens are rejected
  - [ ] Token expiration works

### 📝 Documentation

- [ ] **Update Documentation**
  - [ ] Production URLs in README
  - [ ] Deployment notes
  - [ ] Any environment-specific instructions

- [ ] **Document Deployment**
  - [ ] Date of deployment
  - [ ] Version deployed
  - [ ] Configuration used
  - [ ] Any issues encountered

### 💾 Backup

- [ ] **Database Backup**
  - [ ] Initial backup taken
  - [ ] Backup schedule configured
  - [ ] Backup restoration tested

- [ ] **Configuration Backup**
  - [ ] Environment variables documented securely
  - [ ] Docker configurations backed up

## Rollback Plan

If deployment fails:

1. **Check Logs**
   ```bash
   # In Coolify
   View logs for each service
   ```

2. **Verify Environment Variables**
   - Double-check all required variables are set

3. **Test Database Connection**
   ```bash
   # From backend container
   docker exec -it backend-container sh
   psql $DATABASE_URL
   ```

4. **Rollback to Previous Version**
   - In Coolify, select previous successful deployment
   - Click "Redeploy"

5. **Investigate Issues**
   - Review error messages
   - Check resource usage
   - Verify network connectivity

## Performance Optimization (Optional)

- [ ] **Enable Caching**
  - [ ] Browser caching headers
  - [ ] API response caching (if appropriate)

- [ ] **CDN Setup** (if using)
  - [ ] Static assets served via CDN
  - [ ] CDN cache configured

- [ ] **Database Optimization**
  - [ ] Indexes on frequently queried columns
  - [ ] Connection pooling enabled

## Maintenance

- [ ] **Schedule Regular Updates**
  - [ ] Dependency updates
  - [ ] Security patches
  - [ ] Database maintenance

- [ ] **Monitor Resources**
  - [ ] CPU usage
  - [ ] Memory usage
  - [ ] Disk space
  - [ ] Network bandwidth

- [ ] **Regular Backups**
  - [ ] Daily database backups
  - [ ] Weekly configuration backups
  - [ ] Test restoration quarterly

## Emergency Contacts

Document important contacts:

- [ ] **System Administrator**: _________________
- [ ] **Database Administrator**: _________________
- [ ] **On-Call Engineer**: _________________
- [ ] **Coolify Support**: support@coolify.io

## Sign-Off

- **Deployed By**: _________________
- **Date**: _________________
- **Version**: v1.0.0
- **Deployment Status**: ☐ Success ☐ Failed ☐ Partial
- **Issues Encountered**: _________________
- **Resolution**: _________________

---

## Quick Reference

### Essential Commands

```bash
# Check service status
curl https://api.yourdomain.com/health

# View logs (in Coolify dashboard)
Logs → Select Service → View

# Test API
./test-api.sh https://api.yourdomain.com

# Database backup
# (from Coolify dashboard or server)
docker exec postgres pg_dump -U postgres userprofile > backup.sql

# Restart services (in Coolify)
Click "Restart" for the service
```

### Common Issues

1. **"Connection refused"**
   - Check if services are running
   - Verify network connectivity
   - Check firewall rules

2. **"Invalid token"**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure frontend and backend use same API URL

3. **"Database error"**
   - Check DATABASE_URL is correct
   - Verify database is running
   - Check database credentials

4. **"CORS error"**
   - Verify CORS configuration in backend
   - Check allowed origins
   - Ensure credentials are included in requests

---

**Deployment Complete! 🚀**

Remember to:
- Monitor the application regularly
- Keep dependencies updated
- Backup data frequently
- Review security practices quarterly
