import { currentProfile } from "@/lib/currentProfile";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import db from "@/lib/db";

export async function PATCH({ params }: { params: { serverId: string } }) {
  try {
    const user = await currentProfile();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Server Id missing.", { status: 404 });
    }
    const server = await db.server.update({
      where: { id: params.serverId, userId: user.id },
      data: {
        inviteCode: uuidv4(),
      },
    });
  } catch (error) {
    console.error(error);
  }
}
