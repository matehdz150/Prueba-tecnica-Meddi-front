import { defineStore } from "pinia";

import type {
  GroupedTasks,
  Priority,
  Task,
  TaskQuery,
  TaskStats,
} from "~/types/task.types";

import { tasksService } from "~/services/tasks.service";

export const useTasksStore = defineStore("tasks", () => {
  //Tasks normales
  const tasks = ref<Task[]>([]);

  //Tasks agrupadas
  const groupedTasks = ref<GroupedTasks | null>(null);

  //Estado de agrupacion
  const isGrouped = ref(false);

  //Estado de estadisticas
  const stats = ref<TaskStats | null>(null);

  //Fecha seleccionada del calendario
  const selectedDate = ref<string>(
    new Date().toISOString().split("T")[0] || "",
  );

  //Filtros
  const filters = reactive<TaskQuery>({
    sort: "desc",
    search: "",
  });

  //Estado de carga
  const loading = ref(false);

  //Obtener tasks normales
  async function fetchTasks() {
    try {
      loading.value = true;

      isGrouped.value = false;

      tasks.value = await tasksService.getAll(filters);
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }

  //Obtener tasks agrupadas
  async function fetchGroupedTasks() {
    try {
      loading.value = true;

      isGrouped.value = true;

      groupedTasks.value = await tasksService.getGroupedByPriority();
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }

  //obtener estadisticas
  async function fetchStats() {
    try {
      loading.value = true;

      stats.value = await tasksService.getStats();
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }

  //Borrar una task
  async function deleteTask(id: string) {
    try {
      loading.value = true;

      await tasksService.delete(id);

      // quitamos la task localmente
      tasks.value = tasks.value.filter((task) => task._id !== id);

      // si estamos agrupados volvemos a obtenerlas
      if (isGrouped.value) {
        await fetchGroupedTasks();
      }

      // actualizamos stats
      await fetchStats();
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }

  //Crear task
  async function createTask(task: Partial<Task>) {
    try {
      loading.value = true;

      const createdTask = await tasksService.create(task);

      // agregamos la task localmente
      tasks.value.unshift(createdTask);

      // actualizamos stats
      await fetchStats();

      return createdTask;
    } catch (error) {
      console.error(error);

      throw error;
    } finally {
      loading.value = false;
    }
  }

  //Actualizar una task
  async function updateTask(id: string, taskData: Partial<Task>) {
    try {
      loading.value = true;

      const updatedTask = await tasksService.update(id, taskData);

      //Actualizamos la task localmente
      tasks.value = tasks.value.map((task) =>
        task._id === id ? updatedTask : task,
      );

      //Si estamos agrupados refrescamos
      if (isGrouped.value) {
        await fetchGroupedTasks();
      }

      //Actualizamos stats
      await fetchStats();

      return updatedTask;
    } catch (error) {
      console.error(error);

      throw error;
    } finally {
      loading.value = false;
    }
  }

  //Cambiar prioridad
  function setPriority(priority?: Priority) {
    filters.priority = priority;

    fetchTasks();
  }

  //Cambiar orden
  function setSort(sort: "asc" | "desc") {
    filters.sort = sort;

    fetchTasks();
  }

  function setSearch(search: string) {
    filters.search = search;

    fetchTasks();
  }

  //Cambiar fecha seleccionada
  function setSelectedDate(date: string) {
    selectedDate.value = date;
  }

  return {
    tasks,
    groupedTasks,
    isGrouped,
    selectedDate,
    filters,
    loading,

    fetchTasks,
    fetchGroupedTasks,
    fetchStats,
    deleteTask,
    createTask,
    updateTask,

    setPriority,
    setSort,
    setSelectedDate,
    setSearch,
    stats,
  };
});
