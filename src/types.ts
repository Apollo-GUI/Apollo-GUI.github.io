export type ApolloNodeType =
  | "start"
  | "function"
  | "parallel"
  | "if"
  | "while"
  | "end";

export const dataTypes = [
  "string",
  "number",
  "boolean",
  "object",
  "array",
  "null",
] as const;
export type DataType = (typeof dataTypes)[number];

export const conditionTypes = [
  "==",
  "!=",
  "<",
  "<=",
  ">",
  ">=",
  "contains",
  "startsWith",
  "endsWith",
] as const;
export type ContditionType = (typeof conditionTypes)[number];

export type DataIn = {
  id: string;
  name?: string;
  type?: DataType;
  source: string;
  value?: string;
  rename?: string;
  properties?: Properties[];
  constraints?: Constraints[];
};

export type DataOut = {
  id: string;
  name?: string;
  type?: DataType;
  source?: string;
  startSource?: string;
  properties?: Properties[];
  constraints?: Constraints[];
};

export type Condition = {
  data1: string;
  data2: string;
  type: string;
  operator: string;
  negation: string;
  combinedWith: string;
};

export type ConditionOption = {
  value: DataIn;
  label: string;
  type: string;
};
export type DataInOption = {
  value: DataIn;
  label: string;
  parentId: string;
};
export type DataOutOption = {
  value: DataOut;
  label: string;
};

export type Properties = {
  name: string;
  value: string;
};

export type Constraints = {
  name: string;
  value: string;
};

export type Iterator = {
  dataIns: DataIn[];
  isDataIn: boolean;
  value: number;
};

export type FunctionNode = {
  name: string;
  type: string;
  dataIns: DataIn[];
  dataOuts: DataOut[];
  properties?: Properties[];
  constraints?: Constraints[];
};

export type StartNode = {
  name: string;
  type: string;
  dataOuts: DataOut[];
};

export type EndNode = {
  name: string;
  dataIns: DataIn[];
};

export type ParallelNode = {
  name: string;
  dataIns: DataIn[];
  dataOuts: DataOut[];
  properties?: Properties[];
  constraints?: Constraints[];
  iterator: Iterator;
};

export type WhileNode = {
  name: string;
  dataIns: DataIn[];
  dataOuts: DataOut[];
  properties?: Properties[];
  constraints?: Constraints[];
  condition: Condition;
};

export type IfDataIn = DataIn & {
  sendToTrue: boolean;
  sendToFalse: boolean;
};

export type IfDataOut = {
  id: string;
  name?: string;
  sources?: string[];
  properties?: Properties[];
  constraints?: Constraints[];
};

export type IfNode = {
  name: string;
  dataIns: IfDataIn[];
  dataOuts: DataOut[];
  ifDataOuts: IfDataOut[];
  properties?: Properties[];
  constraints?: Constraints[];
  conditions: Condition[];
};

export type Workflow = {
  id: string;
  name: string;
  lastSaved: Date | null;
  data: any;
};
