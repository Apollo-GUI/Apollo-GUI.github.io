import Editor from "../components/editor";
import NavRail from "../components/nav-rail";
import "reactflow/dist/base.css";
import { ReactFlowProvider } from "reactflow";
function App() {
  return (
    <ReactFlowProvider>
      <div className="mx-auto flex">
        <NavRail />
        <main className="min-h-screen w-full flex">
          <Editor />
        </main>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
