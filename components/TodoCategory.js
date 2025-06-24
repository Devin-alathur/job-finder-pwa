import { useState } from "react";
import { Circle, CheckCircle, GripVertical, Trash2, Pencil } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableTask({ task, index, onToggle, onDelete, id, onRename }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.text);

  const handleRename = () => {
    const trimmed = text.trim();
    if (trimmed && trimmed !== task.text) {
      onRename(index, trimmed);
    }
    setEditing(false);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-2 mb-2 shadow-sm"
    >
      <div className="flex items-center gap-2 w-full">
        <button {...listeners} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <GripVertical size={18} />
        </button>

        <div
          onClick={() => !editing && onToggle(index)}
          className="flex items-center gap-2 cursor-pointer flex-grow"
        >
          {task.done ? (
            <CheckCircle className="text-green-600" size={20} />
          ) : (
            <Circle className="text-pink-400" size={20} />
          )}
          {editing ? (
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              autoFocus
              className="flex-grow text-black dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600"
            />
          ) : (
            <span className={`${task.done ? "line-through text-gray-500" : "text-black dark:text-white"}`}>
              {task.text}
            </span>
          )}
        </div>

        <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Pencil size={16} />
        </button>

        <button onClick={() => onDelete(index)}>
          <Trash2 size={18} className="text-red-400 hover:text-red-600" />
        </button>
      </div>
    </li>
  );
}

export default function TodoCategory({ name, tasks, onDelete, onTasksChange, onRename }) {
  const [newTask, setNewTask] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [categoryName, setCategoryName] = useState(name);

  const addTask = () => {
    const trimmed = newTask.trim();
    if (!trimmed) return;
    const updated = [{ text: trimmed, done: false }, ...tasks];
    onTasksChange(updated);
    setNewTask("");
  };

  const toggleTask = (index) => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );
    onTasksChange(updated);
  };

  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    onTasksChange(updated);
  };

  const renameTask = (index, newText) => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, text: newText } : task
    );
    onTasksChange(updated);
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex((_, i) => i.toString() === active.id);
      const newIndex = tasks.findIndex((_, i) => i.toString() === over?.id);
      const reordered = arrayMove(tasks, oldIndex, newIndex);
      onTasksChange(reordered);
    }
  };

  const handleRenameCategory = () => {
    const trimmed = categoryName.trim();
    if (trimmed && trimmed !== name) {
      onRename(trimmed);
    }
    setIsEditingName(false);
  };

  return (
    <div className="bg-blue-100 dark:bg-grey-500 p-4 rounded-xl mb-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        {isEditingName ? (
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            onBlur={handleRenameCategory}
            onKeyDown={(e) => e.key === "Enter" && handleRenameCategory()}
            autoFocus
            className="text-xl font-semibold text-green-800 dark:text-white bg-transparent border-b border-green-400 focus:outline-none"
          />
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-grey-500 dark:text-grey-500">{categoryName}</h2>
            <button onClick={() => setIsEditingName(true)} className="text-green-600 hover:text-green-800 dark:hover:text-green-300">
              <Pencil size={16} />
            </button>
          </div>
        )}
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex mb-3">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={`Add a task to "${categoryName}"`}
          className="flex-1 p-2 border border-green-300 rounded-l-md text-black"
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-500"
        >
          Add
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-600 italic">No tasks yet</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map((_, i) => i.toString())}
            strategy={verticalListSortingStrategy}
          >
            <ul>
              {tasks.map((task, index) => (
                <SortableTask
                  key={index}
                  id={index.toString()}
                  index={index}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onRename={renameTask}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
