"use client";

import {
  useState,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
  CompositionEvent,
} from "react";
import RegistrationController from "./RegistrationController";
import ImageForm from "../InputField/ImageForm";
import InputField from "@/components/InputField/InputField";
import TextareaField from "@/components/InputField/TextareaField";
import ItemTag from "@/components/Products/ItemTag";
import { ProductFormProps } from "@/types/entities";

const ProductForm = ({
  initialData = {},
  onSubmit,
  mode = "create",
}: ProductFormProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isComposing, setIsComposing] = useState<boolean>(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setImages(initialData.images || []);
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setPrice(initialData.price || "");
      setTags(initialData.tags || []);
    }
  }, [mode, initialData]);

  const isFormValid =
    title.trim() !== "" &&
    description.trim() !== "" &&
    price.trim() !== "" &&
    !isNaN(Number(price));

  // 가격 입력 검증
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (isComposing) return;

    if (value === "") {
      setPrice("");
      return;
    }

    if (!/^\d+$/.test(value)) return;

    setPrice(value);
  };

  // IME (한글 입력) 처리
  const handleCompositionStart = (_e: CompositionEvent<HTMLInputElement>) => {
    setIsComposing(true);
  };
  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    const finalValue = e.currentTarget.value;
    if (/^\d+$/.test(finalValue)) setPrice(finalValue);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    await onSubmit({ title, description, price: Number(price), tags, images });
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const value = tagInput.trim();

      if (!value) return;
      if (value.length > 10) return;
      if (tags.length >= 5) return;
      if (tags.includes(value)) return;

      setTags([...tags, value]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <section>
      <RegistrationController
        onClick={handleSubmit}
        mode={mode}
        disabled={!isFormValid}
      />

      <div className="flex flex-col items-start gap-6 mx-6">
        <ImageForm />

        <InputField
          title="상품명"
          type="text"
          id="title"
          placeholder="상품명을 입력해주세요."
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />

        <TextareaField
          title="상품 소개"
          id="description"
          placeholder="상품 소개를 입력해주세요."
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
        />

        <InputField
          title="판매가격"
          type="number"
          id="price"
          placeholder="판매가격을 입력해주세요."
          value={price}
          onChange={handlePriceChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />

        <form className="flex flex-col items-start gap-4 w-full mb-8">
          <label className="text-lg font-semibold text-gray-800">태그</label>
          <input
            type="text"
            placeholder="태그를 입력해주세요."
            value={tagInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTagInput(e.target.value)
            }
            onKeyDown={handleTagKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            maxLength={5}
            className="w-full h-14 rounded-xl bg-gray-100 px-6 placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          {/* <span className="hidden text-red-500 text-sm font-semibold mt-2">
            5글자 이내로 입력해주세요.
          </span> */}
          <ItemTag tags={tags} removable onRemove={handleRemoveTag} />
        </form>
      </div>
    </section>
  );
};

export default ProductForm;
