"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TodoItem } from "@/components/todo-item";
import { AddTodoDialog } from "@/components/add-todo-dialog";
import { CalendarStrip } from "@/components/calendar-strip";
import { type Todo } from "@/lib/types";
import { format } from "date-fns/format";

export function TodoList() {
    const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      const savedTodos = localStorage.getItem("todos");
      return savedTodos ? JSON.parse(savedTodos) : [];
    }
    return [];
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo: Todo) => {
    todo.date = String(selectedDate);
    setTodos([...todos, todo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const editTodo = (id: string, title: string, description: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title, description } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const formattedDate2 = new Date(selectedDate).toLocaleDateString("en-CA");
  const todosForSelectedDate = todos.filter(
    (todo) =>
      new Date(todo.date).toLocaleDateString("en-CA") === formattedDate2
  );

  return (
    <div className="space-y-4">
      <CalendarStrip handleSave={(date) => {
        if (date.startValue !== null) {
          setSelectedDate(date.startValue); 
        }
      }} />
      <div className="space-y-5 font-bold text-xl">
        {new Date().toLocaleDateString("en-CA") === formattedDate2
          ? "Today"
          : format(new Date(formattedDate2), "EEE, dd")}
      </div>
      <div className="space-y-4">
        {todosForSelectedDate.length > 0 ? (
          todosForSelectedDate.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onEdit={editTodo}
              onDelete={deleteTodo}
            />
          ))
        ) : (
          <p className="text-center text-md italic text-black">
            No tasks yet—add one and make the day count!
          </p>
        )}
      </div>
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => setIsAddDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Task
      </Button>
      <AddTodoDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={addTodo}
      />
    </div>
  );
}
