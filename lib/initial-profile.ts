import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const InitialProfileSetup = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupProfile = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/initial-profile");
          if (response.ok) {
            const userData = await response.json();
            console.log("User profile:", userData);
            // Redirect to the main app page or dashboard
            router.push("/dashboard");
          } else {
            console.error("Failed to set up initial profile");
          }
        } catch (error) {
          console.error("Error setting up initial profile:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (status === "unauthenticated") {
        router.push("/login");
      }
    };

    setupProfile();
  }, [status, router]);

  if (isLoading) {
    return console.log("Loading...");
  }

  return null;
};

export default InitialProfileSetup;
