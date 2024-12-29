import { currentProfile } from "@/lib/currentProfile";

const ServerIdPage = async () => {
  const user = await currentProfile();
  console.log(currentProfile());
  return <div>ServerIdPage</div>;
};

export default ServerIdPage;
