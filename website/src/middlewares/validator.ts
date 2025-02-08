import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import lodash from "lodash";
import { usersTable } from "@/drizzle/schema";

const { isNil } = lodash;

interface VaildationResults<T> {
  urlData: T | null;
  bodyData: T | null;
}
type NextApiRequestHandlerCallback<T> = {
  (
    request: NextRequest,
    validationResults: VaildationResults<T>,
    user: typeof usersTable.$inferSelect | null | undefined
  ): Promise<NextResponse> | NextResponse;
};

interface CombinedValidationSchema<T> {
  url?: Joi.ObjectSchema<T> | null;
  body?: Joi.ObjectSchema<T> | null;
}

interface MiddleWareParams<T> {
  getDataFrom: "BODY" | "URL" | "COMBINED";
  validationSchema: CombinedValidationSchema<T>;
}

/**
 *
 * Middleware function for data validation
 * - Parses the request data from either the JSON body or URL, as specified
 * - Validates the parsed data using Joi validations provided in the params (validationSchema)
 * - Specify the source of the data to be parsed: options are `BODY`, `URL`, or `COMBINED`
 *
 * - The second parameter of the callback will contain the validated data in the format
 *  `validationResults.urlData` or `validationResults.bodyData`, depending on the specified data source
 *  - The third parameter in the callback function can be either null or a valid user object,
 *   depending on the authentication middleware used before this one
 *
 *
 *  @example
 *  usingJoiValidatorMiddleware<Schema>((request, validationResults, user )=>{
 *    console.log(validationResults.urlData , validationResults.bodyData);
 *    return NextResponse.json({...})
 *  } , {
 *    validationSchema: Joi.object<Schema>({ ...}),
 *    getDataFrom: "URL" | "BODY" | "BOTH"
 *  })
 */
export function usingJoiValidatorMiddleware<T>(
  callback: NextApiRequestHandlerCallback<T>,
  params: MiddleWareParams<T>
) {
  return async (
    request: NextRequest,
    user: typeof usersTable.$inferSelect | null | undefined = null
  ) => {
    try {
      if (isNil(params?.validationSchema)) {
        throw Error("Invalid construct ! Please specify validation schema");
      }

      if (isNil(params?.getDataFrom)) {
        throw Error(
          "Invalid construct! Please specify source for parsing data"
        );
      }

      let data = null;
      if (params.getDataFrom === "URL") {
        data = Object.fromEntries(
          request.nextUrl?.searchParams?.entries() ?? {}
        );
        data = Object.fromEntries(
          request.nextUrl?.searchParams?.entries() ?? {}
        );
      } else if (params.getDataFrom === "BODY") {
        try {
          data = await request.json();
        } catch (e: unknown) {
          if (Number(process.env.LOGGING_LEVEL) > 0) {
            console.error(e);
          }

          return NextResponse.json(
            {
              error: true,
              message: "Malformed request",
            },
            {
              status: 400,
            }
          );
        }
      } else if (params.getDataFrom === "COMBINED") {
        data = null;
      } else throw Error("Invalid data source");

      let validationResult = null;

      if (params.getDataFrom === "COMBINED") {
        const urlData = Object.fromEntries(
          request.nextUrl?.searchParams?.entries() ?? {}
        );
        const bodyData = await request.json();

        if (params.validationSchema.url && params.validationSchema.body) {
          validationResult = {
            urlData: params.validationSchema.url.validate(urlData),
            bodyData: params.validationSchema.body.validate(bodyData),
          };

          if (
            validationResult.urlData?.error ||
            validationResult.bodyData?.error
          ) {
            const errorMessage =
              "URL : " +
              (validationResult.urlData?.error?.message || "No error") +
              "\nBODY : " +
              (validationResult.bodyData?.error?.message || "No error");

            return NextResponse.json(
              {
                error: true,
                message: errorMessage,
              },
              {
                status: 400,
              }
            );
          } else {
            return await callback(
              request,
              {
                urlData: validationResult.urlData.value,
                bodyData: validationResult.bodyData.value,
              },
              user
            );
          }
        } else throw new Error("Schemas not specifed");
      } else if (params.getDataFrom === "URL") {
        if (params.validationSchema?.url === null)
          throw Error("URLSchema not specifed");
        validationResult = params.validationSchema.url!.validate(data);
        if (validationResult?.error) {
          return NextResponse.json(
            {
              error: true,
              message: validationResult.error.message,
            },
            {
              status: 400,
            }
          );
        } else {
          return await callback(
            request,
            { urlData: validationResult.value, bodyData: null },
            user
          );
        }
      } else if (params.getDataFrom === "BODY") {
        if (params.validationSchema?.body === null)
          throw Error("URLSchema not specifed");
        validationResult = params.validationSchema.body!.validate(data);
        if (validationResult?.error) {
          return NextResponse.json(
            {
              error: true,
              message: validationResult.error.message,
            },
            {
              status: 400,
            }
          );
        } else {
          return await callback(
            request,
            { urlData: null, bodyData: validationResult.value },
            user
          );
        }
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
    } catch (e) {
      if (Number(process.env.LOGGING_LEVEL) > 0) {
        console.error("Caught error at validation : ", e);
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
  };
}
