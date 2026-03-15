import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { SubscriptionTable } from "@/app/api/(graphql)/Subscription/db";
import { SubscriptionType } from "@/app/api/(graphql)/Subscription/enum";
import { db } from "@/app/api/lib/db";

// Events that indicate an active subscription
const ACTIVE_EVENTS = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "UNCANCELLATION",
  "SUBSCRIPTION_EXTENDED",
]);

// Events that indicate subscription should be removed
const INACTIVE_EVENTS = new Set(["CANCELLATION", "EXPIRATION"]);

export const POST = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== process.env.REVENUECAT_WEBHOOK_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const event = body.event;

  if (!event) {
    return NextResponse.json({ error: "Missing event" }, { status: 400 });
  }

  const { type, app_user_id, expiration_at_ms } = event;
  const userId = parseInt(app_user_id, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  if (ACTIVE_EVENTS.has(type)) {
    const validTill = expiration_at_ms
      ? new Date(expiration_at_ms)
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    await db
      .insert(SubscriptionTable)
      .values({
        userId,
        type: SubscriptionType.Pro,
        validTill,
      })
      .onConflictDoUpdate({
        target: SubscriptionTable.userId,
        set: { validTill },
      });
  } else if (INACTIVE_EVENTS.has(type)) {
    await db
      .delete(SubscriptionTable)
      .where(eq(SubscriptionTable.userId, userId));
  }

  return NextResponse.json({ success: true });
};
