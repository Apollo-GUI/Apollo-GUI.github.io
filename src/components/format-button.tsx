import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function FormatButton() {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size={"icon"} className="mb-4" disabled>
            <Icons.format className="h-8 w-8" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Format graph</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
