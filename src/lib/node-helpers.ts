import { Node } from "reactflow";
import StartNodeDetails from "../components/start-node-details";
import FunctionNodeDetails from "../components/function-node-details";
import EndNodeDetails from "../components/end-node-details";
import { ApolloNodeType } from "../types";
import ParallelNodeDetails from "@/components/parallel-node-details";
import IfNodeDetails from "@/components/if-node-details";
import WhileNodeDetails from "@/components/while-node-details";

export function getDefaultData(type: ApolloNodeType) {
  switch (type) {
    case "start":
      return {
        name: "",
        dataOuts: [],
      };
    case "function":
      return {
        name: "",
        type: "string",
        value: "",
        dataOuts: [],
        dataIns: [],
      };
    case "parallel":
      return {
        name: "",
        type: "string",
        dataOuts: [],
        dataIns: [],
      };
    case "if":
      return {
        name: "",
        type: "string",
        dataOuts: [],
        dataIns: [],
      };
    case "while":
      return {
        name: "",
        type: "string",
        dataOuts: [],
        dataIns: [],
      };
    default:
      return {
        name: "end",
        type: "string",
      };
  }
}

export function getDetailsComponentFromNode(node: Node) {
  switch (node.type) {
    case "start":
      return StartNodeDetails;
    case "function":
      return FunctionNodeDetails;
    case "parallel":
      return ParallelNodeDetails;
    case "if":
      return IfNodeDetails;
    case "while":
      return WhileNodeDetails;
    case "end":
      return EndNodeDetails;
  }
}
