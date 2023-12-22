use serde::Serialize;
use serde_with::skip_serializing_none;

#[skip_serializing_none]
#[derive(Serialize)]
pub struct ApolloYaml {
    name: String,
    #[serde(with = "serde_yaml::with::singleton_map_recursive")]
    workflow_body: Vec<Function>,
    sub_fcs: Option<Vec<SubFC>>,
    data_ins: Option<Vec<DataIn>>,
    data_outs: Option<Vec<DataOut>>,
}

#[derive(Serialize)]
struct SubFC {
    name: String,
    sub_fc_body: Function,
    data_ins: Vec<DataIn>,
    data_outs: Vec<DataOut>,
    workflow_body: Vec<Function>,
    properties: Vec<PropertiesConstraintsDef>,
    constraints: Vec<PropertiesConstraintsDef>,
}

#[derive(Serialize)]
struct DataIn {
    name: String,
    typ: String,
    source: DataSourceType,
    properties: Vec<PropertiesConstraintsDef>,
    constraints: Vec<PropertiesConstraintsDef>,
}

#[derive(Serialize)]
enum DataSourceType {
    Number(i32),
    String(String),
    Object(String),
    Array(String),
    Boolean(bool),
    None,
}

#[derive(Serialize)]
struct DataOut {
    name: String,
    typ: String,
    source: String,
    properties: Vec<PropertiesConstraintsDef>,
    constraints: Vec<PropertiesConstraintsDef>,
}

#[skip_serializing_none]
#[derive(Serialize)]
enum Function {
    #[serde(rename = "function")]
    AtomicFunction {
        name: String,
        typ: String,
        data_ins: Option<Vec<DataIn>>,
        data_outs: Option<Vec<DataOut>>,
        properties: Option<Vec<PropertiesConstraintsDef>>,
        constraints: Option<Vec<PropertiesConstraintsDef>>,
    },
    IfThenElse {
        name: String,
        typ: String,
        condition: Vec<Condition>,
        then: Box<Function>,
        or_else: Box<Function>,
        data_ins: Vec<DataIn>,
        data_outs: Vec<DataOut>,
        properties: Vec<PropertiesConstraintsDef>,
        constraints: Vec<PropertiesConstraintsDef>,
    },
    // Switch {
    // },
    ParallelFor {
        name: String,
        data_ins: Vec<DataIn>,
        data_outs: Vec<DataOut>,
        iterators: Vec<String>,
        loop_body: Box<Function>,
        properties: Vec<PropertiesConstraintsDef>,
        constraints: Vec<PropertiesConstraintsDef>,
    },
    SequentialWhile {
        name: String,
        data_ins: Vec<DataIn>,
        data_outs: Vec<DataOut>,
        data_loops: Vec<DataLoop>,
        condition: Vec<Condition>,
        loop_body: Box<Function>,
        properties: Vec<PropertiesConstraintsDef>,
        constraints: Vec<PropertiesConstraintsDef>,
    },
    SequentialFor {
        name: String,
        data_ins: Vec<DataIn>,
        data_outs: Vec<DataOut>,
        data_loops: Vec<DataLoop>,
        loop_counter: LoopCounter,
        loop_body: Box<Function>,
        properties: Vec<PropertiesConstraintsDef>,
        constraints: Vec<PropertiesConstraintsDef>,
    },
}

#[derive(Serialize)]
struct DataLoop {
    name: String,
    typ: String,
    init_source: String,
    loop_source: String,
    value: String,
    properties: Vec<PropertiesConstraintsDef>,
    constraints: Vec<PropertiesConstraintsDef>,
}

#[derive(Serialize)]
struct LoopCounter {
    name: String,
    typ: String,
    from: String,
    to: String,
    step: String,
}

#[derive(Serialize)]
struct Condition {
    data1: DataSourceType,
    data2: DataSourceType,
    typ: String,
    operator: ConditionOperator,
    negation: String,
    combine_with: CombineWith,
}

#[derive(Serialize)]
enum CombineWith {
    And,
    Or,
}
#[derive(Serialize)]
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

#[derive(Serialize)]
struct PropertiesConstraintsDef {
    name: String,
    value: String,
}

pub fn export_from_flow() -> ApolloYaml {
    return ApolloYaml {
        name: "adsfdasf".into(),
        data_ins: None,
        workflow_body: vec![
            Function::AtomicFunction {
                name: "newFunc".into(),
                typ: "data/rtes".into(),
                data_ins: None,
                data_outs: None,
                properties: None,
                constraints: None,
            },
            Function::AtomicFunction {
                name: "test".into(),
                typ: "rtes".into(),
                data_ins: None,
                data_outs: None,
                properties: None,
                constraints: None,
            },
        ],
        data_outs: None,
        sub_fcs: None,
    };
}
