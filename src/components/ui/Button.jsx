import { cn } from '../../utils/classMerge';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth, 
  className, 
  disabled,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium smooth-transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--color-primary-navy)] text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 focus:ring-slate-500',
    secondary: 'bg-[var(--surface-color)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-color)] focus:ring-[var(--ring-color)]',
    danger: 'bg-[var(--color-expense)] text-white hover:bg-rose-600 focus:ring-rose-500',
    ghost: 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
