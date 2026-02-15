import { Injector } from "naystack/graphql/server";
import type { Metadata } from "next";
import { eq, count, and } from "drizzle-orm";
import { db } from "../../../api/lib/db";
import { UserTable, UserChartTable } from "../../../api/(graphql)/User/db";
import { ChatTable } from "../../../api/(graphql)/Chat/db";
import { ChatRole } from "../../../api/(graphql)/Chat/enum";
import UserDetail from "./user-detail";

export const metadata: Metadata = {
  title: "User Detail | Admin Dashboard",
};

async function fetchUser(paramsPromise: Promise<{ id: string }>) {
  const { id: idStr } = await paramsPromise;
  const id = parseInt(idStr, 10);
  const [user] = await db
    .select({
      id: UserTable.id,
      name: UserTable.name,
      email: UserTable.email,
      gender: UserTable.gender,
      placeOfBirth: UserTable.placeOfBirth,
      timezoneOffset: UserTable.timezoneOffset,
      chartId: UserTable.chartId,
    })
    .from(UserTable)
    .where(eq(UserTable.id, id));

  if (!user) return null;

  const [[{ totalMessages }], [chart]] = await Promise.all([
    db
      .select({ totalMessages: count() })
      .from(ChatTable)
      .where(
        and(eq(ChatTable.userId, id), eq(ChatTable.role, ChatRole.user)),
      ),
    db
      .select({
        dateOfBirth: UserChartTable.dateOfBirth,
        placeOfBirthLat: UserChartTable.placeOfBirthLat,
        placeOfBirthLong: UserChartTable.placeOfBirthLong,
      })
      .from(UserChartTable)
      .where(eq(UserChartTable.id, user.chartId)),
  ]);

  return {
    ...user,
    totalMessages,
    dateOfBirth: chart?.dateOfBirth?.toISOString() ?? null,
    placeOfBirthLat: chart?.placeOfBirthLat ?? null,
    placeOfBirthLong: chart?.placeOfBirthLong ?? null,
  };
}

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Injector
      fetch={() => fetchUser(params)}
      Component={UserDetail}
    />
  );
}
