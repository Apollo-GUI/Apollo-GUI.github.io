import { ApolloNodeType } from "../src/types";
import DraggableElement from "./draggable-element";
import { Icons } from "./icons";
import { Button } from "./ui/button";

export default function NavRail() {
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
        <Icons.logo className="h-12 w-12 mx-auto mt-10 mb-5 text-amber-400" />
        <DraggableElement node="function" onNodeDrag={onDragStart} />
        <DraggableElement node="parallel" onNodeDrag={onDragStart} />
        <DraggableElement node="if" onNodeDrag={onDragStart} />
        <DraggableElement node="while" onNodeDrag={onDragStart} />
        <DraggableElement node="end" onNodeDrag={onDragStart} />
      </nav>

      <Button size={"icon"} className="mb-4">
        <Icons.settings className="h-8 w-8" />
      </Button>
    </aside>
  );
}
