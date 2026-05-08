<script setup lang="ts">
import type { Priority, Status, Task } from "~/types/task.types";
import { tasksService } from "~/services/tasks.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { LoaderCircle, ArrowLeft, CalendarIcon } from "lucide-vue-next";

//Store de tasks
const store = useTasksStore();

//Estado de carga
const loading = ref(false);

//Estado del formulario
const form = reactive<Partial<Task>>({
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "PENDING",
});

//Estado para la fecha del calendario
const selectedDate = ref();

//Observador para cmabios en selected date
watch(selectedDate, (value) => {
  if (!value) {
    //verificamos que exista selecteddate, si no lo limpiamos
    form.dueDate = "";
    return;
  }

  //Convertimos la fecha a formato ISO (YYYY-MM-DD) para guardarla en el formulario
  const year = value.year;// obtenemos el año

  //obtenemos el mes de la fecha y lo hacemos string
  const month = String(
    value.month + 1,
  ).padStart(2, "0");//agrega un 0 si solo hay un caracter

  //obtenemos el dia y lo hacemos string
  const day = String(
    value.day,
  ).padStart(2, "0");

  //formateamos manualmete la fecha
  form.dueDate =
    `${year}-${month}-${day}`;
});

//Crear task usando Pinia
async function createTask() {
  try {

    await store.createTask({
      title: form.title,
      description: form.description,
      priority: form.priority,
      status: form.status,
      dueDate:
        form.dueDate || undefined,
    });
    navigateTo("/taskManager");
  }

  catch (error) {
    console.error(error);
  }

}
</script>

<template>
  <GPageContainer class="h-full bg-[#faf5e3] text-black">
    <Button class="mb-6 w-fit rounded-full px-3 bg-black text-white hover:bg-black/5"
      @click="navigateTo('/taskManager')">
      <ArrowLeft class="mr-2 h-4 w-4" />

      Volver
    </Button>
    <div class="mx-auto flex max-w-3xl w-full flex-col">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight">Crear nueva tarea</h1>

        <p class="mt-2 text-sm text-black/50">
          Completa la información de la tarea
        </p>
      </div>

      <!-- Formulario -->
      <div class="space-y-5">
        <div class="space-y-2">
          <Label> Título </Label>

          <Input v-model="form.title" placeholder="Ej. Terminar dashboard"
            class="h-11 rounded-2xl border-black/10 bg-white" />
        </div>

        <div class="space-y-2">
          <Label> Descripción </Label>

          <Textarea v-model="form.description" placeholder="Describe la tarea..."
            class="min-h-30 rounded-2xl border-black/10 bg-white">
            </Textarea>
        </div>

        <div class="flex gap-10">
          <div class="space-y-2">
            <Label> Prioridad </Label>

            <Select v-model="form.priority">
              <SelectTrigger class="h-11 rounded-2xl border-black/10 bg-white">
                <SelectValue placeholder="Selecciona prioridad" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="LOW"> Baja </SelectItem>

                <SelectItem value="MEDIUM"> Media </SelectItem>

                <SelectItem value="HIGH"> Alta </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label> Estado </Label>

            <Select v-model="form.status">
              <SelectTrigger class="h-11 rounded-2xl border-black/10 bg-white">
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="PENDING"> Pendiente </SelectItem>

                <SelectItem value="COMPLETED"> Completada </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="space-y-2">
          <Label> Fecha límite </Label>

          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline"
                class="h-11 w-full justify-start rounded-2xl border-black/10 bg-white text-left font-normal">
                <CalendarIcon class="mr-2 h-4 w-4" />

                {{ form.dueDate || "Selecciona una fecha" }}
              </Button>
            </PopoverTrigger>

            <PopoverContent class="w-auto p-0">
              <Calendar v-model="selectedDate" />
            </PopoverContent>
          </Popover>
        </div>

        <!-- Boton para hacer submit del formulario -->
        <Button :disabled="loading || !form.title"
          class="mt-4 h-11 rounded-2xl bg-black px-6 text-white hover:bg-black/90" @click="createTask">
          <LoaderCircle v-if="loading" class="mr-2 h-4 w-4 animate-spin" />

          Crear tarea
        </Button>
      </div>
    </div>
  </GPageContainer>
</template>
