"use client";

import { useState, useTransition, useRef, ElementRef } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateStream } from "@/actions/stream";
import { toast } from "sonner";
// import { UploadDropzone } from '@/lib/upload-service';
import { Hint } from "@/components/hint";
import { Trash } from "lucide-react";
import Image from "next/image";
import ImageUpload from "../image-upload";
import { uploadThumbnailByStreamId } from "@/lib/upload-service";
import { CategorySearch } from "./category-search";
import { Category } from ".";

interface InfoModalProps {
  initialName: string;
  initialThumbnail: string | null;
  initialCategory: Category | null;
}

export const InfoModal = ({
  initialName,
  initialThumbnail,
  initialCategory,
}: InfoModalProps) => {
  const [name, setName] = useState(initialName);
  const [file, setFile] = useState<File | null>();
  const [category, setCategory] = useState<any>(null);

  const [isPending, startTransition] = useTransition();
  const closeRef = useRef<ElementRef<"button">>(null);
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      updateStream({ name: name, categoryId: category ? category.id : null })
        .then((stream) => {
          if (file) uploadThumbnailByStreamId(file, stream.id);
          toast.success("Stream updated successfully");
          closeRef?.current?.click();
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const inputHandler = (file: File | null) => {
    setFile(file);
  };

  const onChangeCategory = (category: any) => {
    setCategory(category);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="ml-auto">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit stream info</DialogTitle>
        </DialogHeader>
        <form className="space-y-14" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Stream name"
              onChange={onChange}
              value={name}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <ImageUpload
              center
              id="Image"
              initialPreview={initialThumbnail || ""}
              onInput={inputHandler}
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <CategorySearch
              onChange={onChangeCategory}
              initialCategory={initialCategory}
            />
          </div>
          <div className="flex justify-between">
            <DialogClose asChild ref={closeRef}>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="primary" type="submit" disabled={isPending}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
