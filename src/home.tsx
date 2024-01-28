import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WorkflowActions from "@/components/workflow-actions";
import { WORKFLOW_KEY_PREFIX, getDateTimeString, uuidv4 } from "@/lib/helpers";

import logo from "./apollo_logo.png";
import { Workflow } from "./types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Separator } from "./components/ui/separator";

const exapmleWorkflows = import.meta.glob("../example-wfs/demos/*.json", {
  eager: true,
});
const complexWorkflows = import.meta.glob("../example-wfs/complex/*.json", {
  eager: true,
});

interface HomeProps {
  selectWorkflow: (workflow: Workflow) => void;
}

export default function Home({ selectWorkflow }: HomeProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const uploadButtonRef = useRef<HTMLInputElement>(null);
  const reloadWorkflows = useCallback(() => {
    const w = [];
    const savedWorkflowCount = localStorage.length;
    for (let index = 0; index < savedWorkflowCount; index++) {
      const key = localStorage.key(index);
      if (key?.startsWith(WORKFLOW_KEY_PREFIX))
        w.push(JSON.parse(localStorage.getItem(key) ?? ""));
    }
    setWorkflows(w);
  }, []);

  useEffect(() => {
    reloadWorkflows();
  }, [reloadWorkflows]);

  const addWorkflow = () =>
    selectWorkflow({
      id: WORKFLOW_KEY_PREFIX + uuidv4(),
      name: "new workflow",
      lastSaved: null,
      data: null,
    });

  return (
    <div className="flex">
      <aside className="flex flex-col gap-4 w-[80px] min-w-[80px] min-h-screen text-center bg-slate-900">
        <Icons.logo className="h-12 w-12 mx-auto mt-10 text-amber-400" />
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                className="mb-4 mt-6 mx-auto"
                onClick={addWorkflow}
              >
                <Icons.add className="h-12 w-12" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add new workflow</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size={"icon"} className="mx-auto" disabled>
                <Icons.import className="h-12 w-12" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Import a workflow</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </aside>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Apollo Worflow Editor
            </h2>
            <p className="text-muted-foreground">
              Graphical editor to visualize and create workflows for the Apollo
              orchestration system.
            </p>
          </div>
        </div>
        <Alert variant="destructive">
          <Icons.terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            This project is still in active development and may still have
            issues. If you find anything please open an issue in the{" "}
            <a
              href="https://github.com/Apollo-GUI/Apollo-GUI.github.io"
              target="_blank"
              className="font-bold"
            >
              Github repository
            </a>
            .
          </AlertDescription>
        </Alert>
        <div className="grid gap-4 grid-cols-3 items-start">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="mr-4">
                Application Orchestration and Runtime Framework
              </CardTitle>
              <img src={logo} className="max-w-[200px]" />
            </CardHeader>
            <CardContent>
              <p className="my-4">
                The Apollo project crafts a novel environment based on new
                innovative tools, services, and algorithms to make the
                development, optimization and execution of applications from
                science, business and industry on edge-cloud environments an
                everyday practice.
              </p>
              <p className="my-4">
                Developed by the Distributed and Parallel Computing Grout from
                the University of Innsbruck.
              </p>
              <div className="flex space-x-2">
                <Button asChild size={"lg"}>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://apollowf.github.io/index.html"
                  >
                    Learn more
                  </a>
                </Button>
                <Button variant={"outline"} asChild size={"lg"}>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://github.com/Apollo-Core"
                  >
                    <Icons.github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Saved Workflows</CardTitle>
              <div className="space-x-2">
                <Button variant="outline" onClick={addWorkflow}>
                  <Icons.add className="mr-2 h-4 w-4" />
                  New workflow
                </Button>
                <input
                  type="file"
                  ref={uploadButtonRef}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const workflow = JSON.parse(
                          e.target?.result as string,
                        ) as Workflow;
                        workflow.id = WORKFLOW_KEY_PREFIX + uuidv4();
                        workflow.lastSaved = null;
                        localStorage.setItem(
                          workflow.id,
                          JSON.stringify(workflow),
                        );
                        reloadWorkflows();
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    uploadButtonRef.current?.click();
                  }}
                >
                  <Icons.import className="mr-2 h-4 w-4" />
                  Import graph
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workflow name</TableHead>
                      <TableHead className="w-[200px]">Last edited</TableHead>
                      <TableHead className="text-right">Options</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workflows.length ? (
                      workflows.map((workflow, idx) => (
                        <TableRow
                          key={idx}
                          onClick={() => selectWorkflow(workflow)}
                          className="cursor-pointer"
                        >
                          <TableCell className="font-medium">
                            {workflow.name}
                          </TableCell>
                          <TableCell>
                            {workflow.lastSaved
                              ? getDateTimeString(workflow.lastSaved)
                              : "-"}
                          </TableCell>
                          <TableCell className="w-[200px] text-right">
                            <WorkflowActions
                              workflow={workflow}
                              reloadWorkflows={reloadWorkflows}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="hover:bg-white">
                        <TableCell
                          className="h-[250px] items-center"
                          colSpan={3}
                        >
                          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                            <Icons.info className="h-10 w-10 text-muted-foreground" />

                            <h3 className="mt-4 text-lg font-semibold">
                              No saved workflows
                            </h3>
                            <p className="mb-4 mt-2 text-sm text-muted-foreground">
                              You have no workflows saved on this computer. Add
                              one below. (Workflows are only saved in the
                              browser and are not synched across devices)
                            </p>

                            <Button onClick={addWorkflow}>
                              <Icons.add className="mr-2 h-4 w-4" />
                              New workflow
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <h1 className="text-2xl font-bold pt-6 pb-2">
                Example Workflows
              </h1>
              <h6 className="text-slate-600 pb-2">Simple Demos</h6>
              <div className="flex gap-2 flex-wrap">
                {Object.values(exapmleWorkflows)
                  .map((workflow: any, idx) => (
                    <Button
                      key={idx}
                      variant={"outline"}
                      onClick={() => selectWorkflow(workflow)}
                    >
                      {workflow.name}
                    </Button>
                  ))}
              </div>
              <Separator className="mt-4 mb-2"/>
              <h6 className="text-slate-600">Examples from<Button variant={"link"} className="pl-2" asChild><a href="https://github.com/Apollo-Workflows" target="_blank">Apollo-Workflows</a></Button></h6>
              <div className="flex gap-2 flex-wrap">
                {Object.values(complexWorkflows)
                  .map((workflow: any, idx) => (
                    <Button
                      key={idx}
                      variant={"outline"}
                      onClick={() => selectWorkflow(workflow)}
                    >
                      {workflow.name}
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
