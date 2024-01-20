import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import InfoButton from "./info-button";
import { Separator } from "./ui/separator";
import { Constraint, Property } from "@/types";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";

interface PropertiesConstraintsDialogProps {
  fullWidth?: boolean;
  properties?: Property[];
  constraints?: Constraint[];
  onChange?: (properties?: Property[], constraints?: Constraint[]) => void;
}

export default function PropteriesConstraintsDialog({
  fullWidth,
  properties,
  constraints,
  onChange,
}: PropertiesConstraintsDialogProps) {
  const hasProperties = (properties?.length ?? 0) > 0;
  const hasConstraints = (constraints?.length ?? 0) > 0;
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant={fullWidth ? "outline" : "ghost"}
                size="icon"
                className={cn(
                  "w-8 p-0 text-slate-500",
                  (hasProperties || hasConstraints) &&
                    "hover:bg-sky-300 bg-sky-200 text-slate-700",
                  fullWidth && "w-full",
                )}
              >
                <Icons.properties className="w-4 h-4" />
                {fullWidth && (
                  <p className="ml-2">Properties and Constraints</p>
                )}
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Modify Properties and Constraints</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="max-w-2xl gap-1">
        <DialogHeader>
          <DialogTitle>Properties and Constraints</DialogTitle>
          <DialogDescription>
            Properties and constraints are optional attributes, which provide
            additional information.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center pt-2">
          <h1 className="text-lg font-semibold text-foreground mr-1">
            Properties
          </h1>
          <InfoButton
            infoText="Properties can be used to describe hints
            about the behavior."
          />
        </div>
        {hasProperties && (
          <div className="grid grid-cols-[1fr_1fr_30px] gap-2">
            <Label>Name</Label>
            <Label>Value</Label>
            <div />
            {properties?.map((property: Property, idx: number) => (
              <>
                <Input
                  key={"name" + idx}
                  id="name"
                  type="text"
                  placeholder="name"
                  value={property.name}
                  onChange={(e) => {
                    properties[idx].name = e.target.value;
                    onChange?.(properties, constraints);
                  }}
                />
                <Input
                  key={"value" + idx}
                  id="value"
                  type="text"
                  placeholder="value"
                  value={property.value}
                  onChange={(e) => {
                    properties[idx].value = e.target.value;
                    onChange?.(properties, constraints);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  key={"del" + idx}
                  onClick={() => {
                    onChange?.(
                      properties.filter(
                        (_: Property, index: number) => index !== idx,
                      ),
                      constraints,
                    );
                  }}
                >
                  <Icons.remove
                    className="w-5 text-destructive"
                    strokeWidth={2}
                  />
                </Button>
              </>
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => {
            onChange?.(
              [...(properties ?? []), { name: "", value: "" }],
              constraints,
            );
          }}
        >
          <Icons.add className="w-4 h-4 mr-2" /> Add Property
        </Button>

        <Separator className="my-2" />

        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-foreground mr-1">
            Constraints
          </h1>
          <InfoButton
            infoText="Constraints should be fulfilled by the
            runtime system on a best-effort basis."
          />
        </div>
        {hasConstraints && (
          <div className="grid grid-cols-[1fr_1fr_30px] gap-2">
            <Label>Name</Label>
            <Label>Value</Label>
            <div />
            {constraints?.map((constraint: Constraint, idx: number) => (
              <>
                <Input
                  key={"name" + idx}
                  id="name"
                  type="text"
                  placeholder="name"
                  value={constraint.name}
                  onChange={(e) => {
                    constraints[idx].name = e.target.value;
                    onChange?.(properties, constraints);
                  }}
                />
                <Input
                  key={"value" + idx}
                  id="value"
                  type="text"
                  placeholder="value"
                  value={constraint.value}
                  onChange={(e) => {
                    constraints[idx].value = e.target.value;
                    onChange?.(properties, constraints);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  key={"del" + idx}
                  onClick={() => {
                    onChange?.(
                      properties,
                      constraints.filter(
                        (_: Constraint, index: number) => index !== idx,
                      ),
                    );
                  }}
                >
                  <Icons.remove
                    className="w-5 text-destructive"
                    strokeWidth={2}
                  />
                </Button>
              </>
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => {
            onChange?.(properties, [
              ...(constraints ?? []),
              { name: "", value: "" },
            ]);
          }}
        >
          <Icons.add className="w-4 h-4 mr-2" /> Add Constraint
        </Button>
        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
