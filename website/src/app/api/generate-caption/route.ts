import { usingHasValidApiKeyMiddleware } from "@/middlewares/apikey-validator";
import { getImageMetadata } from "@/utils/image-meta";
import { NextResponse } from "next/server";

export const POST = usingHasValidApiKeyMiddleware(async (request) => {
  try {
    const formData = await request.formData();

    const imageFile = formData.get("image") as File;
    const imageUrl = formData.get("imageUrl");

    if (imageFile) {
      return NextResponse.json({
        imageFile: {
          name: imageFile.name,
          size: imageFile.size,
        },
      });
    }

    if (imageUrl) {
      console.log(await getImageMetadata(imageUrl as string));

      return NextResponse.json({
        imageUrl,
      });
    }

    return NextResponse.json(
      {
        error: true,
        message: "Please provide either image url or image file",
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
