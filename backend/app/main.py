from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import ngos, auth

# Create FastAPI app
app = FastAPI(
    title="NGO Donation Platform API",
    description="API for managing NGO donations and locations",
    version="1.0.0"
)

# Configure CORS (allow frontend to call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow GET, POST, PUT, DELETE
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(ngos.router)
app.include_router(auth.router)

@app.get("/")
def root():
    """Welcome message"""
    return {
        "message": "Welcome to NGO Donation Platform API",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
