<script setup lang="ts">
import type {
  Task,
} from "~/types/task.types";

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

import {
  LoaderCircle,
  ArrowLeft,
  CalendarIcon,
} from "lucide-vue-next";

const route = useRoute();

//traemos el store de tasks
const store = useTasksStore();

//Obtenemos el id de la task a editar
const taskId = route.params.id as string;

//Estado de carga
const loading = ref(false);

//Estado de carga para obtener la task inicial
const fetchingTask = ref(true);

//Estado de la fecha del calendario
const selectedDate = ref();

//Formulario reactivo
const form = reactive<Partial<Task>>({
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "PENDING",
  dueDate: "",
});

//Observador para cambios en selectedDate
watch(selectedDate, (value) => {
  if (!value) {
    form.dueDate = "";

    return;
  }

  //Obtenemos año, mes y dia
  const year = value.year;

  const month = String(
    value.month,
  ).padStart(2, "0");

  const day = String(
    value.day,
  ).padStart(2, "0");

  //Formateamos manualmente YYYY-MM-DD
  form.dueDate =
    `${year}-${month}-${day}`;
});

async function fetchTask() {
  try {
    fetchingTask.value = true;

    //Obtenemos la task
    const task = await tasksService.getById(taskId);

    //Llenamos el formulario
    form.title = task.title;
    form.description = task.description;
    form.priority = task.priority;
    form.status = task.status;

    //Verificamos si existe dueDate
    if (task.dueDate) {
      //Guardamos la fecha en el formulario
      form.dueDate =
        task.dueDate.split("T")[0] || "";
    }
  }
  catch (error) {
    console.error(error);
  }
  finally {
    fetchingTask.value = false;
  }
}

async function updateTask() {
  try {
    loading.value = true;

    //Actualizamos la task
    await store.updateTask(taskId, {
      title: form.title,
      description: form.description,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || undefined,
    });

    //Redireccionamos
    navigateTo("/taskManager");
  }
  catch (error) {
    console.error(error);
  }
  finally {
    loading.value = false;
  }
}

//Al montar el componente obtenemos la task
onMounted(() => {
  fetchTask();
});
</script>

<template>
  <GPageContainer class="h-full bg-[#faf5e3] text-black">
    <Button
      class="mb-6 w-fit rounded-full bg-black px-3 text-white hover:bg-black/80"
      @click="navigateTo('/taskManager')"
    >
      <ArrowLeft class="mr-2 h-4 w-4" />

      Volver
    </Button>

    <div class="mx-auto flex max-w-3xl w-full flex-col">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight">
          Editar tarea
        </h1>

        <p class="mt-2 text-sm text-black/50">
          Actualiza la información de la tarea
        </p>
      </div>

      <!-- Loading -->
      <div
        v-if="fetchingTask"
        class="flex items-center gap-2 text-sm text-black/50"
      >
        <LoaderCircle class="h-4 w-4 animate-spin" />

        Cargando tarea...
      </div>

      <!-- Formulario -->
      <div
        v-else
        class="space-y-5"
      >
        <div class="space-y-2">
          <Label>
            Título
          </Label>

          <Input
            v-model="form.title"
            placeholder="Ej. Terminar dashboard"
            class="h-11 rounded-2xl border-black/10 bg-white"
          />
        </div>

        <div class="space-y-2">
          <Label>
            Descripción
          </Label>

          <Textarea
            v-model="form.description"
            placeholder="Describe la tarea..."
            class="min-h-30 rounded-2xl border-black/10 bg-white"
          />
        </div>

        <div class="flex gap-10">
          <div class="space-y-2">
            <Label>
              Prioridad
            </Label>

            <Select v-model="form.priority">
              <SelectTrigger
                class="h-11 rounded-2xl border-black/10 bg-white"
              >
                <SelectValue placeholder="Selecciona prioridad" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="LOW">
                  Baja
                </SelectItem>

                <SelectItem value="MEDIUM">
                  Media
                </SelectItem>

                <SelectItem value="HIGH">
                  Alta
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>
              Estado
            </Label>

            <Select v-model="form.status">
              <SelectTrigger
                class="h-11 rounded-2xl border-black/10 bg-white"
              >
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="PENDING">
                  Pendiente
                </SelectItem>

                <SelectItem value="COMPLETED">
                  Completada
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Fecha -->
        <div class="space-y-2">
          <Label>
            Fecha límite
          </Label>

          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                class="h-11 w-full justify-start rounded-2xl border-black/10 bg-white text-left font-normal"
              >
                <CalendarIcon class="mr-2 h-4 w-4" />

                {{
                  form.dueDate ||
                  "Selecciona una fecha"
                }}
              </Button>
            </PopoverTrigger>

            <PopoverContent class="w-auto p-0">
              <Calendar v-model="selectedDate" />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          :disabled="loading || !form.title"
          class="mt-4 h-11 rounded-2xl bg-black px-6 text-white hover:bg-black/90"
          @click="updateTask"
        >
          <LoaderCircle
            v-if="loading"
            class="mr-2 h-4 w-4 animate-spin"
          />

          Guardar cambios
        </Button>
      </div>
    </div>
  </GPageContainer>
</template>