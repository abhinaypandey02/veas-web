import { db } from "@/app/api/lib/db";
import { UserChartTable } from "@/app/api/(graphql)/User/db";
import { and, eq } from "drizzle-orm";
import { updateRawChart } from "@/app/api/lib/charts/utils/compress";
import { waitUntil } from "@vercel/functions";
import {
  generateD1Summary,
  generateTransitSummaries,
  generateDashaSummaries,
} from "@/app/api/lib/charts/utils/summaries";
import { getLocalTime } from "@/utils/location";

interface CreateUserChartInput {
  lat: number;
  long: number;
  dob: Date;
  timezone: number;
}

export async function createUserChart(input: CreateUserChartInput) {
  const [existingChart] = await db
    .select({
      id: UserChartTable.id,
    })
    .from(UserChartTable)
    .where(
      and(
        eq(UserChartTable.dateOfBirth, input.dob),
        eq(UserChartTable.placeOfBirthLat, input.lat),
        eq(UserChartTable.placeOfBirthLong, input.long),
      ),
    )
    .limit(1);

  if (existingChart) {
    return existingChart.id;
  }

  const [newChart] = await db
    .insert(UserChartTable)
    .values({
      dateOfBirth: input.dob,
      placeOfBirthLat: input.lat,
      placeOfBirthLong: input.long,
    })
    .returning({ id: UserChartTable.id });

  waitUntil(
    (async () => {
      const localDateOfBirth = getLocalTime(input.dob, input.timezone);
      const chart = await updateRawChart(newChart.id, {
        dateOfBirth: input.dob,
        placeOfBirthLat: input.lat,
        placeOfBirthLong: input.long,
      });

      if (!chart) {
        throw new Error("Failed to update chart");
      }
      await generateD1Summary(chart, newChart.id);
      await generateTransitSummaries(chart, localDateOfBirth, newChart.id);
      await generateDashaSummaries(chart, localDateOfBirth, newChart.id);
    })(),
  );

  return newChart.id;
}
