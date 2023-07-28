import { UpdateNodeSectionProps } from './data-in-section'
import { Icons } from './icons'
import InfoButton from './info-button'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu";

export default function ConditionsSection({
    selectedNode,
    updateNode,
  }: UpdateNodeSectionProps) {
  return (
  <><div className="flex items-center mb-2">
        <h1 className="text-lg font-semibold text-foreground mr-1">
          Condition
        </h1>
        <InfoButton infoText="" />
      </div>
      <div className="grid gap-2 grid-cols-[2fr_1fr_2fr_40px]">
        <Input id="condition" type="text" placeholder="value/variable" />
        <Input id="condition" type="text" placeholder="" />
        <Input id="condition" type="text" placeholder="value/variable" />
        <Button variant="secondary" size="icon">
          <Icons.options className="w-4 h-4" />
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mt-2">
            Add condition
            <Icons.down className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Combine with&nbsp;<b>AND</b>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Combine with&nbsp;<b>OR</b>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </>
  )
}
