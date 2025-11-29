import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

/**
 * Health Check API Endpoint
 * 
 * Use this endpoint to verify the application is running correctly.
 * Useful for:
 * - Load balancer health checks
 * - Deployment verification
 * - Monitoring services
 * - Container orchestration (Kubernetes, Docker Swarm)
 * 
 * GET /api/health
 */
export async function GET() {
  const startTime = Date.now();
  
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
    checks: {}
  };

  // Database connectivity check
  try {
    await db.$queryRaw`SELECT 1`;
    health.checks.database = {
      status: "healthy",
      responseTime: Date.now() - startTime + "ms"
    };
  } catch (error) {
    health.checks.database = {
      status: "unhealthy",
      error: "Database connection failed"
    };
    health.status = "degraded";
  }

  // Memory usage check
  const memoryUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
  const heapUsagePercent = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);
  
  health.checks.memory = {
    status: heapUsagePercent < 90 ? "healthy" : "warning",
    heapUsed: heapUsedMB + "MB",
    heapTotal: heapTotalMB + "MB",
    heapUsagePercent: heapUsagePercent + "%"
  };

  if (heapUsagePercent >= 90) {
    health.status = health.status === "unhealthy" ? "unhealthy" : "degraded";
  }

  // Response time
  health.responseTime = Date.now() - startTime + "ms";

  // Return appropriate status code based on health
  const statusCode = health.status === "healthy" ? 200 
    : health.status === "degraded" ? 200 
    : 503;

  return NextResponse.json(health, { status: statusCode });
}
