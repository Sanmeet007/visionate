import { usingHasValidApiKeyMiddleware } from "@/middlewares/apikey-validator";
import {
  getImageMetadataFromFile,
  getImageMetadataFromUrl,
} from "@/utils/image-meta";
import { NextResponse } from "next/server";

export const POST = usingHasValidApiKeyMiddleware(async (request) => {
  try {
    const formData = await request.formData();

    const imageFile = formData.get("image") as File;
    const imageUrl = formData.get("imageUrl");

    if (imageFile) {
      const imageMeta = await getImageMetadataFromFile(imageFile);

      return NextResponse.json({
        imageMeta,
      });
    }

    if (imageUrl) {
      const imageMeta = await getImageMetadataFromUrl(imageUrl as string);

      return NextResponse.json({
        imageMeta,
      });
    }

    return NextResponse.json(
      {
        error: true,
        message: "Missing Input: Provide an Image URL or File",
      },
      {
        status: 400,
      }
    );
  } catch (e: unknown) {
    if (Number(process.env.LOGGING_LEVEL) > 0) {
      console.error(e);
    }

    return NextResponse.json(
      {
        error: true,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
});
