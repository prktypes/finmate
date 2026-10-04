# Environment Variables Configuration

This document describes all environment variables used in the FinPilot project.

## Backend Environment Variables

### Required Variables

#### `DATABASE_URL`
**Description**: PostgreSQL database connection string  
**Format**: `postgresql://[user]:[password]@[host]:[port]/[database]`  
**Example**: `postgresql://finmate_user:finmate_password@localhost:5432/finmate`  
**Default**: `postgresql://finmate_user:finmate_password@localhost:5432/finmate`

#### `ENVIRONMENT`
**Description**: Application environment  
**Allowed Values**: `development`, `staging`, `production`  
**Default**: `development`

#### `UPLOAD_DIR`
**Description**: Directory for storing uploaded files  
**Example**: `/app/uploads` or `./uploads`  
**Default**: `./uploads`

#### `OLLAMA_HOST`
**Description**: Ollama API endpoint for LLM inference  
**Format**: `http://[host]:[port]`  
**Example**: `http://localhost:11434`  
**Default**: `http://localhost:11434`  
**Note**: In Docker, use `http://host.docker.internal:11434` to access host's Ollama

### Optional Variables

#### `LOG_LEVEL`
**Description**: Application logging level  
**Allowed Values**: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`  
**Default**: `INFO`

## Frontend Environment Variables

### Required Variables

#### `NEXT_PUBLIC_API_URL`
**Description**: Backend API base URL  
**Format**: `http://[host]:[port]`  
**Example**: `http://localhost:8000`  
**Default**: `http://localhost:8000`  
**Note**: Must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser

### Optional Variables

#### `NEXT_PUBLIC_APP_NAME`
**Description**: Application name displayed in the UI  
**Default**: `FinMate`

## Docker Environment Variables

When running with Docker Compose, use the following in your `.env` file:

```bash
# Database
POSTGRES_DB=finmate
POSTGRES_USER=finmate_user
POSTGRES_PASSWORD=finmate_password
DATABASE_URL=postgresql://finmate_user:finmate_password@postgres:5432/finmate

# Backend
ENVIRONMENT=development
UPLOAD_DIR=/app/uploads
OLLAMA_HOST=http://host.docker.internal:11434

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Setting Up Environment Variables

### Local Development (Without Docker)

1. **Backend**: Create `backend/.env` file:
```bash
cd backend
cp ../.env.example .env
# Edit .env with your values
```

2. **Frontend**: Create `frontend/.env.local` file:
```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### Docker Development

1. Create `.env` file in project root:
```bash
cp .env.example .env
# Edit .env with your values
```

2. Docker Compose will automatically load these variables

### Production Deployment

For production, set these variables through your hosting platform:

- **Environment Variables**: Set through platform UI or CLI
- **Secrets**: Use secret management (e.g., AWS Secrets Manager, Azure Key Vault)
- **Never commit**: `.env` files to version control

## Security Best Practices

1. **Never commit** `.env` files to Git
2. **Use strong passwords** for database credentials
3. **Rotate credentials** regularly in production
4. **Use secrets management** for production deployments
5. **Restrict database access** to backend services only
6. **Use HTTPS** in production for all API calls

## Troubleshooting

### Backend can't connect to database
- Check `DATABASE_URL` is correct
- Verify PostgreSQL is running
- Check network connectivity
- Verify credentials are correct

### Frontend can't reach backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is running
- Check CORS configuration
- Verify port is not blocked by firewall

### Ollama not accessible
- Check `OLLAMA_HOST` is correct
- Verify Ollama is installed and running
- Check port 11434 is accessible
- In Docker, use `host.docker.internal` instead of `localhost`

## Environment-Specific Configuration

### Development
```bash
ENVIRONMENT=development
DATABASE_URL=postgresql://finmate_user:finmate_password@localhost:5432/finmate
OLLAMA_HOST=http://localhost:11434
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Staging
```bash
ENVIRONMENT=staging
DATABASE_URL=postgresql://user:pass@staging-db-host:5432/finmate_staging
OLLAMA_HOST=http://staging-ollama-host:11434
NEXT_PUBLIC_API_URL=https://api-staging.finmate.example.com
```

### Production
```bash
ENVIRONMENT=production
DATABASE_URL=postgresql://user:pass@prod-db-host:5432/finmate_prod
OLLAMA_HOST=http://prod-ollama-host:11434
NEXT_PUBLIC_API_URL=https://api.finmate.example.com
```

## Additional Notes

- All `NEXT_PUBLIC_*` variables are embedded in the frontend build and visible to users
- Backend environment variables are only accessible on the server
- Changes to frontend environment variables require a rebuild
- Backend can reload environment variables on restart
