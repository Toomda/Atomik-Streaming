"use client";

import { ChangeEvent, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { getCategoriesBySearchTerm } from "@/actions/category";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { X } from "lucide-react";
import { Category } from ".";

interface CategorySearchProps {
  onChange: (category: any) => void;
  initialCategory: Category | null;
}

export const CategorySearch = ({
  onChange,
  initialCategory,
}: CategorySearchProps) => {
  const [value, setValue] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<any>(initialCategory);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategoriesBySearchTerm(debouncedValue);
      setCategories(categories);
    };
    if (debouncedValue) {
      fetchCategories();
    } else {
      setCategories([]);
    }
  }, [debouncedValue]);

  const onClearSearch = () => {
    console.log("here");
    setValue("");
    setCategories([]);
  };

  const onSelect = (category: any) => {
    setCategories([]);
    setValue("");
    setSelectedCategory(category);
    onChange(category);
  };

  const onClearCategory = () => {
    setSelectedCategory(null);
    onChange(null);
  };

  return (
    <div className="w-full flex flex-col">
      {selectedCategory ? (
        <div className="rounded-xl border flex relative">
          <Image
            src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}/${selectedCategory.thumbnail}`}
            alt={selectedCategory.name}
            width={60}
            height={52}
            className=""
          />
          <div className="p-2 flex">
            <p>{selectedCategory.name}</p>
            <X
              className="absolute inset-y-2 right-2 cursor-pointer"
              onClick={onClearCategory}
            />
          </div>
        </div>
      ) : (
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onEmptied={onClearSearch}
          placeholder="Search..."
          className="rounded-r-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-9 w-full"
        ></Input>
      )}
      {categories.length !== 0 && (
        <ScrollArea className="h-32 rounded-md border w-full">
          {categories.map((category) => {
            return (
              <div
                key={category.id}
                onClick={() => {
                  onSelect(category);
                }}
              >
                <div className="w-full flex space-x-2 cursor-pointer hover:bg-blue-200 hover:bg-opacity-20">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}/${category.thumbnail}`}
                    alt={category.name}
                    width={60}
                    height={52}
                    className=""
                  />
                  <div className="p-2">
                    <p>{category.name}</p>
                  </div>
                </div>
                <Separator />
              </div>
            );
          })}
        </ScrollArea>
      )}
    </div>
  );
};
