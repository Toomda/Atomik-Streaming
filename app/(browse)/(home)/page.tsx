import { Categories, CategoriesSkeleton } from "./_components/Categories";
import { Following, FollowingSkeleton } from "./_components/following";
import { Recommended, RecommendedSkeleton } from "./_components/recommended";
import { Suspense } from "react";
export default function Home() {
  return (
    <div className="h-full p-8 max-w-full space-y-8 mx-auto flex flex-col justify-between">
      <Suspense fallback={<RecommendedSkeleton />}>
        <Recommended />
      </Suspense>
      <div>
        <Suspense fallback={<CategoriesSkeleton />}>
          <Categories />
        </Suspense>
      </div>
      <Suspense fallback={<FollowingSkeleton />}>
        <Following />
      </Suspense>
    </div>
  );
}
