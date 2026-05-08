<script setup lang="ts">
import type { Task } from "@/types/task.types";

import {
  ArrowUp,
  Equal,
  ArrowDown,
  EllipsisVertical,
  Pencil,
  Trash2,
} from "lucide-vue-next";

import {
  statusLabels,
} from "~/lib/utils";

import { useTasksStore } from "~/stores/tasks.store";

// props
defineProps<{
  task: Task;
}>();

const store = useTasksStore();

const isDropdownOpen = ref(false);

const priorityConfig = {
  HIGH: {
    icon: ArrowUp,
    color: "bg-[#f4b8db]",
  },

  MEDIUM: {
    icon: Equal,
    color: "bg-[#f7d568]",
  },

  LOW: {
    icon: ArrowDown,
    color: "bg-[#b5caee]",
  },
};

const handleDelete = async (id: string) => {
  await store.deleteTask(id);
};

const handleEdit = (id: string) => {
  navigateTo(`/taskManager/edit/${id}`);
};
</script>

<template>
  <div
    class="flex items-center justify-between rounded-2xl border border-black/5 bg-white px-4 py-3 transition hover:border-black/10"
  >
    <div
      class="flex flex-1 cursor-pointer items-center gap-3"
      @click="navigateTo(`/taskManager/edit/${task._id}`)"
    >
      <div
        class="flex h-8 w-8 items-center justify-center rounded-full"
        :class="priorityConfig[task.priority].color"
      >
        <component
          :is="priorityConfig[task.priority].icon"
          class="h-3.5 w-3.5 text-black"
        />
      </div>

      <div>
        <p class="text-sm font-medium text-black">
          {{ task.title }}
        </p>

        <p v-if="task.description" class="text-xs text-black/40">
          {{ task.description }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div
        class="rounded-full bg-black px-2 py-1 text-[10px] font-medium text-white"
      >
        {{ statusLabels[task.status] }}
      </div>

      <div class="relative">
        <button
          class="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/5"
          @click.stop="isDropdownOpen = !isDropdownOpen"
        >
          <EllipsisVertical class="h-4 w-4 text-black/60" />
        </button>
        <!--Si isDropdownOpen es true mostramos las opciones para editar y eliminar la task-->
        <div
          v-if="isDropdownOpen"
          class="absolute top-10 right-0 z-10 w-36 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-lg"
        >
          <button
            class="flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition hover:bg-black/5"
            @click.stop="handleEdit(task._id)"
          >
            <Pencil class="h-4 w-4" />

            Editar
          </button>

          <button
            class="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-black transition hover:bg-red-50"
            @click.stop="handleDelete(task._id)"
          >
            <Trash2 class="h-4 w-4" />

            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>