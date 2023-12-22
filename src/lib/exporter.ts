import { Workflow } from "@/types";

import { convert_to_wf_yaml } from "../../wf-exporter/pkg";

export function exportApolloYaml(workflow: Workflow) {
  const result = convert_to_wf_yaml(workflow);

  const file = new File(["\ufeff" + result], `${workflow.name}.yaml`, {
    type: "text/plain:charset=UTF-8",
  });

  const url = window.URL.createObjectURL(file);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  window.URL.revokeObjectURL(url);
}

