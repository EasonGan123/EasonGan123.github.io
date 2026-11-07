export default function SectionLabel({ index, label, className = "" }: { index: string; label: string; className?: string }) {
  return (
    <p className={`label-mono flex items-center gap-3 ${className}`}>
      <span className="text-ink">[{index}]</span>
      <span>{label}</span>
      <span aria-hidden className="h-px flex-1 bg-line" />
    </p>
  );
}
