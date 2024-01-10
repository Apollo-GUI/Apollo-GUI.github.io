use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;
use wasm_bindgen::convert::IntoWasmAbi;

use crate::{log, InternalDataInOrOut, Workflow};

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
    workflow_body: Vec<Function>,
    #[serde(rename = "dataOuts")]
    data_outs: Option<Vec<DataInOrOut>>,
}

#[derive(Serialize, Deserialize, Clone)]
struct SubFC {
    name: String,
    sub_fc_body: Function,
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
enum Function {
    #[serde(rename = "function")]
    AtomicFunction {
        #[serde(skip)]
        id: String,
        name: String,
        typ: String,
        data_ins: Option<Vec<DataInOrOut>>,
        data_outs: Option<Vec<DataInOrOut>>,
        properties: Option<Vec<PropertiesConstraintsDef>>,
        constraints: Option<Vec<PropertiesConstraintsDef>>,
    },
    IfThenElse {
        #[serde(skip)]
        id: String,
        name: String,
        typ: String,
        condition: Vec<Condition>,
        then: Vec<Function>,
        or_else: Vec<Function>,
        data_ins: Option<Vec<DataInOrOut>>,
        data_outs: Option<Vec<DataInOrOut>>,
        properties: Option<Vec<PropertiesConstraintsDef>>,
        constraints: Option<Vec<PropertiesConstraintsDef>>,
    },
    // Switch {
    // },
    ParallelFor {
        #[serde(skip)]
        id: String,
        name: String,
        iterators: Vec<String>,
        loop_body: Vec<Function>,
        data_ins: Option<Vec<DataInOrOut>>,
        data_outs: Option<Vec<DataInOrOut>>,
        properties: Option<Vec<PropertiesConstraintsDef>>,
        constraints: Option<Vec<PropertiesConstraintsDef>>,
    },
    SequentialWhile {
        name: String,
        data_ins: Vec<DataInOrOut>,
        data_outs: Vec<DataInOrOut>,
        data_loops: Vec<DataLoop>,
        condition: Vec<Condition>,
        loop_body: Box<Function>,
        properties: Vec<PropertiesConstraintsDef>,
        constraints: Vec<PropertiesConstraintsDef>,
    },
    SequentialFor {
        name: String,
        data_ins: Vec<DataInOrOut>,
        data_outs: Vec<DataInOrOut>,
        data_loops: Vec<DataLoop>,
        loop_counter: LoopCounter,
        loop_body: Box<Function>,
        properties: Vec<PropertiesConstraintsDef>,
        constraints: Vec<PropertiesConstraintsDef>,
    },
    StartOrEnd {
        name: String,
        data: Option<Vec<DataInOrOut>>,
    },
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
    functions: &Vec<&Function>,
    node_map: &HashMap<String, Function>,
    edge_map: &HashMap<String, Vec<&Function>>,
    children_map: &HashMap<String, Vec<Function>>,
) -> Vec<Function> {
    let mut res = Vec::new();
    for func in functions {
        match func {
            Function::AtomicFunction { id, .. } => {
                res.push((**func).clone());
                if let Some(funcs) = edge_map.get(id) {
                    res.extend(parse_sub_flow(funcs, node_map, edge_map, children_map))
                }
            }
            Function::IfThenElse {
                id,
                name,
                typ,
                condition,
                data_ins,
                data_outs,
                properties,
                constraints,
                ..
            } => {
                let mut true_branch = vec![];
                let mut false_branch = vec![];

                if let Some(targets) = edge_map.get(&(id.to_string() + "true")) {
                    true_branch.extend(parse_sub_flow(targets, node_map, edge_map, children_map));
                }

                if let Some(targets) = edge_map.get(&(id.to_string() + "false")) {
                    false_branch.extend(parse_sub_flow(targets, node_map, edge_map, children_map));
                }
                res.push(Function::IfThenElse {
                    id: id.to_string(),
                    name: name.to_string(),
                    typ: typ.to_string(),
                    condition: condition.clone(),
                    then: true_branch,
                    or_else: false_branch,
                    data_ins: data_ins.clone(),
                    data_outs: data_outs.clone(),
                    properties: properties.clone(),
                    constraints: constraints.clone(),
                })
            }
            Function::ParallelFor {
                id,
                iterators,
                name,
                data_ins,
                data_outs,
                properties,
                constraints,
                ..
            } => {
                if let Some(children) = children_map.get(id) {
                    res.push(Function::ParallelFor {
                        id: id.to_string(),
                        name: name.to_string(),
                        iterators: iterators.clone(),
                        loop_body: parse_sub_flow(
                            &children.iter().collect(),
                            node_map,
                            edge_map,
                            children_map,
                        ),
                        data_ins: data_ins.clone(),
                        data_outs: data_outs.clone(),
                        properties: properties.clone(),
                        constraints: constraints.clone(),
                    })
                }
            }
            Function::SequentialWhile { .. } => {}
            Function::SequentialFor { .. } => {}
            Function::StartOrEnd { .. } => {}
        }
    }

    res
}

fn get_data_input(
    data: &InternalDataInOrOut,
    node_id: String,
    node_map: &HashMap<String, Function>,
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
            if let Some(Function::AtomicFunction {
                name, data_outs, ..
            }) = node_map.get(source)
            {
                let data_out = data_outs
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
                    source: Some(name.clone() + "/" + &data_out.name.clone()),
                    properties: None,
                    constraints: None,
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
    let mut node_map: HashMap<String, Function> = HashMap::new();
    let mut edge_map: HashMap<String, Vec<&Function>> = HashMap::new();
    let mut children_map: HashMap<String, Vec<Function>> = HashMap::new();

    for node in workflow.data.nodes {
        match node.typ.as_str() {
            "function" => {
                node_map.insert(
                    node.id.to_string(),
                    Function::AtomicFunction {
                        id: node.id.to_string(),
                        name: node.data.name.clone(),
                        typ: node.data.function_type.clone(),
                        data_ins: None,
                        data_outs: node.data.data_outs.as_ref().map(|d| {
                            d.iter()
                                .map(|d| get_data_input(d, node.id.clone(), &node_map))
                                .collect()
                        }),
                        properties: None,
                        constraints: None,
                    },
                );
            }

            "start" => {
                node_map.insert(
                    node.id.to_string(),
                    Function::StartOrEnd {
                        name: "start".into(),
                        data: node.data.data_outs.map(|d| {
                            d.iter()
                                .map(|d| DataInOrOut {
                                    id: d.id.clone(),
                                    name: d.name.clone().unwrap_or("".into()),
                                    typ: d.typ.clone().unwrap_or("".into()),
                                    source: d.name.clone(),
                                    properties: None,
                                    constraints: None,
                                })
                                .collect()
                        }),
                    },
                );
            }
            "end" => {
                node_map.insert(
                    node.id.to_string(),
                    Function::StartOrEnd {
                        name: "end".into(),
                        data: node.data.data_ins.as_ref().map(|d| {
                            d.iter()
                                .map(|d| get_data_input(d, node.id.to_string(), &node_map))
                                .collect()
                        }),
                    },
                );
            }
            "if" => {
                node_map.insert(
                    node.id.to_string(),
                    Function::IfThenElse {
                        id: node.id.to_string(),
                        name: node.data.name,
                        typ: node.data.function_type,
                        data_ins: None,
                        data_outs: None,
                        properties: None,
                        constraints: None,
                        condition: vec![],
                        then: vec![],
                        or_else: vec![],
                    },
                );
            }

            "parallel" => {
                node_map.insert(
                    node.id.to_string(),
                    Function::ParallelFor {
                        id: node.id.to_string(),
                        name: node.data.name,
                        data_ins: None,
                        data_outs: None,
                        properties: None,
                        constraints: None,
                        iterators: vec![],
                        loop_body: vec![],
                    },
                );
            }
            &_ => {}
        }

        if node.parent_node.is_some() {
            let entry = children_map
                .entry(node.parent_node.unwrap().to_string())
                .or_insert(Vec::new());
            entry.push(node_map.get(&node.id).unwrap().clone());
        }
    }

    for edge in workflow.data.edges {
        let mut edge_name = edge.source;

        if let Some(Function::ParallelFor { .. }) = node_map.get(&edge_name) {
            if edge.source_handle.starts_with("i") {
                continue;
            }
        }

        if let Some(Function::ParallelFor { .. }) = node_map.get(&edge.target) {
            if edge.target_handle.starts_with("o") {
                continue;
            }
        }

        if edge.source_handle == "true" || edge.source_handle == "false" {
            edge_name.push_str(&edge.source_handle);
        }
        let entry = edge_map.entry(edge_name).or_insert(Vec::new());
        let edge_target = edge.target.clone();

        if !entry.iter().any(|f| {
            if let Function::AtomicFunction { id, .. } = f {
                *id == edge_target
            } else {
                false
            }
        }) {
            if let Some(func) = node_map.get(&edge.target) {
                entry.push(func);
            }
        }
    }

    if let Some(Function::StartOrEnd { data, .. }) = node_map.get("0") {
        if let Some(Function::StartOrEnd { data: data_out, .. }) = node_map.get("end") {
            return ApolloYaml {
                name: workflow.name,
                data_ins: data.clone(),
                workflow_body: parse_sub_flow(
                    edge_map.get("0").unwrap(),
                    &node_map,
                    &edge_map,
                    &children_map,
                ),
                data_outs: data_out.clone(),
                sub_fcs: None,
            };
        } else {
            panic!("End node not found!");
        }
    } else {
        panic!("Start node not found!");
    }
}
