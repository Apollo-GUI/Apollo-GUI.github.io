import { ApolloNodeType } from "../src/types";
import DraggableElement from "./draggable-element";
import { EditorProps } from "./editor";
import FormatButton from "./format-button";
import { Icons } from "./icons";
import SaveButton from "./save-button";
import SettingsMenu from "./settings-menu";

export default function NavRail({
  selectedWorkflow,
  setSelectedWorkflow,
}: EditorProps) {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: ApolloNodeType
  ) => {
    event.dataTransfer?.setData("application/reactflow", nodeType);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  };
  return (
    <aside className="flex flex-col justify-between items-center w-[80px] min-w-[80px] min-h-screen text-center bg-slate-900">
      <nav className="grid gap-4  text-white">
        <Icons.logo
          className="h-12 w-12 mx-auto mt-10 mb-5 text-amber-400 cursor-pointer"
          onClick={() => setSelectedWorkflow(null)}
        />
        <DraggableElement node="function" onNodeDrag={onDragStart} />
        <DraggableElement node="parallel" onNodeDrag={onDragStart} />
        <DraggableElement node="if" onNodeDrag={onDragStart} />
        <DraggableElement node="while" onNodeDrag={onDragStart} />
        <DraggableElement node="end" onNodeDrag={onDragStart} />
      </nav>
      <div className="flex flex-col">
        <FormatButton />
        <SaveButton
          selectedWorkflow={selectedWorkflow}
          setSelectedWorkflow={setSelectedWorkflow}
        />
        <SettingsMenu
          selectedWorkflow={selectedWorkflow}
          setSelectedWorkflow={setSelectedWorkflow}
        />
      </div>
    </aside>
  );
}
