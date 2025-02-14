"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useCachebust } from "@/store/use-cachebust";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CategoryItemProps {
  category: {
    id: string;
    name: string;
    thumbnail: string;
  };
}

export const CategoryItem = ({ category }: CategoryItemProps) => {
  const { categoryCachebust } = useCachebust();
  const [imageSrc, setImageSrc] = useState(
    `${process.env.NEXT_PUBLIC_AWS_BASE_IMAGE_URL}/CategoryThumbnails/${category.id}`
  );

  useEffect(() => {
    setImageSrc(
      `${process.env.NEXT_PUBLIC_AWS_BASE_IMAGE_URL}/CategoryThumbnails/${category.id}?${categoryCachebust}`
    );
  }, [categoryCachebust, category]);

  return imageSrc ? (
    <div className="relative cursor-pointer border w-40 h-52 border-orange-400 rounded-lg">
      <Image
        src={imageSrc}
        alt={category.name}
        fill
        sizes="w-full h-full"
        className="object-cover absolute rounded-lg"
      />
    </div>
  ) : (
    <CategoryItemSkeleton />
  );
};

export const CategoryItemSkeleton = () => {
  return (
    // <div className="relative cursor-pointer border w-40 h-52 rounded-lg">
    <Skeleton className="relative cursor-pointer border w-40 h-52 rounded-lg" />
    // </div>
  );
};
