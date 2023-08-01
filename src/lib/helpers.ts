import { DataIn, DataOut, Workflow } from "@/types";
import { useReactFlow } from "reactflow";

export const WORKFLOW_KEY_PREFIX = "wf_";

export function uuidv4() {
  return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, (c) =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16)
  );
}

export function getDateTimeString(date: Date | string) {
  if (typeof date === "string") date = new Date(date);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

export function useLeavePage(
  selectedWorkflow: Workflow,
  setSelectedWorkflow: (workflow: Workflow | null) => void
) {
  const { toObject } = useReactFlow();
  return () => {
    const oldData = JSON.parse(
      localStorage.getItem(selectedWorkflow.id) ?? "{}"
    ).data;
    const newData = toObject();
    if (
      oldData !== undefined &&
      JSON.stringify(newData.nodes) === JSON.stringify(oldData.nodes) &&
      JSON.stringify(newData.edges) === JSON.stringify(oldData.edges)
    ) {
      setSelectedWorkflow(null);
      history.replaceState({}, "", "/");
      return;
    }
    const res = window.confirm(
      "You have unsaved changes! Do you really want to leave?"
    );
    if (res) {
      setSelectedWorkflow(null);
    } else {
      history.replaceState({}, "", "/" + selectedWorkflow.id);
    }
  };
}

export function useDataVariables() {
  const { getNode } = useReactFlow();

  return {
    getDataInName: (nodeId: string, input: DataIn) => {
      return input.source === nodeId
        ? input.name
        : getNode(input.source)?.data.dataOuts.find(
            (e: DataOut) => e.id === input.id
          )?.name;
    },
    getDataOutName: (output: DataOut) => {
      return output.source === undefined
        ? output.name
        : getNode(output.source)?.data.dataOuts.find((e: DataIn) => e.id === output.id)
            ?.name;
    },
    getFullDataOutName: (nodeId: string, dataId: string) => {
      const nodeData = getNode(nodeId)?.data;
      return (
        nodeData.name +
        "/" +
        nodeData?.dataOuts.find((e: DataOut) => e.id === dataId)?.name
      );
    },
  };
}
