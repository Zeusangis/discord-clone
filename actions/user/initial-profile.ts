import db from "@/lib/db";
import { getSession } from "../auth/session";
import { SessionResponseType } from "@/types/sessionType";
import { redirect } from "next/navigation";

export const initialProfile = async () => {
  const session: SessionResponseType = await getSession();

  if (!session) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    return redirect("/login");
  }
  return user;
};
