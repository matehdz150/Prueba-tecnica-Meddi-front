<script setup lang="ts">
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";

import { Calendar } from "@/components/ui/calendar";
import { useTasksStore } from "~/stores/tasks.store";

//usamos taskstore
const store = useTasksStore();

//Estado interno del calendar
const internalDate = ref();

//Observamos cambios del calendario
watch(
  internalDate,
  (value) => {
    if (!value) {
      return;
    }

    const year = value.year;

    const month = String(
      value.month,
    ).padStart(2, "0");

    const day = String(
      value.day,
    ).padStart(2, "0");

    //Actualizamos fecha global formateado manualmente
    store.setSelectedDate(
      `${year}-${month}-${day}`,
    );
  },
  {
    immediate: true,
  },
);

//Fecha actual
const currentDate = computed(() => {
  return store.selectedDate
    ? new Date(store.selectedDate)
    : new Date();
});

//Mes formateado
const formattedMonth = computed(() => {
  return currentDate.value.toLocaleDateString(
    "es-MX",
    {
      month: "long",
      year: "numeric",
    },
  );
});

//Mes anterior
const previousMonth = () => {
  const newDate = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1,
  );

  store.setSelectedDate(
    newDate.toISOString().split("T")[0] || "",
  );
};

//Mes siguiente
const nextMonth = () => {
  const newDate = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1,
  );

  store.setSelectedDate(
    newDate.toISOString().split("T")[0] || "",
  );
};
</script>

<template>
  <div class="rounded-3xl bg-[#faf5e3] p-6">
    <div class="mb-4 flex items-center justify-between">
      <button
        class="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/5"
        @click="previousMonth"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>

      <div
        class="rounded-full bg-[#f4b8db] px-4 py-1 text-sm font-medium capitalize"
      >
        {{ formattedMonth }}
      </div>

      <button
        class="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/5"
        @click="nextMonth"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>

    <!--Calendario de shadcn-->
    <Calendar
      v-model="internalDate"
      class="rounded-2xl border-none bg-transparent"
    />
  </div>
</template>