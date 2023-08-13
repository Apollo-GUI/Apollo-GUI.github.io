import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Icons } from "./icons";

export default function InfoButton({ infoText }: { infoText: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
          <Icons.info className="w-4 h-4 text-slate-400" />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="text-sm text-slate-800 font-semibold">{infoText}</div>
      </PopoverContent>
    </Popover>
  );
}
