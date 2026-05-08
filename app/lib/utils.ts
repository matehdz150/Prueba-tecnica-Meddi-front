import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type {
  Priority,
  Status,
} from "~/types/task.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Helper para traducir los dias al español
export function translateDay(day: string) {
  const daysMap: Record<string, string> = {
    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miércoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sábado",
    Sunday: "Domingo",
  };

  return daysMap[day] || day;
}


export const priorityLabels: Record<
  Priority,
  string
> = {
  HIGH: "Alta",
  MEDIUM: "Media",
  LOW: "Baja",
};

export const statusLabels: Record<
  Status,
  string
> = {
  COMPLETED: "Completada",
  PENDING: "Pendiente",
};