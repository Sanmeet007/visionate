export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { uploadFile } from "@/utils/uploader";
import { encrypt } from "@/utils/crypt-fns";
import { usersTable } from "@/drizzle/schema";
import { db } from "@/drizzle";
import { eq } from "drizzle-orm";

export const POST = usingAuthMiddleware(async (request, user) => {
  try {
    const formData = await request.formData();
    const fileData = formData.get("image") as File;
    const removeProfileImage = (formData.get("remove-profile-image") ??
      "N") as string;

    if (removeProfileImage == "Y") {
      await db
        .update(usersTable)
        .set({
          profileImage: null,
        })
        .where(eq(usersTable.id, user.id));

      return NextResponse.json({
        error: false,
        message: "Profile image removed successfully",
      });
    }

    if (!fileData) {
      return NextResponse.json(
        {
          error: true,
          message: "File not found",
        },
        { status: 400 }
      );
    }

    const result = await uploadFile(
      fileData,
      {
        resource_type: "image",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        use_filename: true,
        filename_override: encrypt(
          `${Date.now() / 1000}_${user.id}`,
          process.env.SECURITY_STRING!
        ),
        unique_filename: false,
      },
      5 * 1e6
    );

    await db
      .update(usersTable)
      .set({
        profileImage: result.secure_url,
      })
      .where(eq(usersTable.id, user.id));

    return NextResponse.json({
      profileImageURL: result.secure_url,
      error: false,
      message: "Profile image updated successfully",
    });
  } catch (e: any) {
    if (Number(process.env.LOGGING_LEVEL) >= 1) {
      console.error(e);
    }

    if (e?.codeName || e?.http_code) {
      return NextResponse.json(
        {
          error: true,
          message: e?.message || "Something went wrong",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: true,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
});
