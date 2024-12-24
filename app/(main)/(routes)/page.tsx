import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <UserButton />
      <p>This is a protected route.</p>
    </div>
  );
}
