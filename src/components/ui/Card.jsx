import { cn } from '../../utils/classMerge';

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'bg-[var(--surface-color)] rounded-xl border border-[var(--border-color)] shadow-sm overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
