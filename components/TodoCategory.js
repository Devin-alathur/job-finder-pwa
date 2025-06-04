import { useState } from "react";
import { Circle, CheckCircle, GripVertical, Trash2 } from "lucide-react";
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

function SortableTask({ task, index, onToggle, onDelete, id }) {
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

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center justify-between bg-white rounded-lg p-2 mb-2 shadow-sm"
    >
      <div className="flex items-center gap-2 w-full">
        {/* Drag handle */}
        <button {...listeners} className="text-gray-400 hover:text-gray-600">
          <GripVertical size={18} />
        </button>

        {/* Toggle Task */}
        <div
          onClick={() => onToggle(index)}
          className="flex items-center gap-2 cursor-pointer flex-grow"
        >
          {task.done ? (
            <CheckCircle className="text-green-600" size={20} />
          ) : (
            <Circle className="text-gray-400" size={20} />
          )}
          <span
            className={`${
              task.done ? "line-through text-gray-500" : "text-black"
            }`}
          >
            {task.text}
          </span>
        </div>

        {/* Delete */}
        <button onClick={() => onDelete(index)}>
          <Trash2 size={18} className="text-red-400 hover:text-red-600" />
        </button>
      </div>
    </li>
  );
}

export default function TodoCategory({ name, tasks, onDelete, onTasksChange }) {
  const [newTask, setNewTask] = useState("");

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

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex((t, i) => i.toString() === active.id);
      const newIndex = tasks.findIndex((t, i) => i.toString() === over?.id);
      const reordered = arrayMove(tasks, oldIndex, newIndex);
      onTasksChange(reordered);
    }
  };

  return (
    <div className="bg-green-100 p-4 rounded-xl mb-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-green-800">{name}</h2>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <Trash2 size={20} />
        </button>
      </div>

      {/* New Task Input */}
      <div className="flex mb-3">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={`Add a task to "${name}"`}
          className="flex-1 p-2 border border-green-300 rounded-l-md text-black"
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button
          onClick={addTask}
          className="bg-green-600 text-white px-4 rounded-r-md hover:bg-green-700"
        >
          Add
        </button>
      </div>

      {/* Tasks List with Drag and Drop */}
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
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
