import { Handle, NodeProps, Position } from "reactflow";
import { EndNode } from "@/types";
import { NodeIcons } from "../icons";
import { Separator } from "../ui/separator";
import { useDataVariables } from "@/lib/helpers";

export default function EndNode({ data }: NodeProps<EndNode>) {
  const { getDataInName } = useDataVariables();
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
            {getDataInName("",input)}
          </p>
        ))}
      </div>

      <Separator />

      <div className="p-2 flex flex-col items-center">
        <div className="flex items-center text-lg text-slate-500">
          <NodeIcons.end className="w-6 h-6 mr-2" strokeWidth={1} />
          End
        </div>
      </div>
    </div>
  );
}
