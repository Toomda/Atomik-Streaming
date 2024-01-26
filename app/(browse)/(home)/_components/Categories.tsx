import { getCategories } from "@/actions/category";
import { CategoryItem, CategoryItemSkeleton } from "./Category-item";

export const Categories = async () => {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-screen-xl px-6">
      <div className="grid grid-cols-6 overflow-hidden gap-0">
        {categories.map((category: any) => {
          return <CategoryItem category={category} key={category.id} />;
        })}
      </div>
    </div>
  );
};

export const CategoriesSkeleton = () => {
  return (
    <div className="mx-auto max-w-screen-xl px-6">
      {/* <Skeleton className="mx-auto max-w-screen-xl px-6" /> */}
      <div className="grid grid-cols-6 overflow-hidden gap-0">
        {[...Array(6)].map((_, i) => (
          <CategoryItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
