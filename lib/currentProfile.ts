import { getSession } from "@/actions/auth/session";
import db from "@/lib/db";

export const currentProfile = async () => {
  const { userId } = await getSession();

  if (!userId) {
    return null;
  }
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
};
