import { cn } from "@/lib/utils";

export default function BrandMark({ compact = false, className }) {
  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="/brand/logo.svg"
        alt="BrotherPlast gestión industrial"
        className={cn("object-contain object-left", compact ? "h-9 w-[168px]" : "h-12 w-[240px]")}
      />
    </div>
  );
}
