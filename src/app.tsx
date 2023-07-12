import Editor from "@/components/editor";
import NavRail from "@/components/nav-rail";
import "reactflow/dist/base.css";
import { ReactFlowProvider } from "reactflow";
import Home from "./home";
import { useEffect, useState } from "react";
import { Workflow } from "./types";
import { WORKFLOW_KEY_PREFIX } from "@/lib/helpers";

function App() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null,
  );
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.startsWith("/" + WORKFLOW_KEY_PREFIX)) {
      const wf = localStorage.getItem(pathname.substring(1));
      if (wf) setSelectedWorkflow(JSON.parse(wf));
    }
  }, []);

  const selectWorkflow = (workflow: Workflow | null) => {
    history.pushState({}, "", "/" + (workflow?.id ?? ""));
    setSelectedWorkflow(workflow);
  };

  return selectedWorkflow ? (
    <ReactFlowProvider>
      <div className="mx-auto flex">
        <NavRail
          selectedWorkflow={selectedWorkflow}
          setSelectedWorkflow={selectWorkflow}
        />
        <main className="min-h-screen w-full flex">
          <Editor
            selectedWorkflow={selectedWorkflow}
            setSelectedWorkflow={selectWorkflow}
          />
        </main>
      </div>
    </ReactFlowProvider>
  ) : (
    <Home selectWorkflow={selectWorkflow} />
  );
}

export default App;
