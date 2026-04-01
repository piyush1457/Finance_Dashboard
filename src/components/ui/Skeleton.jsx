import { cn } from '../../utils/classMerge';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-[var(--border-color)] opacity-60',
        className
      )}
      {...props}
    />
  );
}
