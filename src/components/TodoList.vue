<script setup lang="ts">
import {
  useListTodoQuery,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "../hooks/use-todo";
import Card from "./ui/card/Card.vue";
import CardTitle from "./ui/card/CardTitle.vue";
import Button from "./ui/button/Button.vue";
import { TodoStatus } from "../type";
import { computed, toRefs } from "vue";

const props = defineProps<{
  filterStatus: TodoStatus;
}>();

const { filterStatus } = toRefs(props);

const queryListTodos = useListTodoQuery(filterStatus);
const mutationDeleteTodo = useDeleteTodoMutation();
const mutationUpdateTodo = useUpdateTodoMutation();
const title = computed(() => {
  switch (filterStatus.value) {
    case "Active":
      return "Active";
    case "Completed":
      return "Completed";
    default:
      return "Inbox";
  }
});
</script>

<template>
  <Card>
    <CardTitle>{{ title }}</CardTitle>
    <div v-if="queryListTodos.isLoading.value">Loading todos...</div>
    <div
      v-else-if="
        !queryListTodos.isLoading.value &&
        (queryListTodos.data?.value?.data?.length || 0) <= 0
      "
    >
      No todos
    </div>
    <template v-else>
      <div v-for="todo in queryListTodos.data.value?.data" :key="todo.id">
        <div
          class="flex gap-4 border-b border-b-gray-2 justify-between items-center"
        >
          <p :class="`py-3 ${todo.completed ? 'line-through' : null}`">
            {{ todo.title }}
          </p>
          <div class="flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              @click="
                () => {
                  if (todo.completed) {
                    mutationUpdateTodo.mutate({ ...todo, completed: false });
                  } else {
                    mutationUpdateTodo.mutate({ ...todo, completed: true });
                  }
                }
              "
            >
              {{ todo.completed ? "Uncomplete" : "Complete" }}
            </Button>
            <Button
              size="sm"
              @click="$emit('edit-todo', todo)"
              :disabled="todo.completed"
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              @click="() => mutationDeleteTodo.mutate(todo.id)"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>
