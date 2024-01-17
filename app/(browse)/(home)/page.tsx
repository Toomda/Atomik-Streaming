import { Categories } from "./_components/Categories";
import { Following, FollowingSkeleton } from "./_components/following";
import { Recommended, RecommndedSkeleton } from "./_components/recommended";
import { Suspense } from "react";
export default function Home() {
  return (
    <div className="h-full p-8 max-w-full space-y-8 mx-auto flex flex-col justify-between">
      <Suspense fallback={<RecommndedSkeleton />}>
        <Recommended />
      </Suspense>
      <div>
        <p className="pb-2 font-bold" style={{ fontSize: "x-large" }}>
          Categories
        </p>
        <Categories />
      </div>
      <Suspense fallback={<FollowingSkeleton />}>
        <Following />
      </Suspense>
    </div>
  );
}
