import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface CategoryItemProps {
  category: {
    name: string;
    thumbnail: string;
  };
}

export const CategoryItem = ({ category }: CategoryItemProps) => {
  return (
    <div className="relative cursor-pointer border w-40 h-52 border-orange-400 rounded-lg">
      <Image
        src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}/${category.thumbnail}`}
        alt={category.name}
        fill
        sizes="w-full h-full"
        className="object-cover absolute rounded-lg"
      />
    </div>
  );
};

export const CategoryItemSkeleton = () => {
  return (
    // <div className="relative cursor-pointer border w-40 h-52 rounded-lg">
    <Skeleton className="relative cursor-pointer border w-40 h-52 rounded-lg" />
    // </div>
  );
};
