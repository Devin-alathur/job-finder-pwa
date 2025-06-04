import { useState, useEffect } from "react";
import TodoCategory from "@/components/TodoCategory";
import NavBar from "../components/NavBar";

export default function TodoPage() {
  const STORAGE_KEY = "todo_categories_with_tasks";
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load categories and tasks from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCategories(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save categories and tasks to localStorage whenever categories change
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
      } catch (error) {
        console.error("Error saving categories:", error);
      }
    }
  }, [categories, loaded]);

  // Add a new category with empty tasks
  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.some((c) => c.name === trimmed)) {
      setCategories([{ name: trimmed, tasks: [] }, ...categories]);
      setNewCategory("");
    }
  };

  // Delete a category by index
  const deleteCategory = (index) => {
    const categoryToDelete = categories[index];
    const confirmDelete = confirm(`Delete category "${categoryToDelete.name}"?`);
    if (confirmDelete) {
      const updated = [...categories];
      updated.splice(index, 1);
      setCategories(updated);
    }
  };

  // Update tasks inside a category
  const updateCategoryTasks = (categoryName, newTasks) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === categoryName ? { ...cat, tasks: newTasks } : cat
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">To Do App - By Devin</h1>

        {/* Add Category */}
        <div className="flex mb-6">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category (e.g., Work)"
            className="flex-1 p-2 border border-blue-400 rounded-l-md text-black"
          />
          <button
            onClick={addCategory}
            className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-green-600"
          >
            Add Category
          </button>
        </div>

        {/* Wait until localStorage has loaded */}
        {!loaded ? (
          <p className="text-gray-500">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-600 italic">No categories yet</p>
        ) : (
          categories.map((category, index) => (
            <TodoCategory
              key={category.name}
              name={category.name}
              tasks={category.tasks}
              onDelete={() => deleteCategory(index)}
              onTasksChange={(newTasks) => updateCategoryTasks(category.name, newTasks)}
            />
          ))
        )}
      </div>
    </div>
  );
}
