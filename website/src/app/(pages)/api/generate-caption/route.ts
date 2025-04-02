import { db } from "@/drizzle";
import { apiKeysTable, apiRequestsTable, usersTable } from "@/drizzle/schema";
import { usingHasValidApiKeyMiddleware } from "@/middlewares/apikey-validator";
import {
  getImageMetadataFromFile,
  getImageMetadataFromUrl,
  ImageMetadata,
} from "@/utils/image-meta";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const getMaxAllowedImageSize = (userRole: string): number => {
  const sizeLimits: Record<string, number> = {
    free: 5 * 1024 * 1024, // 5MB
    starter: 10 * 1024 * 1024, // 10MB
    pro: 15 * 1024 * 1024, // 15MB
    enterprise: 20 * 1024 * 1024, // 20MB
  };

  return sizeLimits[userRole] ?? 0;
};

export const POST = usingHasValidApiKeyMiddleware(async (request, apikey) => {
  let generatedImageMeta: ImageMetadata | null = null,
    processedUserId: string | null = null,
    processedApiKeyId: number | null = null;

  try {
    const [record] = await db
      .select()
      .from(apiKeysTable)
      .where(eq(apiKeysTable.apiKey, apikey));

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, record.userId));

    processedUserId = user.id;
    processedApiKeyId = record.id;

    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const imageUrl = formData.get("imageUrl");

    const maxAllowedImageSize = getMaxAllowedImageSize(user.subscriptionType);
    const pipedFormData = new FormData();

    if (!imageFile && !imageUrl) {
      return NextResponse.json(
        {
          error: true,
          message: "Missing Input: Provide an Image URL or File",
        },
        {
          status: 400,
        }
      );
    }

    const imageSource = imageFile ?? imageUrl;

    const imageMeta = imageFile
      ? await getImageMetadataFromFile(imageFile)
      : await getImageMetadataFromUrl(imageUrl as string);

    generatedImageMeta = imageMeta;

    if (imageMeta.sizeInBytes > maxAllowedImageSize) {
      await db.insert(apiRequestsTable).values({
        apiKeyId: record.id,
        userId: user.id,
        ipAddress:
          (request.headers.get("X-Real-IP") ||
            request.headers.get("X-Forwarded-For")) ??
          "na",
        deviceName: request.headers.get("User-Agent"),
        endpoint: "generate-caption",
        imageHeight: imageMeta.height,
        imageWidth: imageMeta.width,
        imageSize: imageMeta.sizeInBytes,
        userAgent: request.headers.get("user-agent") || "Mozilla/5.0",
        processStatus: "failed",
        imageMime: imageMeta.mimeType,
      });

      return NextResponse.json(
        {
          error: true,
          message: "Image exceeds the maximum allowed size.",
        },
        { status: 403 }
      );
    }

    pipedFormData.append(imageFile ? "image" : "image_url", imageSource);

    const res = await fetch(`${process.env.CAPTION_API_ENDPOINT}`, {
      method: "POST",
      body: pipedFormData,
    });

    if (!res.ok) {
      const resBody = await res.json();
      return NextResponse.json(
        {
          error: true,
          message: resBody?.error ?? "Something went wrong",
        },
        { status: 400 }
      );
    }

    const resBody = await res.json();

    await db.insert(apiRequestsTable).values({
      apiKeyId: record.id,
      userId: user.id,
      ipAddress:
        (request.headers.get("X-Real-IP") ||
          request.headers.get("X-Forwarded-For")) ??
        "na",
      deviceName: request.headers.get("User-Agent"),
      endpoint: "generate-caption",
      imageHeight: imageMeta.height,
      imageWidth: imageMeta.width,
      imageSize: imageMeta.sizeInBytes,
      userAgent: request.headers.get("user-agent") || "Mozilla/5.0",
      processStatus: "success",
      imageMime: imageMeta.mimeType,
    });

    return NextResponse.json({
      error: false,
      message: "Captions generated successfully!",
      caption: resBody.description,
    });
  } catch (e: unknown) {
    if (
      generatedImageMeta != null &&
      processedUserId != null &&
      processedApiKeyId != null
    ) {
      await db.insert(apiRequestsTable).values({
        apiKeyId: processedApiKeyId,
        userId: processedUserId,
        ipAddress:
          (request.headers.get("X-Real-IP") ||
            request.headers.get("X-Forwarded-For")) ??
          "na",
        deviceName: request.headers.get("User-Agent"),
        endpoint: "generate-caption",
        imageHeight: generatedImageMeta.height,
        imageWidth: generatedImageMeta.width,
        imageSize: generatedImageMeta.sizeInBytes,
        userAgent: request.headers.get("user-agent") || "Mozilla/5.0",
        processStatus: "failed",
        imageMime: generatedImageMeta.mimeType,
      });
    }

    if (Number(process.env.LOGGING_LEVEL) > 0) {
      console.error(e);
    }

    return NextResponse.json(
      {
        error: true,
        message: "",
      },
      { status: 500 }
    );
  }
});
