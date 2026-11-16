import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand-green text-white shadow-sm hover:bg-brand-green-dark',
        secondary: 'bg-white text-brand-ink ring-1 ring-brand-line hover:bg-brand-canvas',
        inverse: 'bg-white text-brand-teal hover:bg-brand-canvas',
        link: 'text-brand-teal underline-offset-4 hover:underline',
      },
      size: {
        default: 'min-h-11 px-5 py-2.5',
        sm: 'min-h-9 px-4 py-2 text-xs',
        lg: 'min-h-12 px-6 py-3 text-base',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Component = asChild ? Slot : 'button'
    return (
      <Component
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        type={asChild ? type : type ?? 'button'}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
