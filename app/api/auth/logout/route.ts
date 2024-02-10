import { signOut } from "@/next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  await signOut();
}
