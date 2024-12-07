import { TodoList } from "@/components/todo-list";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f3f3f6] px-4 pb-8">
      <div className="mx-auto md:max-w-lg space-y-8 max-w-md sm:space-y-6">
        <TodoList />
      </div>
    </main>
  );
}
