/**
 * API Endpoints for Managing API Keys:
 *
 * - **POST** `/api/key` → Generate a new API key.
 * - **PUT** `/api/key` → Update API key settings (activate/disable).
 * - **DELETE** `/api/key` → Delete an existing API key.
 *
 */

const API_KEY_LIMITS = {
  free: 1,
  starter: 2,
  pro: 3,
  enterprise: Infinity,
};

import { db } from "@/drizzle";
import { apiKeysTable } from "@/drizzle/schema";
import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { usingContentTypeMiddleware } from "@/middlewares/content-type";
import { usingEmailVerificationMiddleware } from "@/middlewares/email-verifier";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import { generateApiKey } from "@/utils/key-utilities";
import { and, count, eq } from "drizzle-orm";
import Joi from "joi";
import { NextResponse } from "next/server";

export const GET = usingAuthMiddleware(async (_, user) => {
  try {
    const apiKeys = await db
      .select()
      .from(apiKeysTable)
      .where(eq(apiKeysTable.userId, user.id));

    return NextResponse.json({
      error: false,
      keys: apiKeys,
    });
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

interface PostRequestData {
  keyName: string;
}

export const POST = usingAuthMiddleware(
  usingContentTypeMiddleware(
    usingEmailVerificationMiddleware(
      usingJoiValidatorMiddleware<PostRequestData>(
        async (_, values, user) => {
          try {
            const { keyName } = values.bodyData!;
            const [{ keyCount }] = await db
              .select({ keyCount: count() })
              .from(apiKeysTable)
              .where(eq(apiKeysTable.userId, user!.id));

            const maxKeysAllowed = API_KEY_LIMITS[user!.subscriptionType];

            if (keyCount >= maxKeysAllowed) {
              return NextResponse.json(
                {
                  error: true,
                  message:
                    "API key limit reached. Upgrade your plan to generate more keys.",
                },
                { status: 403 }
              );
            }

            const [{ recordsCount }] = await db
              .select({ recordsCount: count() })
              .from(apiKeysTable)
              .where(
                and(
                  eq(apiKeysTable.userId, user!.id),
                  eq(apiKeysTable.keyName, keyName)
                )
              );

            if (recordsCount > 0) {
              return NextResponse.json(
                {
                  error: true,
                  message:
                    "Key name already exists. Please choose a different name.",
                },
                { status: 403 }
              );
            }
            const key = generateApiKey();
            await db.insert(apiKeysTable).values({
              userId: user!.id,
              isActive: true,
              apiKey: key,
              keyName: keyName,
            });

            return NextResponse.json({
              error: false,
              apiKey: key,
              message:
                "Your API key has been successfully created and is ready for use!",
            });
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
        },
        {
          getDataFrom: "BODY",
          validationSchema: {
            body: Joi.object({
              keyName: Joi.string().min(3).max(255).required(),
            }),
          },
        }
      )
    ),
    "application/json"
  )
);

interface PutRequestBodyData {
  apiKey: string;
  isActive: boolean | null;
  keyName: string | null;
}

export const PUT = usingAuthMiddleware(
  usingContentTypeMiddleware(
    usingJoiValidatorMiddleware<PutRequestBodyData>(
      async (_, values, user) => {
        try {
          const { apiKey, isActive, keyName } = values.bodyData!;
          const updateData: Record<string, boolean | string | null> = {};

          if (isActive !== undefined) updateData.isActive = isActive;

          if (keyName !== undefined) {
            updateData.keyName = keyName;

            const [{ keysCount }] = await db
              .select({ keysCount: count() })
              .from(apiKeysTable)
              .where(
                and(
                  eq(apiKeysTable.keyName, keyName as string),
                  eq(apiKeysTable.userId, user!.id)
                )
              );

            if (keysCount > 0) {
              return NextResponse.json(
                {
                  error: true,
                  message:
                    "An API key with this name already exists. Please choose a different name.",
                },
                { status: 403 }
              );
            }
          }

          if (Object.keys(updateData).length > 0) {
            await db
              .update(apiKeysTable)
              .set(updateData)
              .where(
                and(
                  eq(apiKeysTable.apiKey, apiKey),
                  eq(apiKeysTable.userId, user!.id)
                )
              );
          }

          return NextResponse.json({
            error: false,
            message: "API key details have been successfully updated",
          });
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
      },
      {
        getDataFrom: "BODY",
        validationSchema: {
          body: Joi.object({
            apiKey: Joi.string().length(64).required(),
            isActive: Joi.boolean().optional(),
            keyName: Joi.string().min(3).max(100).optional(),
          }),
        },
      }
    ),
    "application/json"
  )
);

interface DeleteRequestBodyData {
  apiKey: string;
}

export const DELETE = usingAuthMiddleware(
  usingContentTypeMiddleware(
    usingJoiValidatorMiddleware<DeleteRequestBodyData>(
      async (_, values, user) => {
        try {
          const { apiKey } = values.bodyData!;

          await db
            .delete(apiKeysTable)
            .where(
              and(
                eq(apiKeysTable.userId, user!.id),
                eq(apiKeysTable.apiKey, apiKey)
              )
            );
          return NextResponse.json({
            error: false,
            message: "API key has been successfully removed.",
          });
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
      },
      {
        getDataFrom: "BODY",
        validationSchema: {
          body: Joi.object({
            apiKey: Joi.string().required().length(64),
          }),
        },
      }
    ),
    "application/json"
  )
);
