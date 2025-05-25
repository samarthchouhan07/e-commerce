"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useMediaQuery } from "usehooks-ts";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Subcategory = {
  id:string
  name: string;
  slug: string;
};

type Category = {
  name: string;
  slug: string;
  subcategories: Subcategory[];
};

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();

  const isXL = useMediaQuery("(min-width:1280px)");
  const isLG = useMediaQuery("(min-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  console.log("categories:", categories);
  const getVisibleCount = () => {
    if (!isDesktop) return 0;
    if (isXL) return 8;
    if (isLG) return 6;
    return 4;
  };

  const visibleCategories = showAll
    ? categories
    : categories.slice(0, getVisibleCount());

  return (
    <div className="w-full px-4 mt-2 relative">
      <div className="overflow-x-auto flex flex-nowrap gap-2 max-w-full">
        {visibleCategories.map((cat) =>
          isDesktop ? (
            <HoverCard key={cat.slug} openDelay={100} closeDelay={200}>
              <HoverCardTrigger className="capitalize bg-white px-4 py-2 text-black border rounded hover:bg-gray-100 whitespace-nowrap">
                {cat.name}
              </HoverCardTrigger>
              <HoverCardContent className="w-56 bg-white shadow-lg border rounded z-50">
                <div className="flex flex-col">
                  {cat.subcategories.map((sub) => (
                    <div
                      key={sub.slug}
                      className="text-sm px-3 py-2 rounded hover:bg-muted cursor-pointer text-black"
                      onClick={() =>
                        router.push(`/category/${cat.slug}/${sub.id}`)
                      }
                    >
                      {sub.name}
                    </div>
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <DropdownMenu key={cat.slug}>
              <DropdownMenuTrigger asChild>
                <Button className="capitalize bg-white text-black border hover:bg-gray-100">
                  {cat.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white shadow-lg border rounded z-50">
                {cat.subcategories.map((sub) => (
                  <DropdownMenuItem
                    key={sub.slug}
                    onClick={() =>
                      router.push(`/category/${cat.slug}/${sub.id}`)
                    }
                    className="cursor-pointer"
                  >
                    {sub.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        )}
        {!showAll && categories.length > getVisibleCount() && (
          <Button
            className="text-sm whitespace-nowrap"
            variant={"outline"}
            onClick={() => setShowAll(true)}
          >
            Show All
          </Button>
        )}
      </div>
    </div>
  );
};