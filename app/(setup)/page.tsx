import db from "@/lib/db";
import initialProfile from "@/lib/initial-profile";

const SetupPage = async () => {
  const profile = await initialProfile();
  if (!profile) {
    return <div>Error: Profile not found</div>;
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          id: profile.id,
        },
      },
    },
  });
  return <div>Create a server</div>;
};
export default SetupPage;
