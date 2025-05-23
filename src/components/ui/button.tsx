import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90 hover:translate-y-[-1px] active:translate-y-[0px]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:shadow-md hover:bg-destructive/90 hover:translate-y-[-1px] active:translate-y-[0px]",
        outline:
          "border border-input bg-background shadow-sm hover:shadow hover:bg-accent/20 hover:text-accent-foreground hover:border-accent/50 hover:translate-y-[-1px] active:translate-y-[0px]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:shadow-md hover:bg-secondary/90 hover:translate-y-[-1px] active:translate-y-[0px]",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-accent text-accent-foreground shadow-sm hover:shadow-md hover:bg-accent/90 hover:translate-y-[-1px] active:translate-y-[0px]",
        success: "bg-[hsl(var(--success))] text-white shadow-sm hover:shadow-md hover:bg-[hsl(var(--success))]/90 hover:translate-y-[-1px] active:translate-y-[0px]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
