import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

type ButtonVariant = "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
type ButtonSize = "default" | "sm" | "lg" | null | undefined;

function AddToCartButton({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children = "Shop now",
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size }),
        "relative overflow-hidden transition-all duration-300 group font-bold rounded-xl shadow-[0_2px_0_2px_black]",
        className
      )}
      {...props}
    >
      <span className="absolute w-[100px] h-[120%] bg-orange-500 top-1/2 -translate-y-1/2 -translate-x-[150%] skew-x-[30deg] transition-all duration-500 group-hover:translate-x-[150%]" />
      <span className="relative z-10">{children}</span>
    </Comp>
  )
}

export default AddToCartButton;
