"use client";

import qs from "query-string";
import { useEffect, useState } from "react";
import { SearchIcon, X } from "lucide-react";
import { redirect, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export const Search = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const user = useSession();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value) {
      router.push("/");
      return;
    }

    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: { term: value },
      },
      { skipEmptyString: true }
    );

    router.push(url);
  };

  const onClear = () => {
    setValue("");
    router.push("/");
  };

  const onClick = () => {
    console.log(user);
  };

  return (
    <form
      className="relative w-full lg:w-[400px] flex items-center"
      onSubmit={onSubmit}
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        className="rounded-r-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
      ></Input>
      {value && (
        <X
          className="absolute top-2.5 right-14 h-5 w-5 text-muted-foreground cursour-pointer hover:opacity-75 transition"
          onClick={onClear}
        />
      )}
      <Button
        type="submit"
        size="sm"
        variant="secondary"
        className="rounded-l-none"
      >
        <SearchIcon className="h-5 w-5 text-muted-foreground" />
      </Button>
      <Button onClick={onClick}>Button</Button>
    </form>
  );
};
