import Editor from "../components/editor";
import NavRail from "../components/nav-rail";
import "reactflow/dist/base.css";
import { ReactFlowProvider } from "reactflow";
import Home from "./home";
import { useState } from "react";
import { Workflow } from "./types";
import { WORKFLOW_KEY_PREFIX } from "../lib/utils";

function App() {
  let workflow = null;
  const pathname = window.location.pathname;
  if (pathname.startsWith("/" + WORKFLOW_KEY_PREFIX)) {
    const wf = localStorage.getItem(pathname.substring(1));
    if (wf) workflow = JSON.parse(wf);
  }

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    workflow
  );

  return selectedWorkflow ? (
    <ReactFlowProvider>
      <div className="mx-auto flex">
        <NavRail selectedWorkflow={selectedWorkflow} />
        <main className="min-h-screen w-full flex">
          <Editor selectedWorkflow={selectedWorkflow} />
        </main>
      </div>
    </ReactFlowProvider>
  ) : (
    <Home
      selectWorkflow={(workflow) => {
        history.pushState({}, "", "/" + workflow.id);
        setSelectedWorkflow(workflow);
      }}
    />
  );
}

export default App;
