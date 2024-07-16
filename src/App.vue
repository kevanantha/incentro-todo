<script setup lang="ts">
import { ref } from "vue";
import TodoForm from "./components/TodoForm.vue";
import TodoList from "./components/TodoList.vue";
import { Todo, TodoStatus } from "./type";
import Button from "./components/ui/button/Button.vue";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { TODO_STATUS } from "./utils/constants";

const isEditMode = ref(false);
const editedTodo = ref<Todo>({
  id: 0,
  title: "",
  completed: false,
});
const filterStatus = ref<TodoStatus>("All");

const onEditTodo = (todo: Todo) => {
  isEditMode.value = true;
  editedTodo.value = todo;
};

const resetForm = () => {
  isEditMode.value = false;
  editedTodo.value = {
    id: 0,
    title: "",
    completed: false,
  };
};
</script>

<template>
  <div class="p-10 flex flex-col items-center justify-center gap-7">
    <div class="flex flex-col gap-3">
      <TodoForm :isEditMode :editedTodo :resetForm />
      <div class="w-xl flex gap-2">
        <template v-for="status in TODO_STATUS" :key="status">
          <Button
            :className="`!rounded-full ${
              filterStatus === status ? '!bg-black !text-white' : null
            }`"
            variant="outline"
            size="sm"
            @click="() => (filterStatus = status)"
            >{{ status }}</Button
          >
        </template>
      </div>
    </div>
    <TodoList :filterStatus @editTodo="onEditTodo" />
  </div>
  <VueQueryDevtools />
</template>
