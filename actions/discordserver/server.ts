"use server";

import prisma from "@/lib/db";
import { getSession } from "../auth/session";
import { SessionResponseType } from "@/types/sessionType";
import { v4 as uuidv4 } from "uuid";
import { MemberRole, ChannelType } from "@prisma/client";

export const createDiscordServer = async (name: string, imageUrl: string) => {
  console.log("Creating Discord server");
  const session: SessionResponseType = await getSession();

  if (!session) {
    return { success: false, error: "No active session" };
  }

  try {
    const server = await prisma.server.create({
      data: {
        name,
        imageUrl,
        inviteCode: uuidv4(),
        userId: session.id,
        channels: {
          create: [
            {
              name: "general",
              type: ChannelType.TEXT,
              userId: session.id,
            },
          ],
        },
        members: {
          create: [
            {
              userId: session.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
      include: {
        channels: true,
        members: true,
      },
    });

    return {
      success: true,
      server,
    };
  } catch (error) {
    console.error("Error creating Discord server:", error);
    return {
      success: false,
      error: "Failed to create server",
    };
  }
};
