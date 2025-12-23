import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FormStepProps {
  title: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormStep({ title, description, required, children, className }: FormStepProps) {
  return (
    <div className={cn("animate-fade-in space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          {title}
          {required && <span className="text-primary ml-1">*</span>}
        </h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
