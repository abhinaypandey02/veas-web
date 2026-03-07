import { ChatDB } from "@/app/api/(graphql)/Chat/db";
import { ERROR_MESSAGES, MAXIMUM_MESSAGES } from "@/mobile/constants/chat";
import { SubscriptionDB } from "@/app/api/(graphql)/Subscription/db";
import { SubscriptionType } from "@/app/api/(graphql)/Subscription/enum";

export async function getAvailableUsage(
  totalChats: ChatDB[],
  sub?: SubscriptionDB | null,
) {
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
