"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { IconChevronDown } from "@tabler/icons-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn("relative z-10 flex items-center", className)}
    {...props}
  >
    {children}
    {/* 3D tilt-in like SafetyWing's menu: rotateX inside a perspective wrapper. */}
    <div className="absolute left-0 top-full flex justify-center [perspective:2000px]">
      <NavigationMenuPrimitive.Viewport className="relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-2xl bg-white text-ink shadow-xl transition-[width,height] duration-300 data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in motion-reduce:animate-none md:w-[var(--radix-navigation-menu-viewport-width)]" />
    </div>
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = "NavigationMenu";

export const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("flex list-none items-center gap-1", className)}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenuList";

export const NavigationMenuItem = NavigationMenuPrimitive.Item;
export const NavigationMenuLink = NavigationMenuPrimitive.Link;

export const navLinkClass =
  "inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-opacity hover:opacity-80 data-[active]:underline data-[active]:underline-offset-8";

export const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navLinkClass, "group gap-1", className)}
    {...props}
  >
    {children}
    <IconChevronDown
      size={16}
      aria-hidden
      className="relative top-[1px] transition-transform duration-200 ease-in group-data-[state=open]:-rotate-180"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

export const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
      className,
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = "NavigationMenuContent";
