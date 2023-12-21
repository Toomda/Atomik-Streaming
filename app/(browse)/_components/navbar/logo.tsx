import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center gap-x-4 hover:opacity-75 transition group">
        <div className="bg-white rounded-full p-1 mr-12 shrink-0 lg:mr-0 lg:shrink">
          <Image
            src="/rocket.svg"
            alt="Atomik"
            height="32"
            width="32"
            className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform"
          />
        </div>
        <div className={cn("hidden lg:block", font.className)}>
          <p className="text-lg font-semibold">Atomik</p>
          <p className="text-xs text-muted-foreground">Gaming Streams</p>
        </div>
      </div>
    </Link>
  );
};
