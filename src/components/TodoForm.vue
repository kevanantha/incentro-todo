<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { useAddTodoMutation, useUpdateTodoMutation } from "../hooks/use-todo";
import CardTitle from "./ui/card/CardTitle.vue";
import Card from "./ui/card/Card.vue";
import Button from "./ui/button/Button.vue";
import { Todo } from "../type";

const props = defineProps<{
  isEditMode?: boolean;
  editedTodo: Todo;
  resetForm: () => void;
}>();

const { editedTodo, isEditMode } = toRefs(props);

const input = ref("");
const mutationAddTodo = useAddTodoMutation();
const mutationUpdateTodo = useUpdateTodoMutation();
const inputRef = ref<HTMLInputElement | null>(null);

watch(mutationUpdateTodo.isSuccess, () => {
  props.resetForm();
});

watch(mutationAddTodo.isSuccess, () => {
  input.value = "";
});

watch(editedTodo, (newVal) => {
  if (newVal) {
    input.value = newVal.title;
    inputRef.value?.focus();
  }
});

const submitTodo = () => {
  mutationAddTodo.mutate(input.value);
};

const updateTodo = () => {
  mutationUpdateTodo.mutate({
    ...editedTodo.value,
    title: input.value,
  });
};
</script>

<template>
  <Card>
    <CardTitle>Create a todo</CardTitle>
    <form
      @submit.prevent="isEditMode ? updateTodo() : submitTodo()"
      class="flex gap-2 items-center"
    >
      <input
        ref="inputRef"
        placeholder="Todo name"
        type="text"
        v-model="input"
        class="flex h-8 w-full rounded-lg border px-3 py-1 text-sm shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      />
      <Button type="submit" :disabled="!input"
        >{{ isEditMode ? "Update" : "Add" }} todo</Button
      >
    </form>
  </Card>
</template>
