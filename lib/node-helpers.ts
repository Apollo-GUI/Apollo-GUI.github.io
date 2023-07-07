import { Node } from "reactflow";
import { ApolloNodeType } from "../src/types";
import StartNodeDetails from "../components/start-node-details";
import FunctionNodeDetails from "../components/function-node-details";

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
        value:"",
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
  }
}
