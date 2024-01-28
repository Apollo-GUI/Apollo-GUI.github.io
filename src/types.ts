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
  properties?: Property[];
  constraints?: Constraint[];
};

export type DataOut = {
  id: string;
  name?: string;
  type?: DataType;
  source?: string;
  rename?: string;
  startSource?: string;
  properties?: Property[];
  constraints?: Constraint[];
};

export type Condition = {
  id: string;
  data1: string;
  data2: string;
  type: string;
  operator: string;
  negation: boolean;
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

export type Property = {
  name: string;
  value: string;
};

export type Constraint = {
  name: string;
  value: string;
};

export type FunctionNode = {
  name: string;
  type: string;
  dataIns: DataIn[];
  dataOuts: DataOut[];
  properties?: Property[];
  constraints?: Constraint[];
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

export type Iterator = {
  id: string;
  name: string;
  elementType: string;
}

export type LoopCounter = {
  enabled: boolean;
  to: string;
  type: string;
  step: string;
}

export type ParallelNode = {
  name: string;
  dataIns: DataIn[];
  dataOuts: DataOut[];
  properties?: Property[];
  constraints?: Constraint[];
  iterators?: Iterator[];
  loopCounter?: LoopCounter;
};

export type WhileNode = {
  name: string;
  dataIns: DataIn[];
  dataOuts: DataOut[];
  properties?: Property[];
  constraints?: Constraint[];
  conditions: Condition[];
};

export type IfDataIn = DataIn & {
  sendToTrue: boolean;
  sendToFalse: boolean;
};

export type IfDataOut = {
  id: string;
  name?: string;
  type: string;
  sources?: string[];
  properties?: Property[];
  constraints?: Constraint[];
};

export type IfNode = {
  name: string;
  dataIns: IfDataIn[];
  dataOuts: DataOut[];
  ifDataOuts: IfDataOut[];
  properties?: Property[];
  constraints?: Constraint[];
  conditions: Condition[];
};

export type Workflow = {
  id: string;
  name: string;
  lastSaved: Date | null;
  data: any;
};
