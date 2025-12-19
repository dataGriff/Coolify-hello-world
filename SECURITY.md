# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Features

This application implements several security best practices:

### ✅ Implemented

1. **Password Security**
   - Passwords are hashed using bcrypt with 10 salt rounds
   - Passwords are never stored in plain text
   - One-way encryption prevents password recovery

2. **Authentication**
   - JWT-based token authentication
   - Tokens expire after 24 hours
   - Token validation on all protected endpoints
   - JWT_SECRET is required and validated on startup

3. **Database Security**
   - Parameterized SQL queries prevent SQL injection
   - No raw SQL string concatenation
   - Database credentials stored in environment variables

4. **API Security**
   - CORS configuration (configurable via environment variable)
   - Input validation on all endpoints
   - Error messages don't expose internal details
   - Health check endpoint for monitoring

5. **Configuration Security**
   - Environment variables for all sensitive data
   - No secrets committed to version control
   - `.gitignore` configured to exclude sensitive files

### ⚠️ Limitations & Recommendations

#### Missing Rate Limiting

**Issue**: API endpoints are not rate-limited, making them vulnerable to:
- Brute-force password attacks
- Denial of service (DoS)
- Account enumeration

**Recommendation**: For production use, add rate limiting:

```bash
npm install express-rate-limit
```

```javascript
// In backend/server.js
const rateLimit = require('express-rate-limit');

// General rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many login attempts, please try again later'
});

app.use('/api/auth/', authLimiter);
```

#### Token Refresh

**Issue**: Tokens expire after 24 hours with no refresh mechanism.

**Recommendation**: Implement refresh tokens for better UX:
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days)
- Secure refresh token storage

#### Account Enumeration

**Issue**: Registration endpoint returns "Username already exists" which allows enumeration.

**Recommendation**: Use generic error messages:
- "Registration failed" instead of "Username already exists"
- Same response time for success and failure
- Implement CAPTCHA for registration

#### Session Management

**Issue**: No session invalidation on password change or logout on all devices.

**Recommendation**:
- Implement token blacklist with Redis
- Add session management
- Allow users to view/revoke active sessions

## Production Security Checklist

Before deploying to production:

### Required

- [ ] Generate strong JWT_SECRET (`openssl rand -base64 32`)
- [ ] Set strong database password
- [ ] Configure CORS_ORIGIN to your specific domain
- [ ] Enable HTTPS (Coolify handles this)
- [ ] Set NODE_ENV=production
- [ ] Review and restrict database access
- [ ] Set up regular backups
- [ ] Configure logging and monitoring

### Recommended

- [ ] Add rate limiting (express-rate-limit)
- [ ] Implement account lockout after failed login attempts
- [ ] Add input validation library (validator.js or joi)
- [ ] Set up monitoring and alerting
- [ ] Implement audit logging
- [ ] Add security headers (helmet.js)
- [ ] Set up intrusion detection
- [ ] Perform security audit
- [ ] Set up vulnerability scanning (Snyk, npm audit)
- [ ] Implement CAPTCHA on registration/login
- [ ] Add email verification
- [ ] Implement 2FA (optional but recommended)

### Security Headers

Add helmet.js for security headers:

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

This adds:
- Content-Security-Policy
- X-DNS-Prefetch-Control
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- And more...

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do NOT** open a public issue
2. Email the maintainer directly (check repository for contact)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

We will respond within 48 hours and work to patch the vulnerability ASAP.

## Security Updates

- Check for security updates regularly: `npm audit`
- Update dependencies: `npm update`
- Review security advisories for your dependencies
- Subscribe to security mailing lists

## Regular Maintenance

### Weekly
- [ ] Review application logs for suspicious activity
- [ ] Check for failed login attempts
- [ ] Monitor resource usage

### Monthly
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Review and rotate credentials if needed
- [ ] Test backup restoration
- [ ] Review user accounts for suspicious activity

### Quarterly
- [ ] Full security audit
- [ ] Penetration testing (if possible)
- [ ] Review and update security policies
- [ ] Update all dependencies to latest stable versions
- [ ] Review access logs

## Known Vulnerabilities

None currently reported.

Last updated: 2024-12-19

## Additional Resources

### OWASP Top 10
Review these common security risks:
1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable and Outdated Components
7. Identification and Authentication Failures
8. Software and Data Integrity Failures
9. Security Logging and Monitoring Failures
10. Server-Side Request Forgery

### Recommended Reading
- [OWASP Node.js Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Contact

For security concerns, please contact the repository maintainer.

---

**Remember**: Security is a continuous process, not a one-time setup. Stay vigilant and keep your application updated!
