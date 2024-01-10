mod exporter;
mod utils;

use exporter::export_from_flow;
use gloo_utils::format::JsValueSerdeExt;
use serde::Deserialize;
use utils::set_panic_hook;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    fn alert(s: &str);
}

#[derive(Deserialize)]
pub struct Workflow {
    name: String,
    data: Data,
}

#[derive(Deserialize)]
struct Data {
    nodes: Vec<Node>,
    edges: Vec<Edge>,
}

#[derive(Deserialize)]
struct Node {
    id: String,
    #[serde(rename = "type")]
    typ: String,
    #[serde(rename = "parentNode")]
    parent_node: Option<String>,
    data: NodeInternals,
}

#[derive(Deserialize)]
struct NodeInternals {
    name: String,
    #[serde(rename = "type")]
    function_type: String,
    #[serde(rename = "dataIns")]
    data_ins: Option<Vec<InternalDataInOrOut>>,
    #[serde(rename = "dataOuts")]
    data_outs: Option<Vec<InternalDataInOrOut>>,
}

#[derive(Deserialize)]
pub struct InternalDataInOrOut {
    id: String,
    name: Option<String>,
    source: Option<String>,
    value: Option<String>,
    #[serde(rename = "type")]
    typ: Option<String>,
}

#[derive(Deserialize)]
struct Edge {
    source: String,
    #[serde(rename = "sourceHandle")]
    source_handle: String,
    target: String,
    #[serde(rename = "targetHandle")]
    target_handle: String,
}

#[wasm_bindgen]
pub fn convert_to_wf_yaml(wf: JsValue) -> String {
    set_panic_hook();

    let workflow = match wf.into_serde::<Workflow>() {
        Ok(wf) => wf,
        Err(e) => {
            log(&e.to_string());
            alert("Error! Could not parse workflow.");
            return String::from("");
        }
    };

    return serde_yaml::to_string(&export_from_flow(workflow)).unwrap();
}
