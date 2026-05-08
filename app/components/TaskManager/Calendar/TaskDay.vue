<script setup lang="ts">
import type { Task } from "~/types/task.types";
import { tasksService } from "~/services/tasks.service";
import { useTasksStore } from "~/stores/tasks.store";

//Usamos el store global de tasks
const tasksStore = useTasksStore();

//Estado para guardar las tareas
const tasks = ref<Task[]>([]);

//Estado para el manejo de la carga de datos
const isLoading = ref(false);

//Formateamos la fecha para poderla mostrar en la pantalla, es solo para mostrarla bonita
const formattedDate = computed(() => {
  //Verificamos que exista la fecha seleccionada
  if (!tasksStore.selectedDate) {
    return "";
  }

  //La formateamos en formato es-MX
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
  }).format(
    new Date(tasksStore.selectedDate),
  ); //creamos la fecha de string a Date
});

//Cargamos las tasks
const loadTasks = async () => {
  try {
    //Verificamos que existan las tasks
    if (!tasksStore.selectedDate) {
      tasks.value = [];

      return;
    }

    //Comenzamos estado de carga para mostrar
    isLoading.value = true;

    //Creamos una fecha con la fecha del estado
    const start = new Date(
      tasksStore.selectedDate,
    );

    //convertimos la fecha al inicio del dia
    start.setHours(0, 0, 0, 0);

    //Creamos la fecha de final
    const end = new Date(
      tasksStore.selectedDate,
    );

    //La convertimos al final del día: 23:59:59
    end.setHours(23, 59, 59, 999);

    //Las conversiones de fecha son solamente para que el filtro funcione,
    //ya que se usan dos fechas para comparar

    //Obtenemos las tasks entre el rango de fechas y de manera ascendente
    tasks.value = await tasksService.getAll({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      sort: "asc",
    });
  }
  catch (error) {
    console.error(error);
  }
  finally {
    isLoading.value = false;
  }
};

//Observamos si cambia la fecha se hace el load de tasks de nuevo
watch(
  () => tasksStore.selectedDate,
  () => {
    loadTasks();
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="mt-6">
    <!-- Header -->
    <div class="mb-6 text-center">
      <h2
        class="text-4xl font-semibold tracking-tight text-black capitalize"
      >
        {{ formattedDate }}
      </h2>

      <p class="mt-1 text-sm text-black/40">
        {{ tasks.length }}
        {{ tasks.length === 1 ? "tarea" : "tareas" }}
      </p>
    </div>

    <div
      v-if="isLoading"
      class="py-10 text-center text-sm text-black/40"
    >
      Cargando...
    </div>

    <!-- Empty state -->
    <div
      v-else-if="tasks.length === 0"
      class="rounded-3xl border border-dashed border-black/10 py-10 text-center"
    >
      <p class="text-sm text-black/40">
        No hay tareas para este dia
      </p>
    </div>

    <!-- Renderizamos las tasks -->
    <div
      v-else
      class="space-y-3"
    >
      <TaskCard
        v-for="task in tasks"
        :key="task._id"
        :task="task"
      />
    </div>
  </div>
</template>