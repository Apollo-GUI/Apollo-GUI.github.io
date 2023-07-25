import { Workflow } from "@/types";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { WORKFLOW_KEY_PREFIX, uuidv4 } from "@/lib/helpers";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export default function WorkflowActions({
  workflow,
  reloadWorkflows,
}: {
  workflow: Workflow;
  reloadWorkflows: () => void;
}) {
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted ml-auto mr-2"
          >
            <Icons.options className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[160px]"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
          }}
          onFocusOutside={(e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
          }}
        >
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem
            onClick={(event) => event.stopPropagation()}
            onSelect={() => {
              const id = WORKFLOW_KEY_PREFIX + uuidv4();
              localStorage.setItem(
                id,
                JSON.stringify({
                  id: id,
                  name: workflow.name + " copy",
                  lastSaved: null,
                  data: workflow.data,
                })
              );
              reloadWorkflows();
            }}
          >
            Make a copy
          </DropdownMenuItem>
          <DropdownMenuItem>Export Apollo Yaml</DropdownMenuItem>
          <DropdownMenuItem>Download Graph</DropdownMenuItem>

          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onClick={(event) => event.stopPropagation()}>
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this workflow?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(event) => event.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              localStorage.removeItem(workflow.id);
              reloadWorkflows();
            }}
            className="bg-red-600 focus:ring-red-600"
          >
            <Icons.trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
