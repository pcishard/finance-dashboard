import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const accounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(accounts);
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, category, balance, currency, notes } = await req.json();

    if (!name || !category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }

    const account = await prisma.account.create({
      data: {
        name,
        category,
        balance: balance || 0,
        currency: currency || "GBP",
        notes,
        userId,
      },
    });

    await prisma.balanceHistory.create({
      data: { balance: account.balance, accountId: account.id },
    });

    return NextResponse.json(account, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
