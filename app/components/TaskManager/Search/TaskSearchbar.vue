<script setup lang="ts">
import { Search } from "lucide-vue-next";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useTasksStore } from "~/stores/tasks.store";

//Definimos props del componente
const props = defineProps<{
  placeholder?: string;
}>();

//Traemos el store
const store = useTasksStore();

//Creamos el model
const model = ref("");

//Observamos el model, cuando haya cambios se hace refetch con pinia
watch(model, (value) => {
  store.setSearch(value);
});
</script>

<template>
  <Popover :open="!!model">
    <PopoverTrigger as-child>
      <div class="flex items-center gap-2">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4b8db]"
        >
          <Search class="h-5 w-5 text-black" />
        </div>

        <div
          class="flex h-11 flex-1 items-center rounded-xl border border-black/50 bg-transparent px-4"
        >
          <input
            v-model="model"
            :placeholder="props.placeholder ?? 'Buscar tareas'"
            class="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
          />
        </div>
      </div>
    </PopoverTrigger>

    <PopoverContent
      align="start"
      class="mt-2 w-100 rounded-2xl border-black/10 bg-white p-2"
    >
      <TaskSearchResults
        :tasks="store.tasks"
        :loading="store.loading"
      />
    </PopoverContent>
  </Popover>
</template>