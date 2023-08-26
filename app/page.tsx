import { SignIn } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <button>
        <SignIn />
      </button>
    </>
  );
}
