import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive  cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus-visible:ring-indigo-500 dark:border-indigo-700/50 dark:bg-indigo-500/10 dark:text-indigo-300",
        destructive:
          "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 focus-visible:ring-rose-500 dark:border-rose-700/50 dark:bg-rose-500/10 dark:text-rose-300",
        outline:
          "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",

        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",

        responsive:
          "h-9 px-4 py-2 has-[>svg]:px-3 " +
          "md:h-10 md:px-5 md:py-2.5 md:has-[>svg]:px-4 " +
          "lg:h-10 lg:px-6 lg:py-3",
      },

      /* fluid: {
        true: "w-full sm:w-auto",
      }, */
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  /* fluid, */
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, /* fluid, */ className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
