import { db } from "@/db";
import { sql } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected';
    latency: number;
  };
  memory: {
    used: number;
    total: number;
  };
  version: string;
}

export async function GET() {
  // Restrict to admin users only
  const user = await getCurrentUser();
  if (!user || user.userType !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();

  try {
    // Check database connection
    const dbStart = Date.now();
    await db.execute(sql`select 1`);
    const dbLatency = Date.now() - dbStart;

    // Get memory usage
    const memUsage = process.memoryUsage();

    const response: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: 'connected',
        latency: dbLatency,
      },
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024),
        total: Math.round(memUsage.heapTotal / 1024 / 1024),
      },
      version: process.env.npm_package_version || '1.0.0',
    };

    logger.info('Health check passed', 'HEALTH', {
      latency: Date.now() - startTime,
      dbLatency,
    });

    return Response.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    logger.error('Health check failed', error, 'HEALTH');

    const response: HealthCheckResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: 'disconnected',
        latency: -1,
      },
      memory: {
        used: 0,
        total: 0,
      },
      version: process.env.npm_package_version || '1.0.0',
    };

    return Response.json(response, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}
