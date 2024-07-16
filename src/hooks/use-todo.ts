import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { fetcher } from "../utils/fetcher";
import { Todo, TodoStatus } from "../type";
import { Ref } from "vue";

type Respond<T> = {
  data: T;
  first: number;
  items: number;
  last: number;
  next: number | null;
  pages: number;
  prev: number | null;
};

type Pagination = {
  page?: number;
  perPage?: number;
};

export const useListTodoQuery = (
  filterStatus?: Ref<TodoStatus>,
  pagination?: Pagination
) => {
  return useQuery({
    queryKey: ["todos", filterStatus, pagination] as const,
    queryFn: async ({ queryKey }) => {
      const [, , pagination_] = queryKey;
      const { data } = await fetcher.get<Respond<Array<Todo>>>("/todos", {
        params: {
          _per_page: pagination_?.perPage || 100,
          _page: pagination_?.page || 1,
        },
      });

      return data;
    },
    select(data) {
      // Simulate filtering by status
      const data_ = data.data.filter((todo) => {
        if (filterStatus?.value === "Active") {
          return !todo.completed;
        }

        if (filterStatus?.value === "Completed") {
          return todo.completed;
        }

        return true;
      });

      return {
        ...data,
        data: data_,
      };
    },
  });
};

export const useAddTodoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: Todo["title"]) => {
      const { data } = await fetcher.post<Todo>("/todos", {
        title,
        completed: false,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};

export const useDeleteTodoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: Todo["id"]) => {
      await fetcher.delete(`/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};

export const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (todo: Todo) => {
      const { data } = await fetcher.put<Todo>(`/todos/${todo.id}`, todo);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};
