import { Handle, Position, NodeProps, NodeResizer, useNodeId } from "reactflow";
import { NodeIcons } from "../icons";
import { IfNode } from "@/types";
import { useDataVariables } from "@/lib/helpers";
import { Separator } from "../ui/separator";

export default function IfNode({ data, selected }: NodeProps<IfNode>) {
  const { getDataInName, getDataOutName } = useDataVariables();
  const nodeId = useNodeId() ?? "";
  return (
    <div className="flex flex-col justify-between items-center h-full border-2 rounded-lg text-center bg-orange-500 -z-10 bg-opacity-10">
      <NodeResizer isVisible={selected} minWidth={100} minHeight={100} />
      <div className="inline-flex flex-col items-center shadow-md rounded-md bg-white border-2 -top-12 relative -mb-8 rotate-45 min-w-[100px] aspect-square">
        <Handle
          type="target"
          position={Position.Top}
          id={"idefault"}
          className="bg-slate-200 w-3 h-3 rounded-full -top-0.5 -left-0.5 -rotate-45"
        />

        <div className="p-2 flex flex-col items-center -rotate-45 -translate-x-2 translate-y-3">
          <div className="flex items-center text-xs text-slate-500">
            <NodeIcons.if className="w-4 h-3" />
            Condition
          </div>
          <div className="text-sm text-slate-800 font-semibold max-w-[80px] overflow-ellipsis overflow-hidden">
            {data.name.length ? data.name : "if name"}
          </div>
        </div>
        <div className="">
          <p className="text-xs text-slate-700 bg-slate-200 rounded px-2 h-[16px] -rotate-90 origin-center absolute bottom-[calc(50%-10px)] -right-1">
            True
          </p>
          <Handle
            type="source"
            position={Position.Bottom}
            id={"true"}
            className="bg-slate-200 w-3 h-2 rounded-t-full -rotate-90"
            style={{ top: 45, left: 88 }}
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
            style={{ bottom: -2, left: 45 }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center shadow-md rounded-md bg-white border-2 top-4 relative">
        <Handle
          type="target"
          position={Position.Top}
          id={"oidefault"}
          className="bg-slate-200 w-3 h-2 rounded-b-full top-0"
        />


        <div className="p-2 flex flex-col items-center">
          <div className="flex items-center text-xs text-slate-500">
            Outputs
          </div>
        </div>
        {data.ifDataOuts?.length > 0 ? (
          <div className="flex space-x-2 mx-2 mb-0.5">
            {data.ifDataOuts?.map((dataOut, idx) => (
              <div key={idx}>
                <p className="text-xs text-slate-700 bg-slate-200 rounded px-2 h-[16px]">
                  {getDataOutName(dataOut)}
                </p>
                <Handle
                  type="source"
                  position={Position.Bottom}
                  id={"o" + idx}
                  className="bg-slate-200 w-3 h-2 rounded-t-full relative"
                />
              </div>
            ))}
          </div>
        ) : (
          <Handle
            type="source"
            position={Position.Bottom}
            id={"oodefault"}
            className="bg-slate-200 w-3 h-2 rounded-t-full -bottom-0.5 "
          />
        )}
      </div>
    </div>
  );
}
