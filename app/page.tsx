// import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col justify-center mb-32">
      <Button>
        <Link href={"/overview"}>Go to dashboard</Link>
      </Button>
    </div>
  );
}
