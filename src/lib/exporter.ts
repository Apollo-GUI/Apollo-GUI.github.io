import { convert_to_wf_yaml } from "../../wf-exporter/pkg";

export function exportApolloYaml(workflow: { name: string; data: any }) {
  console.log(workflow);
  let result = "";
  try {
    result = convert_to_wf_yaml(workflow);
  } catch (e) {
    alert("Could not export workflow. Check console for more detailed error.");
  }

  if (result.length == 0) return;

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

export function downloadGraph(workflow: { name: string; data: any }) {
  const result = JSON.stringify(workflow);

  if (result.length == 0) return;

  const file = new File(["\ufeff" + result], `${workflow.name}.json`, {
    type: "text/plain:charset=UTF-8",
  });

  const url = window.URL.createObjectURL(file);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  window.URL.revokeObjectURL(url);
}
