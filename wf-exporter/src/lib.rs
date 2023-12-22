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
}

#[derive(Deserialize)]
struct Workflow {
    id: String,
    name: String,
    #[serde(rename = "lastSaved")]
    last_saved: String,
    data: Data,
}

#[derive(Deserialize)]
struct Data {
    nodes: Vec<Node>,
    edges: Vec<u32>,
}

#[derive(Deserialize)]
struct Node {
    #[serde(rename = "type")]
    tp: String,
}

#[wasm_bindgen]
pub fn convert_to_wf_yaml(wf: JsValue) -> String {
    set_panic_hook();

    let workflow: Result<Workflow, _> = wf.into_serde();

    if workflow.is_err() {
        log(&workflow.err().unwrap().to_string());
    }

    return serde_yaml::to_string(&export_from_flow()).unwrap();
}
