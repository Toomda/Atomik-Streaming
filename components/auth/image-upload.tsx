import React, { useRef, useState, useEffect } from 'react';

interface ImageUploadProps {
  onInput: (file: File) => void;
  id: string;
  center: boolean;
  errorText: string;
}

const ImageUpload = (props: ImageUploadProps) => {
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
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

    props.onInput(pickedFile!);
  };

  const pickImageHandler = () => {
    inputRef!.current!.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        type="file"
        style={{ display: 'none' }}
        accept=".jpg,.png,.jpeg"
        ref={inputRef}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an Image</p>}
        </div>
        <button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
