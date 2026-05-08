<script setup lang="ts">
import { useTasksStore } from "~/stores/tasks.store";

//Traemos el store
const store = useTasksStore();

//t=obtenemos las estadisticas despues de renderizar el componente con pina
onMounted(() => {
  store.fetchStats();
});
</script>

<template>
  <div class="mt-6 flex flex-col gap-4">
    <div class="flex gap-4">
      <LeftChart v-if="store.stats" :stats="store.stats" />

      <RightChart v-if="store.stats" :stats="store.stats" />
    </div>

    <div class="flex gap-4">
      <LeftBottomChart v-if="store.stats" :stats="store.stats" />

      <RightBottomChart v-if="store.stats" :stats="store.stats" />
    </div>
  </div>
</template>
