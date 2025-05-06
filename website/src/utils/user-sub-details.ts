import { usersTable } from "@/drizzle/schema";

interface SubDetails {
  maxRequestsPerMonth: number;
  maxImageProcessingSize: number; // in bytes
  maxAllowedKeys: number;
  speed: "slow" | "standard" | "fast";
}

export const getSubDetails = (
  user: typeof usersTable.$inferSelect
): SubDetails => {
  switch (user.subscriptionType) {
    case "free":
      return {
        maxAllowedKeys: 1,
        maxRequestsPerMonth: 50,
        maxImageProcessingSize: 5 * 1024 * 1024,
        speed: "slow",
      };
    case "starter":
      return {
        maxAllowedKeys: 1,
        maxRequestsPerMonth: 200,
        maxImageProcessingSize: 10 * 1024 * 1024,
        speed: "slow",
      };
    case "pro":
      return {
        maxAllowedKeys: 3,
        maxRequestsPerMonth: 500,
        maxImageProcessingSize: 15 * 1024 * 1024,
        speed: "slow",
      };
    case "enterprise":
      return {
        maxAllowedKeys: 500,
        maxRequestsPerMonth: Infinity,
        maxImageProcessingSize: 200 * 1024 * 1024,
        speed: "fast",
      };
  }
};
