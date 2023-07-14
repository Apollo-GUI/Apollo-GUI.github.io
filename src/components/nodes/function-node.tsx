import { Handle, Position, NodeProps } from "reactflow";
import { NodeIcons } from "../icons";
import { Separator } from "../ui/separator";
import { FunctionNode } from "@/types";

export default function FunctionNode({ data }: NodeProps<FunctionNode>) {
  return (
    <div className="flex flex-col items-center shadow-md rounded-md bg-white border-2">
      <Handle
        type="target"
        position={Position.Top}
        id={"idefault"}
        className="bg-slate-200 w-3 h-2 rounded-b-full top-0"
      />

      <div className="flex space-x-2 mx-2 mt-2">
        {data.dataIns?.map((input, idx) => (
          <p
            key={idx}
            className="text-xs text-slate-700 bg-slate-200 rounded px-2 h-[16px] mb-1"
          >
            {input.name}
          </p>
        ))}
      </div>

      <Separator />
      <div className="p-2 flex flex-col items-center">
        <div className="flex items-center text-xs text-slate-500">
          <NodeIcons.function className="w-4 h-3" />
          Function
        </div>
        <div className="text-sm text-slate-800 font-semibold">
          {data.name?.length ? data.name : "function name"}
        </div>
      </div>
      <Separator />
      <div className="flex space-x-2 mx-2 mb-0.5">
        {data.dataOuts?.length>0 ? (
          data.dataOuts.map((dataOut, idx) => (
            <div key={idx} className="mt-2">
              <p className="text-xs text-slate-700 bg-slate-200 rounded px-2 h-[16px]">
                {dataOut.name}
              </p>
              <Handle
                type="source"
                position={Position.Bottom}
                id={"o" + idx}
                className="bg-slate-200 w-3 h-2 rounded-t-full relative"
              />
            </div>
          ))
        ) : (
          <Handle
            type="source"
            position={Position.Bottom}
            id={"odefault"}
            className="bg-slate-200 w-3 h-2 rounded-t-full relative"
          />
        )}
      </div>
    </div>
  );
}
