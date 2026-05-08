<script setup lang="ts">
import type {
  GroupedTasks,
} from "~/types/task.types";
import {
  priorityLabels,
} from "~/lib/utils";

//Definimos propiedad del componente para recibir las GroupedTasks
defineProps<{
  tasks: GroupedTasks;
}>();
</script>

<template>
  <div class="space-y-6">
    <!--Mostramos por cada prioridad sus tasks usando el type definido en "~/types/task.types"-->
    <div
      v-for="(items, priority) in tasks"
      :key="priority"
      class="space-y-2"
    >
      <!-- Header -->
      <div class="mb-2 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-black">
          {{ priorityLabels[priority] }}
        </h3>

        <span class="text-xs text-black/40">
          {{ items.length }} tareas
        </span>
      </div>

      <!-- Tasks -->
      <div
        v-if="items.length"
        class="space-y-2"
      >
       <!-- renderizamos cada task-->
        <TaskCard
          v-for="task in items"
          :key="task._id"
          :task="task"
        />
      </div>

      <!-- Si no hay tasks en un grupo mostramos el empty state -->
      <TaskEmptyState
        v-else
        title="No hay tareas"
        description="No existen tareas en este grupo."
      />
    </div>

  </div>
</template>