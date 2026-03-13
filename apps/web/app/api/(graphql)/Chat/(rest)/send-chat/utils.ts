import { db } from "@/app/api/lib/db";
import { ChatRole, ChatTable } from "@/app/api/(graphql)/Chat/db";
import { and, eq } from "drizzle-orm";
import { ERROR_MESSAGES, MAXIMUM_MESSAGES } from "@veas/constants";
import { SubscriptionType } from "@/app/api/(graphql)/Subscription/enum";
import { SubscriptionDB } from "@/app/api/(graphql)/Subscription/db";

export async function getAvailableUsage(
  id: number,
  sub: SubscriptionDB | null,
) {
  const totalChats = await db
    .select()
    .from(ChatTable)
    .where(and(eq(ChatTable.role, ChatRole.User), eq(ChatTable.userId, id)))
    .limit(MAXIMUM_MESSAGES.PRO_DAILY_LIMIT);

  const availableFreeTier = MAXIMUM_MESSAGES.FREE_TIER - totalChats.length;
  if (availableFreeTier > 0) return null;

  const lastDay = new Date();
  lastDay.setDate(lastDay.getDate() - 1);
  const chatsInLast24Hours = totalChats.filter(
    (chat) => chat.createdAt > lastDay,
  );
  const freeLimit =
    MAXIMUM_MESSAGES.FREE_DAILY_LIMIT - chatsInLast24Hours.length;

  if (freeLimit > 0) return null;

  if (!sub) return ERROR_MESSAGES.FREE_LIMIT_REACHED;

  if (sub.type === SubscriptionType.Pro) {
    const proUsage =
      MAXIMUM_MESSAGES.PRO_DAILY_LIMIT - chatsInLast24Hours.length;
    if (proUsage > 0) return null;
    return ERROR_MESSAGES.PRO_LIMIT_REACHED;
  }

  return ERROR_MESSAGES.FREE_LIMIT_REACHED;
}
