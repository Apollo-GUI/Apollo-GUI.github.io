import { AlignVerticalJustifyCenter, Check, ChevronDownIcon, Circle, CircleDot, Copy, FunctionSquare, Github, Import, Info, MinusCircle, MoreHorizontal, Plus, PlusCircle, RotateCcw, Save, Settings, Split, Terminal, Trash2, TableProperties, X } from "lucide-react";
import { Orbit } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { ApolloNodeType } from "@/types";

export type Icon = LucideIcon;

export const NodeIcons:Record<ApolloNodeType, Icon> = {
  start: Circle,
  function: FunctionSquare,
  parallel: Copy,
  if: Split,
  while: RotateCcw,
  end: CircleDot,
}

export const Icons = {
  logo: Orbit,
  terminal: Terminal,
  close: X,
  trash: Trash2,
  settings: Settings,
  info: Info,
  add: Plus,
  remove: MinusCircle,
  save: Save,
  format: AlignVerticalJustifyCenter,
  options: MoreHorizontal,
  github: Github,
  import: Import,
  down: ChevronDownIcon,
  addCircle: PlusCircle,
  check: Check,
  properties: TableProperties,
};
