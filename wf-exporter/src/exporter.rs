use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

use crate::{IfDataOut, InternalDataInOrOut, Workflow};

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
    #[serde(rename = "type")]
    typ: String,
    source: Option<String>,
    properties: Option<Vec<PropertiesConstraintsDef>>,
    constraints: Option<Vec<PropertiesConstraintsDef>>,
}

fn skip_type_if(typ: &String) -> bool {
    typ == "if"
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Clone)]
struct Node {
    #[serde(skip)]
    id: String,

    #[serde(skip)]
    internal_data_ins: Option<Vec<InternalDataInOrOut>>,
    #[serde(skip)]
    internal_data_outs: Option<Vec<InternalDataInOrOut>>,

    name: String,
    #[serde(rename = "type", skip_serializing_if = "skip_type_if")]
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
    #[serde(rename = "if")]
    IfThenElse {
        #[serde(flatten)]
        node: Node,
        condition: Vec<Condition>,
        then: Vec<ExportedFunction>,
        #[serde(rename = "else")]
        or_else: Vec<ExportedFunction>,
    },
    // Switch {
    // },
    ParallelFor {
        #[serde(flatten)]
        node: Node,
        iterators: Vec<String>,
        loop_body: Vec<ExportedFunction>,
    },
    SequentialWhile {
        #[serde(flatten)]
        node: Node,
        condition: Vec<Condition>,
        loop_body: Vec<ExportedFunction>,
    },
    SequentialFor {
        #[serde(flatten)]
        node: Node,
        data_loops: Vec<DataLoop>,
        loop_counter: LoopCounter,
        loop_body: Vec<ExportedFunction>,
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

        #[serde(skip)]
        if_data_outs: Option<Vec<IfDataOut>>,
    },
    // Switch {
    // },
    ParallelFor {
        iterators: Vec<String>,
    },
    SequentialWhile {
        condition: Vec<Condition>,
    },
    SequentialFor {
        data_loops: Vec<DataLoop>,
        loop_counter: LoopCounter,
    },
    StartOrEnd,
}

#[derive(Serialize, Deserialize, Clone)]
struct DataLoop {
    name: String,
    #[serde(rename = "type")]
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
    #[serde(rename = "type")]
    typ: String,
    from: String,
    to: String,
    step: String,
}

#[derive(Serialize, Deserialize, Clone)]
struct Condition {
    data1: String,
    data2: String,
    #[serde(rename = "type")]
    typ: String,
    operator: String,
    // operator: ConditionOperator,
    negation: String,
    // combine_with: CombineWith,
    #[serde(rename = "combinedWith")]
    combined_with: String,
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
    dependency_count_map: &mut HashMap<String, usize>,
) -> Vec<ExportedFunction> {
    let mut res = Vec::new();
    for node in nodes {
        if let Some(count) = dependency_count_map.get_mut(&node.id) {
            if *count > 0 {
                continue;
            } else {
                *count += 1;
            }
        }
        let new_node = Node {
            data_ins: node.internal_data_ins.as_ref().map(|d| {
                d.iter()
                    .map(|d| get_data_input(d, node.id.clone(), &node_map))
                    .collect()
            }),

            data_outs: node.internal_data_outs.as_ref().map(|d| {
                d.iter()
                    .map(|d| get_data_input(d, node.id.clone(), &node_map))
                    .collect()
            }),
            ..(*node).clone()
        };
        match node.function.clone() {
            Function::AtomicFunction => {
                res.push(ExportedFunction::AtomicFunction { node: new_node });
                if let Some(funcs) = edge_map.get(node.id.as_str()) {
                    res.extend(parse_sub_flow(
                        funcs,
                        node_map,
                        edge_map,
                        children_map,
                        dependency_count_map,
                    ))
                }
            }
            Function::IfThenElse {
                condition,
                if_data_outs,
                ..
            } => {
                let mut true_branch = vec![];
                let mut false_branch = vec![];

                if let Some(targets) = edge_map.get(&(node.id.to_string() + "true")) {
                    true_branch.extend(parse_sub_flow(
                        targets,
                        node_map,
                        edge_map,
                        children_map,
                        dependency_count_map,
                    ));
                }

                if let Some(targets) = edge_map.get(&(node.id.to_string() + "false")) {
                    false_branch.extend(parse_sub_flow(
                        targets,
                        node_map,
                        edge_map,
                        children_map,
                        dependency_count_map,
                    ));
                }
                res.push(ExportedFunction::IfThenElse {
                    node: Node {
                        data_outs: if_data_outs.map(|list| {
                            list.iter()
                                .map(|internal_out| {
                                    let data_in_out = new_node.data_outs.clone().unwrap_or(vec![]);

                                    let sources: Vec<&DataInOrOut> = data_in_out
                                        .iter()
                                        .filter(|dio| internal_out.sources.contains(&dio.id))
                                        .collect();

                                    DataInOrOut {
                                        id: internal_out.id.clone(),
                                        name: internal_out.name.clone(),
                                        typ: sources
                                            .get(0)
                                            .map(|s| s.typ.clone())
                                            .unwrap_or("string".to_string()),
                                        source: Some(
                                            sources
                                                .iter()
                                                .map(|dio| {
                                                    dio.source.clone().unwrap_or("".to_string())
                                                })
                                                .collect::<Vec<String>>()
                                                .join(","),
                                        ),
                                        properties: None,
                                        constraints: None,
                                    }
                                })
                                .collect()
                        }),
                        ..new_node
                    },
                    condition,
                    then: true_branch,
                    or_else: false_branch,
                })
            }
            Function::ParallelFor { iterators, .. } => {
                if let Some(children) = children_map.get(node.id.as_str()) {
                    res.push(ExportedFunction::ParallelFor {
                        node: new_node,
                        loop_body: parse_sub_flow(
                            &children.iter().collect(),
                            node_map,
                            edge_map,
                            children_map,
                            dependency_count_map,
                        ),
                        iterators,
                    })
                }
            }
            Function::SequentialWhile { condition, .. } => {
                if let Some(children) = children_map.get(node.id.as_str()) {
                    res.push(ExportedFunction::SequentialWhile {
                        node: new_node,
                        loop_body: parse_sub_flow(
                            &children.iter().collect(),
                            node_map,
                            edge_map,
                            children_map,
                            dependency_count_map,
                        ),
                        condition,
                    })
                }
            }
            Function::SequentialFor {
                data_loops,
                loop_counter,
                ..
            } => {
                if let Some(children) = children_map.get(node.id.as_str()) {
                    res.push(ExportedFunction::SequentialFor {
                        node: new_node,
                        loop_body: parse_sub_flow(
                            &children.iter().collect(),
                            node_map,
                            edge_map,
                            children_map,
                            dependency_count_map,
                        ),
                        data_loops,
                        loop_counter,
                    })
                }
            }
            Function::StartOrEnd { .. } => {}
        }
    }

    res
}

fn get_data_input(
    data: &InternalDataInOrOut,
    node_id: String,
    node_map: &HashMap<String, Node>,
) -> DataInOrOut {
    let actual_name = data
        .rename
        .clone()
        .unwrap_or(data.name.clone().unwrap_or("".into()));

    if let Some(source) = &data.source {
        if *source == node_id {
            DataInOrOut {
                id: data.id.clone(),
                name: actual_name,
                typ: data.typ.clone().unwrap_or("".into()),
                source: data.value.clone(),
                properties: None,
                constraints: None,
            }
        } else {
            let source_node = node_map.get(source).expect("source node not found");
            if let Function::IfThenElse { if_data_outs, .. } = &source_node.function {
                let data_out = if_data_outs
                    .as_ref()
                    .map(|d| {
                        d.iter()
                            .find(|d| *d.id == data.id)
                            .expect("output data not found")
                    })
                    .expect("no data outs found");
                DataInOrOut {
                    id: data.id.clone(),
                    name: actual_name,
                    typ: data_out.typ.clone(),
                    source: Some(source_node.name.clone() + "/" + &data_out.name.clone()),
                    properties: None,
                    constraints: None,
                }
            } else {
                let data_out = source_node
                    .internal_data_outs
                    .as_ref()
                    .map(|d| {
                        d.iter()
                            .find(|d| *d.id == data.id)
                            .expect("output data not found")
                    })
                    .expect("no data outs found");
                DataInOrOut {
                    id: data.id.clone(),
                    name: actual_name,
                    typ: data_out.typ.clone().unwrap_or("string".to_string()),
                    source: Some(
                        source_node.name.clone()
                            + "/"
                            + &data_out.name.clone().unwrap_or("".to_string()),
                    ),
                    properties: None,
                    constraints: None,
                }
            }
        }
    } else {
        DataInOrOut {
            id: data.id.clone(),
            name: actual_name,
            typ: data.typ.clone().unwrap_or("".into()),
            source: data.start_source.clone(),
            properties: None,
            constraints: None,
        }
    }
}

pub fn export_from_flow(workflow: Workflow) -> ApolloYaml {
    let mut node_map: HashMap<String, Node> = HashMap::new();
    let mut edge_map: HashMap<String, Vec<&Node>> = HashMap::new();
    let mut children_map: HashMap<String, Vec<Node>> = HashMap::new();

    let mut dependency_count_map: HashMap<String, usize> = HashMap::new();

    for node in workflow.data.nodes {
        node_map.insert(
            node.id.to_string(),
            Node {
                id: node.id.to_string(),
                name: node.data.name.clone(),
                typ: node.data.function_type.clone(),
                data_ins: None,
                data_outs: None,
                internal_data_ins: node.data.data_ins.clone(),
                internal_data_outs: node.data.data_outs.clone(),
                properties: None,
                constraints: None,
                function: match node.typ.as_str() {
                    "function" => Function::AtomicFunction,
                    "start" => Function::StartOrEnd,
                    "end" => Function::StartOrEnd,
                    "if" => Function::IfThenElse {
                        condition: node
                            .data
                            .conditions
                            .unwrap_or(vec![])
                            .iter()
                            .map(|c| Condition {
                                data1: c.data1.clone(),
                                data2: c.data2.clone(),
                                typ: c.typ.clone().unwrap_or("string".to_string()),
                                operator: c.operator.clone(),
                                negation: c.negation.clone().unwrap_or("false".to_string()),
                                combined_with: c.combined_with.clone().unwrap_or("or".to_string()),
                            })
                            .collect(),
                        if_data_outs: node.data.if_data_outs,
                    },
                    "parallel_for" => Function::ParallelFor { iterators: vec![] },
                    "sequential_while" => Function::SequentialWhile { condition: vec![] },
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
                *dependency_count_map.entry(edge_target).or_default() += 0;
            }
        }
    }

    let start_node = node_map.get("0").expect("Start node not found!");
    let end_node = node_map.get("end").expect("End node not found!");

    return ApolloYaml {
        name: workflow.name,
        data_ins: start_node.internal_data_outs.as_ref().map(|d| {
            d.iter()
                .map(|d| get_data_input(d, start_node.id.clone(), &node_map))
                .collect()
        }),
        workflow_body: parse_sub_flow(
            edge_map.get("0").unwrap(),
            &node_map,
            &edge_map,
            &children_map,
            &mut dependency_count_map,
        ),
        data_outs: end_node.internal_data_ins.as_ref().map(|d| {
            d.iter()
                .map(|d| get_data_input(d, end_node.id.clone(), &node_map))
                .collect()
        }),
        sub_fcs: None,
    };
}
