import { Handle, Position, NodeProps, NodeResizer } from "reactflow";
import { NodeIcons } from "../icons";
import { Separator } from "../ui/separator";
import { ParallelNode } from "../../src/types";

export default function ParallelNode({
  data,
  selected,
}: NodeProps<ParallelNode>) {
  return (
    <div className="flex flex-col justify-between items-center h-full border-2 rounded-lg text-center bg-sky-500 -z-10 bg-opacity-20">
      <NodeResizer
        isVisible={selected}
        minWidth={200}
        minHeight={100}
      />
      <div className="inline-flex flex-col items-center shadow-md rounded-md bg-white border-2 -top-8 relative -mb-8">
        <Handle
          type="target"
          position={Position.Top}
          id={"idefault"}
          className="bg-slate-200 w-3 h-2 rounded-b-full top-0"
        />

        <div className="p-2 flex flex-col items-center">
          <div className="flex items-center text-xs text-slate-500">
            <NodeIcons.parallel className="w-4 h-3" />
            Parallel
          </div>
          <div className="text-sm text-slate-800 font-semibold">
            {data.name.length ? data.name : "parallel name"}
          </div>
        </div>
        {data.dataIns.length > 0 && (
          <>
            <Separator />
            <div className="flex space-x-2 mx-2 mb-0.5">
              {data.dataIns.map((dataIn, idx) => (
                <div key={idx} className="mt-2">
                  <p className="text-xs text-slate-700 bg-slate-200 rounded px-2 h-[16px]">
                    {dataIn.name}
                  </p>
                  <Handle
                    type="source"
                    position={Position.Bottom}
                    id={"i" + idx}
                    className="bg-slate-200 w-3 h-2 rounded-t-full relative"
                  />
                </div>
              ))}
            </div>
          </>
        )}
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
        {data.dataOuts.length > 0 ? (
         
            <div className="flex space-x-2 mx-2 mb-0.5">
              {data.dataOuts.map((dataOut, idx) => (
                <div key={idx}>
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
              ))}
            </div>
        ):(
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
