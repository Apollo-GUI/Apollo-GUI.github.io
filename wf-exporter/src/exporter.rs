use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

use crate::{InternalDataInOrOut, Workflow};

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Clone)]
pub struct ApolloYaml {
    name: String,
    #[serde(rename = "subFCs")]
    sub_fcs: Option<Vec<SubFC>>,
    #[serde(rename = "dataIns")]
    data_ins: Option<Vec<DataInOrOut>>,
    #[serde(
        with = "serde_yaml::with::singleton_map_recursive",
        rename = "workflowBody"
    )]
    workflow_body: Vec<ExportedFunction>,
    #[serde(rename = "dataOuts")]
    data_outs: Option<Vec<DataInOrOut>>,
}

#[derive(Serialize, Deserialize, Clone)]
struct SubFC {
    name: String,
    sub_fc_body: Node,
    data_ins: Vec<DataInOrOut>,
    data_outs: Vec<DataInOrOut>,
    workflow_body: Vec<Function>,
    properties: Vec<PropertiesConstraintsDef>,
    constraints: Vec<PropertiesConstraintsDef>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Clone)]
struct DataInOrOut {
    #[serde(skip)]
    id: String,
    name: String,
    typ: String,
    source: Option<String>,
    properties: Option<Vec<PropertiesConstraintsDef>>,
    constraints: Option<Vec<PropertiesConstraintsDef>>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Clone)]
struct Node {
    #[serde(skip)]
    id: String,
    name: String,
    typ: String,
    #[serde(rename = "dataIns")]
    data_ins: Option<Vec<DataInOrOut>>,
    #[serde(rename = "dataOuts")]
    data_outs: Option<Vec<DataInOrOut>>,
    properties: Option<Vec<PropertiesConstraintsDef>>,
    constraints: Option<Vec<PropertiesConstraintsDef>>,
    #[serde(skip_serializing)]
    function: Function,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Clone)]
enum ExportedFunction {
    #[serde(rename = "function")]
    AtomicFunction {
        #[serde(flatten)]
        node: Node,
    },
    IfThenElse {
        condition: Vec<Condition>,
        then: Vec<ExportedFunction>,
        or_else: Vec<ExportedFunction>,
        #[serde(flatten)]
        node: Node,
    },
    // Switch {
    // },
    ParallelFor {
        iterators: Vec<String>,
        loop_body: Vec<ExportedFunction>,
        #[serde(flatten)]
        node: Node,
    },
    SequentialWhile {
        condition: Vec<Condition>,
        loop_body: Vec<Node>,
        #[serde(flatten)]
        node: Node,
    },
    SequentialFor {
        data_loops: Vec<DataLoop>,
        loop_counter: LoopCounter,
        loop_body: Vec<Node>,
        #[serde(flatten)]
        node: Node,
    },
    StartOrEnd,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Clone)]
enum Function {
    #[serde(rename = "function")]
    AtomicFunction,
    IfThenElse {
        condition: Vec<Condition>,
        then: Vec<ExportedFunction>,
        or_else: Vec<ExportedFunction>,
    },
    // Switch {
    // },
    ParallelFor {
        iterators: Vec<String>,
        loop_body: Vec<Node>,
    },
    SequentialWhile {
        condition: Vec<Condition>,
        loop_body: Vec<Node>,
    },
    SequentialFor {
        data_loops: Vec<DataLoop>,
        loop_counter: LoopCounter,
        loop_body: Vec<Node>,
    },
    StartOrEnd,
}

#[derive(Serialize, Deserialize, Clone)]
struct DataLoop {
    name: String,
    typ: String,
    init_source: String,
    loop_source: String,
    value: String,
    properties: Vec<PropertiesConstraintsDef>,
    constraints: Vec<PropertiesConstraintsDef>,
}

#[derive(Serialize, Deserialize, Clone)]
struct LoopCounter {
    name: String,
    typ: String,
    from: String,
    to: String,
    step: String,
}

#[derive(Serialize, Deserialize, Clone)]
struct Condition {
    data1: String,
    data2: String,
    typ: String,
    operator: ConditionOperator,
    negation: String,
    combine_with: CombineWith,
}

#[derive(Serialize, Deserialize, Clone)]
enum CombineWith {
    And,
    Or,
}
#[derive(Serialize, Deserialize, Clone)]
enum ConditionOperator {
    Eq,
    Neq,
    Gt,
    Lt,
    Gte,
    Lte,
    Contains,
    StartsWith,
    EndsWith,
}

#[derive(Serialize, Deserialize, Clone)]
struct PropertiesConstraintsDef {
    name: String,
    value: String,
}

fn parse_sub_flow(
    nodes: &Vec<&Node>,
    node_map: &HashMap<String, Node>,
    edge_map: &HashMap<String, Vec<&Node>>,
    children_map: &HashMap<String, Vec<Node>>,
) -> Vec<ExportedFunction> {
    let mut res = Vec::new();
    for node in nodes {
        match node.function.clone() {
            Function::AtomicFunction => {
                res.push(ExportedFunction::AtomicFunction {
                    node: (*node).clone(),
                });
                if let Some(funcs) = edge_map.get(node.id.as_str()) {
                    res.extend(parse_sub_flow(funcs, node_map, edge_map, children_map))
                }
            }
            Function::IfThenElse { condition, .. } => {
                let mut true_branch = vec![];
                let mut false_branch = vec![];

                if let Some(targets) = edge_map.get(&(node.id.to_string() + "true")) {
                    true_branch.extend(parse_sub_flow(targets, node_map, edge_map, children_map));
                }

                if let Some(targets) = edge_map.get(&(node.id.to_string() + "false")) {
                    false_branch.extend(parse_sub_flow(targets, node_map, edge_map, children_map));
                }
                res.push(ExportedFunction::IfThenElse {
                    node: Node {
                        id: node.id.to_string(),
                        name: node.name.to_string(),
                        typ: node.typ.to_string(),
                        data_ins: node.data_ins.clone(),
                        data_outs: node.data_outs.clone(),
                        properties: node.properties.clone(),
                        constraints: node.constraints.clone(),
                        function: Function::IfThenElse {
                            condition: condition.clone(),
                            then: true_branch,
                            or_else: false_branch,
                        },
                    },
                    condition,
                    then: todo!(),
                    or_else: todo!(),
                })
            }
            // Function::ParallelFor { iterators, .. } => {
            //     if let Some(children) = children_map.get(node.id.as_str()) {
            //         res.push(Node {
            //             id: node.id.to_string(),
            //             name: node.name.to_string(),
            //             typ: node.typ.to_string(),
            //             data_ins: node.data_ins.clone(),
            //             data_outs: node.data_outs.clone(),
            //             properties: node.properties.clone(),
            //             constraints: node.constraints.clone(),
            //             function: Function::ParallelFor {
            //                 iterators: iterators.clone(),
            //                 loop_body: parse_sub_flow(
            //                     &children.iter().collect(),
            //                     node_map,
            //                     edge_map,
            //                     children_map,
            //                 ),
            //             },
            //         })
            //     }
            // }
            Function::SequentialWhile { .. } => {}
            Function::SequentialFor { .. } => {}
            Function::StartOrEnd { .. } => {}
            Function::ParallelFor { .. } => {}
        }
    }

    res
}

fn get_data_input(
    data: &InternalDataInOrOut,
    node_id: String,
    node_map: &HashMap<String, Node>,
) -> DataInOrOut {
    if let Some(source) = &data.source {
        if *source == node_id {
            DataInOrOut {
                id: data.id.clone(),
                name: data.name.clone().unwrap_or("".into()),
                typ: data.typ.clone().unwrap_or("".into()),
                source: data.value.clone(),
                properties: None,
                constraints: None,
            }
        } else {
            let source_node = node_map.get(source).expect("source node not found");
            let data_out = source_node
                .data_outs
                .as_ref()
                .map(|d| {
                    d.iter()
                        .find(|d| *d.id == data.id)
                        .expect("output data not found")
                })
                .expect("no data outs found");
            DataInOrOut {
                id: data.id.clone(),
                name: data_out.name.clone(),
                typ: data_out.typ.clone(),
                source: Some(source_node.name.clone() + "/" + &data_out.name.clone()),
                properties: None,
                constraints: None,
            }
        }
    } else {
        DataInOrOut {
            id: data.id.clone(),
            name: data.name.clone().unwrap_or("".into()),
            typ: data.typ.clone().unwrap_or("".into()),
            source: None,
            properties: None,
            constraints: None,
        }
    }
}

pub fn export_from_flow(workflow: Workflow) -> ApolloYaml {
    let mut node_map: HashMap<String, Node> = HashMap::new();
    let mut edge_map: HashMap<String, Vec<&Node>> = HashMap::new();
    let mut children_map: HashMap<String, Vec<Node>> = HashMap::new();

    for node in workflow.data.nodes {
        node_map.insert(
            node.id.to_string(),
            Node {
                id: node.id.to_string(),
                name: node.data.name.clone(),
                typ: node.data.function_type.clone(),
                data_ins: node.data.data_ins.as_ref().map(|d| {
                    d.iter()
                        .map(|d| get_data_input(d, node.id.clone(), &node_map))
                        .collect()
                }),

                data_outs: node.data.data_outs.as_ref().map(|d| {
                    d.iter()
                        .map(|d| get_data_input(d, node.id.clone(), &node_map))
                        .collect()
                }),
                properties: None,
                constraints: None,
                function: match node.typ.as_str() {
                    "function" => Function::AtomicFunction,
                    "start" => Function::StartOrEnd,
                    "end" => Function::StartOrEnd,
                    "if" => Function::IfThenElse {
                        condition: vec![],
                        then: vec![],
                        or_else: vec![],
                    },
                    "parallel_for" => Function::ParallelFor {
                        iterators: vec![],
                        loop_body: vec![],
                    },
                    "sequential_while" => Function::SequentialWhile {
                        condition: vec![],
                        loop_body: vec![],
                    },
                    _ => panic!("unknown or unimplemented node type"),
                },
            },
        );

        if node.parent_node.is_some() {
            let entry = children_map
                .entry(node.parent_node.unwrap().to_string())
                .or_insert(Vec::new());
            entry.push(node_map.get(&node.id).unwrap().clone());
        }
    }

    for edge in workflow.data.edges {
        let mut edge_name = edge.source;

        if let Some(..) = node_map.get(&edge_name) {
            if edge.source_handle.starts_with("i") {
                continue;
            }
        }

        if let Some(..) = node_map.get(&edge.target) {
            if edge.target_handle.starts_with("o") {
                continue;
            }
        }

        if edge.source_handle == "true" || edge.source_handle == "false" {
            edge_name.push_str(&edge.source_handle);
        }
        let entry = edge_map.entry(edge_name).or_insert(Vec::new());
        let edge_target = edge.target.clone();

        if !entry.iter().any(|f| f.id == edge_target) {
            if let Some(func) = node_map.get(&edge.target) {
                entry.push(func);
            }
        }
    }

    let start_node = node_map.get("0").expect("Start node not found!");
    let end_node = node_map.get("end").expect("End node not found!");

    return ApolloYaml {
        name: workflow.name,
        data_ins: start_node.data_outs.clone(),
        workflow_body: parse_sub_flow(
            edge_map.get("0").unwrap(),
            &node_map,
            &edge_map,
            &children_map,
        ),
        data_outs: end_node.data_ins.clone(),
        sub_fcs: None,
    };
}
