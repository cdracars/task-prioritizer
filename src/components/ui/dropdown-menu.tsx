import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
  HTMLAttributes,
  ButtonHTMLAttributes,
  ElementRef,
} from 'react';
import { cn } from '../../lib/utils';

// Define context type
interface DropdownMenuContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(
  undefined
);

// Props for DropdownMenu
interface DropdownMenuProps {
  children: ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative">
        {' '}
        {/* Added relative positioning wrapper */}
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

// Custom hook to use the context
const useDropdownMenuContext = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      'useDropdownMenuContext must be used within a DropdownMenu'
    );
  }
  return context;
};

// Props for DropdownMenuTrigger
interface DropdownMenuTriggerProps {
  children: React.ReactElement; // Expect a single React element child
  asChild?: boolean; // Keep asChild for flexibility if needed, though cloneElement is used
}

export function DropdownMenuTrigger({
  children,
  asChild,
  ...props
}: DropdownMenuTriggerProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useDropdownMenuContext();

  // Ensure children is a single valid React element
  const child = React.Children.only(children);

  // Type assertion to inform TypeScript about the expected props
  const childElement = child as React.ReactElement<{
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }>;

  return React.cloneElement(childElement, {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setOpen(!open);
      // Safely call the original onClick if it exists
      childElement.props.onClick?.(e);
    },
    // Add accessibility attributes
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    ...props, // Spread remaining props onto the child
  });
}

// Props for DropdownMenuContent
interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
}

export const DropdownMenuContent = React.forwardRef<
  ElementRef<'div'>,
  DropdownMenuContentProps
>(({ children, className, align = 'center', ...props }, forwardedRef) => {
  const { open, setOpen } = useDropdownMenuContext();
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = forwardedRef || internalRef; // Use forwardedRef if provided

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click target is outside the content div
      if (
        ref &&
        typeof ref === 'object' &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        // Also check if the click target is the trigger (or inside the trigger)
        // This prevents closing when clicking the trigger again
        const triggerElement = ref.current
          .closest('.relative')
          ?.querySelector('[aria-haspopup="menu"]');
        if (!triggerElement || !triggerElement.contains(event.target as Node)) {
          setOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen, ref]);

  if (!open) return null;

  let alignmentClasses = 'origin-top';
  if (align === 'end') {
    alignmentClasses = 'origin-top-right right-0';
  } else if (align === 'start') {
    alignmentClasses = 'origin-top-left left-0';
  } else {
    // center (default)
    // Basic center alignment, might need adjustment based on trigger width
    alignmentClasses = 'origin-top left-1/2 -translate-x-1/2';
  }

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 min-w-[8rem] mt-2 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95', // Added animation classes
        alignmentClasses,
        className
      )}
      // Add accessibility attributes
      role="menu"
      aria-orientation="vertical"
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuContent.displayName = 'DropdownMenuContent';

// Props for DropdownMenuItem
interface DropdownMenuItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  // No additional props needed for now
}

export const DropdownMenuItem = React.forwardRef<
  ElementRef<'button'>,
  DropdownMenuItemProps
>(({ children, className, onClick, ...props }, ref) => {
  const { setOpen } = useDropdownMenuContext();

  return (
    <button
      ref={ref}
      role="menuitem" // Add role
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e); // Call original onClick if provided
        if (!e.defaultPrevented) {
          // Allow preventing close if needed
          setOpen(false);
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuItem.displayName = 'DropdownMenuItem';
