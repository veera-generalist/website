"use client";

import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";
import { SocialLinks } from "@/components/social-links";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NavItem } from "@/data/navigation";

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="ml-auto rounded-full p-2 hover:bg-white/10 lg:hidden">
        <IconMenu2 size={24} aria-hidden />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent aria-describedby={undefined}>
        <SheetTitle className="font-display text-lg font-bold">Menu</SheetTitle>
        <nav>
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-lg font-medium hover:bg-white/10"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SocialLinks className="mt-auto" />
      </SheetContent>
    </Sheet>
  );
}
