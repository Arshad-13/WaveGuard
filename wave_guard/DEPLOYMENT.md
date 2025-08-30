# WaveGuard Deployment Guide

This guide covers deploying the WaveGuard earthquake monitoring system with:
- **Frontend**: Next.js on Vercel
- **Backend**: FastAPI on Render

## Prerequisites

1. **API Keys**:
   - Google Maps API Key with Places API and Maps JavaScript API enabled
   - Render account for backend deployment
   - Vercel account for frontend deployment

## Backend Deployment (Render)

### 1. Prepare the Backend
```bash
cd python-backend
```

### 2. Environment Variables on Render
Set these environment variables in your Render dashboard:

```
CORS_ORIGINS=https://your-vercel-domain.vercel.app,http://localhost:3000
HOST=0.0.0.0
PORT=10000
ENVIRONMENT=production
```

### 3. Deploy to Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the following settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
   - **Environment**: Python 3.11
   - **Root Directory**: `python-backend`

### 4. Health Check
Your backend will be available at: `https://your-app-name.onrender.com`
Test the health endpoint: `https://your-app-name.onrender.com/health`

## Frontend Deployment (Vercel)

### 1. Environment Variables on Vercel
Set these environment variables in your Vercel dashboard:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NEXT_PUBLIC_BACKEND_URL=https://your-render-backend.onrender.com
```

Or use Vercel secrets (recommended):
```bash
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
vercel env add NEXT_PUBLIC_BACKEND_URL
```

### 2. Deploy to Vercel
```bash
cd wave_guard
npm install -g vercel
vercel login
vercel --prod
```

### 3. Alternative: GitHub Integration
1. Connect your GitHub repository to Vercel
2. Import your project
3. Set environment variables in the dashboard
4. Deploy automatically on push

## Google Maps Setup

### 1. Enable Required APIs
In Google Cloud Console, enable:
- Maps JavaScript API
- Places API
- Geocoding API (optional, for address lookup)

### 2. Restrict API Key
For security, restrict your API key to:
- **HTTP referrers**: `https://your-vercel-domain.vercel.app/*`
- **APIs**: Maps JavaScript API, Places API

## Testing the Deployment

### 1. Backend Tests
```bash
# Health check
curl https://your-render-backend.onrender.com/health

# Earthquake monitoring status
curl https://your-render-backend.onrender.com/api/earthquake-monitoring-status

# Location endpoint
curl -X POST https://your-render-backend.onrender.com/api/location \
  -H "Content-Type: application/json" \
  -d '{"lat": 37.7749, "lng": -122.4194, "address": "San Francisco, CA"}'
```

### 2. Frontend Tests
1. Visit your Vercel URL
2. Navigate to `/location`
3. Test location selection features
4. Verify backend connectivity

## Configuration Files

### Backend (`python-backend/`)
- `main.py` - Main FastAPI application
- `requirements.txt` - Python dependencies
- `.env.model` - Model configuration (if needed)

### Frontend (`wave_guard/`)
- `vercel.json` - Vercel deployment configuration
- `.env.local` - Local environment variables (not deployed)
- `next.config.ts` - Next.js configuration

## Environment Variables Reference

### Backend (Render)
| Variable | Description | Example |
|----------|-------------|---------|
| `CORS_ORIGINS` | Allowed origins for CORS | `https://myapp.vercel.app` |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `10000` |
| `ENVIRONMENT` | Runtime environment | `production` |

### Frontend (Vercel)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | `AIzaSy...` |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `https://myapi.onrender.com` |

## Monitoring and Maintenance

### 1. Backend Monitoring
- Check Render logs for errors
- Monitor `/health` endpoint
- Watch for USGS API rate limits

### 2. Frontend Monitoring
- Monitor Vercel deployment logs
- Check browser console for JavaScript errors
- Verify Google Maps quota usage

### 3. Regular Updates
- Keep dependencies updated
- Monitor security advisories
- Update API keys as needed

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify `CORS_ORIGINS` includes your frontend domain
   - Check protocol (https/http) matches

2. **Google Maps Not Loading**
   - Verify API key is correct
   - Check API restrictions and quotas
   - Ensure required APIs are enabled

3. **Backend Connection Issues**
   - Check `NEXT_PUBLIC_BACKEND_URL` environment variable
   - Verify backend is deployed and healthy
   - Check network connectivity

4. **Build Failures**
   - Verify all dependencies are in package.json/requirements.txt
   - Check for syntax errors
   - Review build logs for specific errors

### Support
- Backend API documentation: `https://your-backend.onrender.com/docs`
- Frontend routes: `/location` for location selection
- Health checks available at `/health` and `/api/earthquake-monitoring-status`
