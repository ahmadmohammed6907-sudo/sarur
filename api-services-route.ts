import { NextResponse } from "next/server";
import { serviceSchema } from "@/lib/validation";
import { requireRole, handleApiError, parseRequestBody } from "@/lib/api";
import { ServiceService } from "@/services/ServiceService";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const serviceService = new ServiceService();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category") ?? undefined;
    const search = url.searchParams.get("search") ?? undefined;
    const limit = url.searchParams.get("limit")
      ? Number(url.searchParams.get("limit"))
      : undefined;

    const services = await serviceService.listServices({
      category,
      search,
      limit,
    });

    logger.logApiRequest("GET", "/api/services", 200, 0);

    return NextResponse.json({
      services,
      total: services.length,
    });
  } catch (error) {
    logger.error("Failed to fetch services", error);
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole("freelancer");
    if (!auth.ok) return auth.response;

    const body = await parseRequestBody(request);
    const parsed = serviceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const {
      title,
      description,
      category,
      price,
      deliveryDays,
      tags,
      imageUrl,
    } = parsed.data;

    const service = await serviceService.createService({
      freelancerId: auth.user.id,
      title,
      description,
      category,
      price,
      deliveryDays,
      tags,
      imageUrl,
    });

    logger.info("Service created", "SERVICE", {
      serviceId: service.id,
      freelancerId: auth.user.id,
    });

    return NextResponse.json({ success: true, id: service.id }, { status: 201 });
  } catch (error) {
    logger.error("Failed to create service", error);
    return handleApiError(error);
  }
}
