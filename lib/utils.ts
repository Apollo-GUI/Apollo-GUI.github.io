import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const WORKFLOW_KEY_PREFIX="wf_"

export function uuidv4() {
  return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, c =>
    (Number(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(c) / 4).toString(16)
  );
}

export function getDateTimeString(date:Date|string){
  if(typeof date ==="string")
  date = new Date(date);
  return date.toLocaleDateString()+" "+date.toLocaleTimeString()
}