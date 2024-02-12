import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Hint } from "./hint";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { LoadingVideo } from "./stream-player/loading-video";

interface ImageUploadProps {
  onInput: (file: File | null) => void;
  id: string;
  center: boolean;
  initialPreview: string;
}

const ImageUpload = ({
  onInput,
  id,
  center,
  initialPreview,
}: ImageUploadProps) => {
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>(initialPreview);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [isValid, setIsValid] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    onInput(pickedFile!);
  };

  const pickImageHandler = () => {
    inputRef!.current!.click();
  };

  const onRemoveImage = () => {
    setPreviewUrl("");
    setFile(undefined);

    onInput(null);
  };

  const onImageLoaded = () => {
    setImageLoaded(true);
  };

  return (
    <div className="form-control">
      <input
        id={id}
        type="file"
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
        ref={inputRef}
        onChange={pickedHandler}
      />
      <div className={`image-upload space-y-6 ${center && "center"}`}>
        <div className="image-upload__preview">
          <div className="relative aspect-video rounded-xl overflow-hidden border outline-dashed outline-muted">
            <div className="absolute top-2 right-2 z-[10]">
              <Hint label="Remove image" asChild side="left">
                <Button
                  type="button"
                  onClick={onRemoveImage}
                  className="h-auto w-auto p-1.5"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </Hint>
            </div>
            {previewUrl && (
              <>
                {!imageLoaded && <LoadingVideo label="Loading..." />}
                <Image
                  src={
                    previewUrl.startsWith("uploads")
                      ? `${process.env.NEXT_PUBLIC_RESOURCE_URL}/${previewUrl}`
                      : previewUrl
                  }
                  alt="Image"
                  fill
                  className="object-cover"
                  onLoad={onImageLoaded}
                />
              </>
            )}
          </div>
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Pick Image
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
