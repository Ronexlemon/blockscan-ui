import { copy } from "../utils/copy";

function Row({
  label,
  value,
  color = "text-zinc-300",
  copyValue,
  title,
}: {
  label: string;
  value: string;
  color?: string;
  copyValue?: string;
  title?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-zinc-600 w-20 shrink-0">{label}</span>
      <span
        className={`${color} text-right truncate max-w-[210px] ${copyValue ? "cursor-pointer hover:brightness-125 transition" : ""}`}
        title={title || copyValue || value}
        onClick={() => copyValue && copy(copyValue)}
      >
        {value}
      </span>
    </div>
  );
}
export {Row}