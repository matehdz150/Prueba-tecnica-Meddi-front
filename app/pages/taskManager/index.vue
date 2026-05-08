<script setup lang="ts">
import { Plus } from "lucide-vue-next";
</script>

<template>
  <GPageContainer class="bg-[#faf5e3] h-full text-black">
    <!-- Separamos en dos columnas, la primera 70% de width y la segunda un 30% -->
    <div class="grid h-full grid-cols-[70%_30%]">
      <!-- Lado izquierdo, flex column -->
      <div class="border-black/10 p-6 flex flex-col gap-4">
        <TaskSearchbar />
        <TaskHero />
        <TaskStats />
        <TaskList />
      </div>
      <!-- Lado derecho -->
      <div class="p-6">
        <!-- Boton para crear task, solamente redirige -->
        <div class="mb-4 flex justify-end">
          <Button
            class="h-10 w-10 rounded-full bg-black p-0 text-white hover:bg-black/90"
            @click="navigateTo('/taskManager/new')"
          >
            <Plus class="h-4 w-4" />
          </Button>
        </div>
        <!-- Calendario y tasks del dia seleccionado, comparten estado de la fecha, manejo de fechas con string-->
        <TaskCalendar/>
        <TaskDay/>
      </div>
    </div>
  </GPageContainer>
</template>
