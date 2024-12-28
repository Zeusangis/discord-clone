import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/currentProfile";
import db from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const server = await db.server.create({
      data: {
        id: uuidv4(),
        name,
        imageUrl,
        inviteCode: uuidv4(),
        user: {
          connect: {
            id: profile.id,
          },
        },
        channels: {
          create: [
            {
              name: "general",
              type: "TEXT",
              userId: profile.id,
            },
          ],
        },
        members: {
          create: {
            userId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });
    return new NextResponse("[SERVERS_POST] Created");
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    console.log("[SERVERS_POST] Done");
  }
}
