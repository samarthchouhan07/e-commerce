"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Settings", href: "/settings" },
];

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleNav = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header className="w-full border-b px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold">E-Commerce</h1>
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="w-64 p-4">
              <UserButton/>
            <nav className="flex flex-col space-y-2 mt-4">
              {navItems.map(({ label, href }) => (
                <Button
                  key={href}
                  variant={"ghost"}
                  className={cn(
                    "justify-start px-3 py-2 rounded-md text-sm font-medium",
                    isActive(href)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {label}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <nav className="hidden md:flex items-center gap-4">
        {navItems.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium",
              isActive(href)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
            onClick={() => handleNav(href)}
          >
            {label}
          </Link>
        ))}
        <UserButton />
      </nav>
    </header>
  );
};
