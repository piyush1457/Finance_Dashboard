import { cn } from '../../utils/classMerge';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'shimmer rounded-md',
        className
      )}
      {...props}
    />
  );
}
