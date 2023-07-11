import { useReactFlow } from "reactflow";
import { EditorProps } from "./editor";
import { Icons } from "./icons";
import { Button } from "./ui/button";

export default function SaveButton({ selectedWorkflow }: EditorProps) {

    const {toObject} = useReactFlow()

  return (
    <Button
      size={"icon"}
      className="mb-4"
      onClick={() => {
        localStorage.setItem(
          selectedWorkflow.id,
          JSON.stringify({
            ...selectedWorkflow,
            lastSaved: new Date(),
            data: toObject(),
          })
        );
      }}
    >
      <Icons.save className="h-8 w-8" />
    </Button>
  );
}
