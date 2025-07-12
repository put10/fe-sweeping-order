import { cn } from "@/lib/utils";

export default function ContainerLayout({ className = "", children }) {
  return (
    <div className={cn(`space-y-6 container mx-auto mt-6 ${className}`)}>
      {children}
    </div>
  );
}
