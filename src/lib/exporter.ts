import { Workflow } from "@/types";
import YAML from 'yaml'

export function exportApolloYaml(workflow: Workflow) {

  const graphObject={name:workflow.name, workflowBody: createWorkflowBody(workflow.data)}
  const file = new File(["\ufeff" + YAML.stringify(graphObject)], `${workflow.name}.yaml`, {
    type: "text/plain:charset=UTF-8",
  });

  const url = window.URL.createObjectURL(file);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  window.URL.revokeObjectURL(url);
}

function createWorkflowBody(workflowData: any){

  const workflowBody={} as any

  // const [edges] = useEdgesState(
  //   workflowData.edges 
  // );
  //

  const startNode = workflowData.nodes.find((n:any)=>n.type=='start')

  workflowBody['dataIns']=startNode?.data.dataOuts;

  return workflowBody
}
