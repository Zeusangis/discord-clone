import { getSession } from "@/actions/auth/session";
import db from "@/lib/db";

export const currentProfile = async () => {
  try {
    const session = await getSession();
    const user = await db.user.findUnique({
      where: {
        id: session?.id,
      },
    });

    return user;
  } catch (error) {
    console.error("Error in currentProfile:", error);
    return null;
  }
};
