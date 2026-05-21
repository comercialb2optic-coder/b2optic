import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
} from 'react';

interface StaggerGroupProps {
  children: ReactNode;
  stagger?: number;
  baseDelay?: number;
  className?: string;
}

type StaggerableProps = { delay?: number };

export default function StaggerGroup({
  children,
  stagger = 0.08,
  baseDelay = 0,
  className,
}: StaggerGroupProps) {
  return (
    <div className={className}>
      {Children.map(children, (child, i) => {
        if (!isValidElement<StaggerableProps>(child)) return child;
        const existing = child.props.delay ?? 0;
        return cloneElement(child, {
          delay: existing + baseDelay + i * stagger,
        });
      })}
    </div>
  );
}
