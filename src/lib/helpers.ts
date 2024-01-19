import { DataIn, DataOut, Workflow } from "@/types";
import { useReactFlow } from "reactflow";

export const WORKFLOW_KEY_PREFIX = "wf_";

export function uuidv4() {
  return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, (c) =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16),
  );
}

export function getDateTimeString(date: Date | string) {
  if (typeof date === "string") date = new Date(date);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

export function useLeavePage(
  selectedWorkflow: Workflow,
  setSelectedWorkflow: (workflow: Workflow | null) => void,
) {
  const { toObject } = useReactFlow();
  return () => {
    const oldData = JSON.parse(
      localStorage.getItem(selectedWorkflow.id) ?? "{}",
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
      "You have unsaved changes! Do you really want to leave?",
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
      if (input.rename) return input.rename;

      const node = getNode(input.source);

      const nodeOutBase =
        node?.type === "if" ? node?.data.ifDataOuts : node?.data.dataOuts;
      return input.source === nodeId
        ? input.name
        : nodeOutBase?.find((e: DataOut) => e.id === input.id)?.name;
    },
    getDataOutName: (output: DataOut) => {
      if (output.source === undefined) return output.name;
      const node = getNode(output.source);

      const nodeOutBase =
        node?.type === "if" ? node?.data.ifDataOuts : node?.data.dataOuts;

      return nodeOutBase?.find((e: DataIn) => e.id === output.id)?.name;
    },
    getFullDataOutName: (nodeId: string, dataId: string) => {
      const node = getNode(nodeId);
      let parent = node?.parentNode ? node : undefined;
      while (parent?.parentNode !== undefined) {
        parent = getNode(parent?.parentNode);
      }
      const nodeOutBase =
        node?.type === "if" ? node.data.ifDataOuts : node?.data.dataOuts;

      return (
        (parent?.type !== "if" && parent?.data.name
          ? parent?.data.name
          : node?.data.name) +
        "/" +
        nodeOutBase?.find((e: DataOut) => e.id === dataId)?.name
      );
    },
    getTypeRec: (nodeId: string, dataId: string) => {
      const node = getNode(nodeId);
      let parent = node?.parentNode ? node : undefined;
      while (parent?.parentNode !== undefined) {
        parent = getNode(parent?.parentNode);
      }
      const nodeOutBase =
        node?.type === "if" ? node.data.ifDataOuts : node?.data.dataOuts;

      return nodeOutBase?.find((e: DataOut) => e.id === dataId)?.type;
    },
  };
}
