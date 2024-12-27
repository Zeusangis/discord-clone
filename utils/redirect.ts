import { useRouter } from "next/navigation";

export const redirect = (path: string) => {
  const router = useRouter();
  router.push(path);
};
