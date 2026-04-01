import { forwardRef } from 'react';
import { cn } from '../../utils/classMerge';

export const Input = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-[var(--border-color)] bg-[var(--surface-color)] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-[var(--text-muted)]',
          error && 'border-[var(--color-expense)] focus:ring-[var(--color-expense)]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[var(--color-expense)]">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
