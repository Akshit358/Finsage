"""
Status and health check endpoints.
Provides application health status and service monitoring.
"""

import time
import psutil
from datetime import datetime
from typing import Dict, Any
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logger import app_logger
from app.models.schemas import HealthStatus, ServiceStatus
from app.services.ai_service import ai_service
from app.services.blockchain_service import blockchain_service

router = APIRouter(prefix="/status", tags=["Status"])

# Application start time for uptime calculation
app_start_time = time.time()


@router.get("/health", response_model=HealthStatus, summary="Application Health Check")
async def health_check():
    """
    Get overall application health status.
    
    Returns:
        HealthStatus with application health information
    """
    try:
        # Calculate uptime
        uptime = time.time() - app_start_time
        
        # Check individual services
        services = await _check_services()
        
        # Determine overall status
        overall_status = "healthy"
        if any(service["status"] == "unhealthy" for service in services.values()):
            overall_status = "degraded"
        if any(service["status"] == "error" for service in services.values()):
            overall_status = "unhealthy"
        
        health_status = HealthStatus(
            status=overall_status,
            version=settings.version,
            uptime=round(uptime, 2),
            services=services
        )
        
        app_logger.info(f"Health check completed: {overall_status}")
        return health_status
        
    except Exception as e:
        app_logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Health check failed")


@router.get("/ping", summary="Simple Ping Endpoint")
async def ping():
    """
    Simple ping endpoint for basic connectivity check.
    
    Returns:
        Simple response with timestamp
    """
    return {
        "message": "pong",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "ok"
    }


@router.get("/version", summary="Application Version")
async def get_version():
    """
    Get application version information.
    
    Returns:
        Version information
    """
    return {
        "version": settings.version,
        "app_name": settings.app_name,
        "debug": settings.debug,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/services", response_model=Dict[str, ServiceStatus], summary="Service Status")
async def get_services_status():
    """
    Get detailed status of all services.
    
    Returns:
        Dictionary of service statuses
    """
    try:
        services = await _check_services()
        return services
    except Exception as e:
        app_logger.error(f"Failed to get services status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get services status")


@router.get("/metrics", summary="Application Metrics")
async def get_metrics():
    """
    Get application performance metrics.
    
    Returns:
        Performance metrics
    """
    try:
        # System metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Application metrics
        uptime = time.time() - app_start_time
        
        metrics = {
            "system": {
                "cpu_percent": cpu_percent,
                "memory": {
                    "total": memory.total,
                    "available": memory.available,
                    "percent": memory.percent,
                    "used": memory.used
                },
                "disk": {
                    "total": disk.total,
                    "used": disk.used,
                    "free": disk.free,
                    "percent": (disk.used / disk.total) * 100
                }
            },
            "application": {
                "uptime_seconds": uptime,
                "uptime_hours": uptime / 3600,
                "version": settings.version,
                "debug_mode": settings.debug
            },
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return metrics
        
    except Exception as e:
        app_logger.error(f"Failed to get metrics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get metrics")


async def _check_services() -> Dict[str, Dict[str, Any]]:
    """
    Check status of all application services.
    
    Returns:
        Dictionary of service statuses
    """
    services = {}
    
    # Check AI Service
    try:
        ai_info = ai_service.get_model_info()
        services["ai_service"] = {
            "name": "AI Service",
            "status": "healthy" if ai_info["model_loaded"] else "degraded",
            "response_time": None,
            "last_check": datetime.utcnow().isoformat(),
            "error_message": None,
            "details": ai_info
        }
    except Exception as e:
        services["ai_service"] = {
            "name": "AI Service",
            "status": "error",
            "response_time": None,
            "last_check": datetime.utcnow().isoformat(),
            "error_message": str(e),
            "details": None
        }
    
    # Check Blockchain Service
    try:
        start_time = time.time()
        blockchain_status = await blockchain_service.get_blockchain_status()
        response_time = (time.time() - start_time) * 1000
        
        services["blockchain_service"] = {
            "name": "Blockchain Service",
            "status": "healthy" if blockchain_status.is_connected else "unhealthy",
            "response_time": round(response_time, 2),
            "last_check": datetime.utcnow().isoformat(),
            "error_message": None,
            "details": {
                "connected": blockchain_status.is_connected,
                "network_id": blockchain_status.network_id,
                "latest_block": blockchain_status.latest_block
            }
        }
    except Exception as e:
        services["blockchain_service"] = {
            "name": "Blockchain Service",
            "status": "error",
            "response_time": None,
            "last_check": datetime.utcnow().isoformat(),
            "error_message": str(e),
            "details": None
        }
    
    # Check Database (placeholder for future implementation)
    services["database"] = {
        "name": "Database",
        "status": "not_implemented",
        "response_time": None,
        "last_check": datetime.utcnow().isoformat(),
        "error_message": "Database service not yet implemented",
        "details": None
    }
    
    # Check External APIs (placeholder for future implementation)
    services["external_apis"] = {
        "name": "External APIs",
        "status": "not_implemented",
        "response_time": None,
        "last_check": datetime.utcnow().isoformat(),
        "error_message": "External API integrations not yet implemented",
        "details": None
    }
    
    return services
