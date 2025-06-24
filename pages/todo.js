import { useState, useEffect } from "react";
import TodoCategory from "@/components/TodoCategory";
import NavBar from "../components/NavBar";
import FloatingLottie from "@/components/FloatingLottie";

export default function TodoPage() {
  const STORAGE_KEY = "todo_categories_with_tasks";
  const DARK_MODE_KEY = "dark_mode_enabled";

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCategories(parsed);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }

    const savedDark = localStorage.getItem(DARK_MODE_KEY);
    setDarkMode(savedDark === "true");

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
      } catch (error) {
        console.error("Error saving categories:", error);
      }
    }
  }, [categories, loaded]);

  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, darkMode);
  }, [darkMode]);

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.some((c) => c.name === trimmed)) {
      setCategories([{ name: trimmed, tasks: [] }, ...categories]);
      setNewCategory("");
    }
  };

  const deleteCategory = (index) => {
    const categoryToDelete = categories[index];
    const confirmDelete = confirm(`Delete category "${categoryToDelete.name}"?`);
    if (confirmDelete) {
      const updated = [...categories];
      updated.splice(index, 1);
      setCategories(updated);
    }
  };

  const updateCategoryTasks = (categoryName, newTasks) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === categoryName ? { ...cat, tasks: newTasks } : cat
      )
    );
  };

  const renameCategory = (index, newName) => {
    const updated = [...categories];
    updated[index].name = newName;
    setCategories(updated);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen transition-colors`}>
      <NavBar />

      {/* Toggle Switch UI */}
      <div className="max-w-2xl mx-auto flex justify-end px-4 pt-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
            darkMode ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
              darkMode ? "translate-x-7" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex justify-center items-center ">
       <div className="w-40 h-40">
        <FloatingLottie/>
       </div>
      </div>
      


      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-500">To Do App - By Devin</h1>

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
              onRename={(newName) => renameCategory(index, newName)}
            />
          ))
        )}
      </div>
    </div>
  );
}
