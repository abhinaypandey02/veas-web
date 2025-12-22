import { db } from "@/app/api/lib/db";
import { UserTable, UserRawChartTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { getCharts } from "./utils/fetch";
import { compressChartData } from "./utils/compress";
import { filterRawChart } from "./utils/filter";

/**
 * Updates the raw chart data for a user
 * This should be called when user completes onboarding or updates birth data
 * @param userId - The user ID to update charts for
 * @throws Error if user not found or missing birth data
 */
export async function updateRawChart(userId: number): Promise<void> {
  // Get user data
  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, userId));

  if (!user) {
    throw new Error("User not found");
  }

  if (
    !user.dateOfBirth ||
    !user.placeOfBirthLat ||
    !user.placeOfBirthLong ||
    user.timezone === null ||
    user.timezone === undefined
  ) {
    throw new Error(
      "User birth data incomplete. Please complete onboarding first.",
    );
  }

  // Use timezone stored during onboarding
  const timezoneOffset = user.timezone;

  // Fetch chart data
  const chartData = await getCharts({
    datetime: user.dateOfBirth,
    timezone: timezoneOffset,
    lat: user.placeOfBirthLat,
    lon: user.placeOfBirthLong,
  });

  // Filter raw chart to remove unnecessary technical details before storing
  const filteredRawChart = filterRawChart(chartData);

  // Compress the filtered chart data using GZIP (returns base64 string)
  const compressedBase64 = compressChartData(filteredRawChart);

  // Store compressed data as JSONB: { compressed: "base64string" }
  const rawChartJsonb = {
    compressed: compressedBase64,
  };

  // Upsert raw chart (filtered and compressed as JSONB)
  await db
    .insert(UserRawChartTable)
    .values({
      userId,
      rawChart: rawChartJsonb,
    })
    .onConflictDoUpdate({
      target: UserRawChartTable.userId,
      set: {
        rawChart: rawChartJsonb,
        updatedAt: new Date(),
      },
    });
}

