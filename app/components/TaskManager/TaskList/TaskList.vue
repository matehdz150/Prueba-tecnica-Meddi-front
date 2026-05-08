<script setup lang="ts">
import { useTasksStore } from "~/stores/tasks.store";

//traemos el store
const store = useTasksStore();

//Hacemos fetch de las tasks desde pinia
onMounted(() => {
  store.fetchTasks();
});
</script>

<template>
  <div class="mt-6">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-black">
          Tareas
        </h2>

        <p class="text-sm text-black/40">
          Organiza y visualiza tus tareas
        </p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Boton de agrupar -->
        <Button
          class="rounded-full bg-black text-white"
          @click="
            store.isGrouped
              ? store.fetchTasks()
              : store.fetchGroupedTasks()
          "
        >
          {{
            store.isGrouped
              ? "Vista normal"
              : "Agrupar"
          }}
        </Button>

        <!-- Filtros -->
        <TaskFilters
          :set-priority="store.setPriority"
          :set-sort="store.setSort"
        />
      </div>
    </div>

    <!-- Agrupadas -->
    <TaskGroupedList
      v-if="
        store.isGrouped &&
        store.groupedTasks
      "
      :tasks="store.groupedTasks"
      @deleted="store.fetchGroupedTasks"
    />

    <!-- Normales -->
    <div
      v-else-if="store.tasks.length"
      class="space-y-2"
    >
      <TaskCard
        v-for="task in store.tasks"
        :key="task._id"
        :task="task"
        @deleted="store.fetchTasks"
      />
    </div>

    <!-- Empty -->
    <TaskEmptyState
      v-else
      title="No hay tareas"
      description="Crea una nueva tarea para comenzar."
    />
  </div>
</template>