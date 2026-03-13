import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  return new NextResponse("Script executed successfully", { status: 200 });
};
