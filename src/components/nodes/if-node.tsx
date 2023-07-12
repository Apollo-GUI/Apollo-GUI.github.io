import { Handle, Position, NodeProps } from "reactflow";
import { NodeIcons } from "../icons";
import { IfNode } from "@/types";

export default function IfNode({ data }: NodeProps<IfNode>) {
  return (
    <div className="flex flex-col items-center justify-center shadow-md rounded-md bg-white border-2 rotate-45 aspect-square min-w-[110px]">
      <Handle
        type="target"
        position={Position.Top}
        id={"idefault"}
        className="bg-slate-200 w-3 h-3 rounded-full -top-0.5 -left-0.5 -rotate-45"
      />
      <div className="p-2 flex flex-col items-center -rotate-45 -translate-x-2 -translate-y-2">
        <div className="flex items-center text-xs text-slate-500">
          <NodeIcons.if className="w-4 h-3" />
          Condition
        </div>
        <div className="text-sm text-slate-800 font-semibold">
          {data.name.length ? data.name : "if name"}
        </div>
      </div>

      <div className="">
        <p className="text-xs text-slate-700 bg-slate-200 rounded px-2 h-[16px] -rotate-90 origin-center absolute bottom-[calc(50%-12px)] -right-1">
          True
        </p>
        <Handle
          type="source"
          position={Position.Bottom}
          id={"true"}
          className="bg-slate-200 w-3 h-2 rounded-t-full -rotate-90"
          style={{ top: 50, left: 98}}
        />
      </div>

      <div className="">
        <p className="text-xs text-slate-700 bg-slate-200 rounded px-2 h-[16px] absolute bottom-2 right-[calc(50%-20px)]">
          False
        </p>
        <Handle
          type="source"
          position={Position.Bottom}
          id={"false"}
          className="bg-slate-200 w-3 h-2 rounded-t-full"
          style={{ bottom:-2, left: 50}}
        />
      </div>
    </div>
  );
}
