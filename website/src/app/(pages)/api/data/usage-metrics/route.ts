import { usingAuthMiddleware } from "@/middlewares/authenticator";
import { usingJoiValidatorMiddleware } from "@/middlewares/validator";
import Joi from "joi";
import { NextResponse } from "next/server";

interface GetRequestParams {}

export const GET = usingAuthMiddleware(
  usingJoiValidatorMiddleware<GetRequestParams>(
    (_, validationResults, user) => {
      const {} = validationResults.urlData!;

      return NextResponse.json({});
    },
    {
      getDataFrom: "URL",
      validationSchema: {
        url: Joi.object({
            
        }),
      },
    }
  )
);
