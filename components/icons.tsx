import { Circle, CircleDot, Cog, Copy, FunctionSquare, Info, Minus, MinusCircle, Plus, RotateCcw, Settings, Split, Trash2, X } from "lucide-react";
import { Orbit } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { ApolloNodeType } from "../src/types";

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
  close: X,
  trash: Trash2,
  settings: Settings,
  info: Info,
  add: Plus,
  remove: MinusCircle,
};
