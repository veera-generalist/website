import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const button = tv({
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      primary: "bg-sun text-ink hover:bg-sun-dark",
      dark: "bg-ink text-white hover:bg-ink-light",
      outline: "border border-current bg-transparent hover:bg-white/10",
      ghost: "bg-transparent hover:bg-ink/5",
    },
    size: {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-sm",
      lg: "h-12 px-7 text-base",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & { asChild?: boolean };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={button({ variant, size, className })} {...props} />;
  },
);
Button.displayName = "Button";
