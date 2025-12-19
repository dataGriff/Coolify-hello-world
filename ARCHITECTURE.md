# Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's Browser                          │
│                     (http://localhost:3000)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend Container                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                     React Application                     │ │
│  │  • Login/Register Forms                                   │ │
│  │  • Profile Management                                     │ │
│  │  • State Management (useState)                            │ │
│  │  • API Communication (axios)                              │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    Nginx Web Server                       │ │
│  │  • Serves React build (port 80)                           │ │
│  │  • Proxy requests to backend                              │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ REST API (JSON)
                             │ + JWT Token
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Backend Container                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                  Express.js API Server                    │ │
│  │  • Authentication Endpoints (/api/auth/*)                 │ │
│  │  • Profile Endpoints (/api/profile)                       │ │
│  │  • JWT Middleware                                         │ │
│  │  • CORS Configuration                                     │ │
│  │  • Health Check (/health)                                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                  Security Layer                           │ │
│  │  • bcrypt (password hashing)                              │ │
│  │  • jsonwebtoken (JWT generation/validation)               │ │
│  │  • Environment variable validation                        │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ SQL Queries
                             │ (PostgreSQL Protocol)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Database Container                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                  PostgreSQL 15                            │ │
│  │                                                           │ │
│  │  Tables:                                                  │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ users                                               │ │ │
│  │  │ • id (SERIAL PRIMARY KEY)                           │ │ │
│  │  │ • username (VARCHAR UNIQUE)                         │ │ │
│  │  │ • password_hash (VARCHAR)                           │ │ │
│  │  │ • favourite_colour (VARCHAR)                        │ │ │
│  │  │ • created_at (TIMESTAMP)                            │ │ │
│  │  │ • updated_at (TIMESTAMP)                            │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    Persistent Volume                      │ │
│  │  • postgres_data                                          │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

### 1. User Registration Flow

```
User Input → Frontend → POST /api/auth/register → Backend
                                                     ↓
                                                  Validate input
                                                     ↓
                                                  Hash password (bcrypt)
                                                     ↓
                                                  INSERT INTO users
                                                     ↓
                                                  Generate JWT token
                                                     ↓
Frontend ← 201 Created + Token + User data ← Backend
   ↓
Store token in localStorage
   ↓
Redirect to Profile page
```

### 2. User Login Flow

```
User Input → Frontend → POST /api/auth/login → Backend
                                                   ↓
                                                SELECT user
                                                   ↓
                                                Compare passwords (bcrypt)
                                                   ↓
                                                Generate JWT token
                                                   ↓
Frontend ← 200 OK + Token + User data ← Backend
   ↓
Store token in localStorage
   ↓
Redirect to Profile page
```

### 3. Profile Update Flow

```
User Input → Frontend → PUT /api/profile → Backend
                        + Authorization: Bearer <token>
                                              ↓
                                           Verify JWT token
                                              ↓
                                           Validate user exists
                                              ↓
                                           UPDATE users SET favourite_colour
                                              ↓
Frontend ← 200 OK + Updated user data ← Backend
   ↓
Update UI state
```

### 4. Authentication Middleware

```
Request → authenticateToken middleware
            ↓
         Extract token from Authorization header
            ↓
         Verify token with JWT_SECRET
            ↓
         ✓ Valid → Add user to req.user → Continue to route handler
         ✗ Invalid → 403 Forbidden
         ✗ Missing → 401 Unauthorized
```

## Technology Stack

### Frontend
- **Framework**: React 18
- **UI Library**: Plain React (no additional UI framework)
- **HTTP Client**: Axios
- **State Management**: React useState hooks
- **Build Tool**: React Scripts (Create React App)
- **Web Server**: Nginx (production)

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database Driver**: pg (node-postgres)
- **Authentication**: jsonwebtoken
- **Password Hashing**: bcrypt
- **CORS**: cors middleware
- **Environment Config**: dotenv

### Database
- **DBMS**: PostgreSQL 15
- **Connection**: Direct connection via pg driver
- **Schema Management**: SQL in initDB function

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Base Images**: 
  - Node: `node:18-alpine`
  - Frontend: `nginx:alpine`
  - Database: `postgres:15-alpine`
- **Task Automation**: Taskfile
- **CI/CD Ready**: Coolify compatible

## Security Architecture

### 1. Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: Password Security                                  │
│  • Passwords never stored in plain text                     │
│  • bcrypt hashing with salt (10 rounds)                     │
│  • One-way encryption                                       │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Token-Based Authentication                         │
│  • JWT tokens with 24-hour expiry                           │
│  • Signed with secret key (JWT_SECRET)                      │
│  • Stateless authentication                                 │
│  • Token stored in localStorage                             │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: API Protection                                     │
│  • authenticateToken middleware                             │
│  • All profile endpoints require valid token                │
│  • Token verification on each request                       │
├─────────────────────────────────────────────────────────────┤
│ Layer 4: Database Security                                  │
│  • Parameterized queries (SQL injection prevention)         │
│  • No raw SQL concatenation                                 │
│  • Database credentials in environment variables            │
├─────────────────────────────────────────────────────────────┤
│ Layer 5: Network Security                                   │
│  • CORS configuration                                       │
│  • HTTPS support (in production)                            │
│  • Environment-based configuration                          │
└─────────────────────────────────────────────────────────────┘
```

### 2. JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "id": 1,
  "username": "john",
  "iat": 1703001234,
  "exp": 1703087634
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)
```

## Data Flow

### Registration Data Flow

```
┌──────────┐    ┌──────────┐    ┌─────────┐    ┌──────────┐
│  User    │───▶│ Frontend │───▶│ Backend │───▶│ Database │
│ (Browser)│    │  (React) │    │(Express)│    │(Postgres)│
└──────────┘    └──────────┘    └─────────┘    └──────────┘
    │               │                │               │
    │ 1. Enter data │                │               │
    │───────────────▶                │               │
    │               │ 2. POST /api/  │               │
    │               │    auth/register               │
    │               │────────────────▶               │
    │               │                │ 3. Validate   │
    │               │                │    input      │
    │               │                │               │
    │               │                │ 4. Hash pwd   │
    │               │                │               │
    │               │                │ 5. INSERT     │
    │               │                │────────────────▶
    │               │                │               │
    │               │                │ 6. Return user│
    │               │                │◀───────────────
    │               │                │               │
    │               │                │ 7. Generate   │
    │               │                │    JWT token  │
    │               │                │               │
    │               │ 8. 201 Created │               │
    │               │    + token     │               │
    │               │◀───────────────                │
    │               │                │               │
    │ 9. Show       │ 10. Store token│               │
    │    profile    │     localStorage               │
    │◀──────────────                │               │
```

## Deployment Architecture

### Local Development
```
Developer Machine
├── Docker Desktop
│   ├── frontend:3000
│   ├── backend:3001
│   └── database:5432
└── Browser → localhost:3000
```

### Coolify Production
```
Coolify Server
├── Docker Network
│   ├── frontend (Nginx)
│   │   └── domain: app.yourdomain.com
│   ├── backend (Node.js)
│   │   └── domain: api.yourdomain.com
│   └── database (PostgreSQL)
│       └── internal network only
├── SSL/TLS Certificates (automatic)
└── Environment Variables (secure storage)
```

## Scalability Considerations

### Current Architecture
- **Single container per service**: Simple, suitable for small to medium loads
- **Direct database connections**: No connection pooling
- **Stateless backend**: Easy to scale horizontally
- **JWT tokens**: No session storage required

### Future Scalability Options

1. **Horizontal Scaling**
   ```
   Load Balancer
   ├── Frontend Instance 1
   ├── Frontend Instance 2
   └── Frontend Instance 3
   
   Load Balancer
   ├── Backend Instance 1
   ├── Backend Instance 2
   └── Backend Instance 3
   
   Database (with replication)
   ├── Primary (read/write)
   └── Replica (read-only)
   ```

2. **Caching Layer**
   ```
   Backend ↔ Redis ↔ PostgreSQL
   ```

3. **Database Connection Pooling**
   ```
   Backend ↔ PgBouncer ↔ PostgreSQL
   ```

## Performance Characteristics

- **Frontend**: Static files served by Nginx (fast)
- **Backend**: Node.js single-threaded (suitable for I/O-bound operations)
- **Database**: PostgreSQL (ACID compliant, reliable)
- **Authentication**: JWT (stateless, no database lookups per request)

## Monitoring Points

1. **Health Checks**
   - Frontend: HTTP 200 on port 80/443
   - Backend: GET /health returns {"status": "ok"}
   - Database: pg_isready

2. **Key Metrics**
   - Response times
   - Error rates
   - Active connections
   - Database query performance
   - JWT validation failures

## Development Workflow

```
┌──────────────┐
│ Code Change  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Git Commit  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Git Push    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Coolify    │
│   Detects    │
│   Change     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Docker Build │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Deploy     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Health      │
│  Check       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Live!      │
└──────────────┘
```

---

## Summary

This architecture provides:
- ✅ **Separation of Concerns**: Frontend, Backend, Database
- ✅ **Security**: JWT authentication, password hashing, parameterized queries
- ✅ **Scalability**: Stateless design, containerized services
- ✅ **Maintainability**: Clear structure, documented code
- ✅ **Deployability**: Docker containers, Coolify compatible
- ✅ **Developer Experience**: Hot reload, clear documentation, task automation
