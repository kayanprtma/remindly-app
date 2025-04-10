"use client";

import { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import PageContainer from "./templates/PageContainer";
import Typography from "./atoms/Typography";
import TaskList from "./organisms/TaskList";
import TaskControls from "./organisms/TaskControls";
import { formatTime } from "./utils/timeUtils";
import {
  requestNotificationPermissions,
  scheduleNotification,
} from "./utils/notificationUtils";

// Task interface
interface Task {
  id: string;
  name: string;
  duration: number; // in seconds
  timeRemaining: number; // in seconds
  isActive: boolean;
}

export default function TasksScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Request notification permissions
  useEffect(() => {
    (async () => {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          "Permission required",
          "Please allow notifications to receive task alerts."
        );
      }
    })();
  }, []);

  // Handle timer logic
  useEffect(() => {
    if (activeTaskId) {
      timerRef.current = setInterval(() => {
        setTasks((prevTasks) => {
          // Find the current active task and its index
          const currentIndex = prevTasks.findIndex(
            (t) => t.id === activeTaskId
          );
          if (currentIndex === -1) return prevTasks;

          const activeTask = prevTasks[currentIndex];
          const newTimeRemaining = activeTask.timeRemaining - 1;

          // If timer reaches zero
          if (newTimeRemaining <= 0) {
            clearInterval(timerRef.current!);

            // Create a new array without the completed task
            const updatedTasks = prevTasks.filter((t) => t.id !== activeTaskId);

            // Find the next task (which will be at index 0 after removal if available)
            const nextTask = updatedTasks.length > 0 ? updatedTasks[0] : null;

            // Send notification
            if (nextTask) {
              scheduleNotification(
                `${activeTask.name} is completed!`,
                `Starting next task: ${nextTask.name}`
              );

              // Auto-start the next task after a short delay
              setTimeout(() => {
                setActiveTaskId(nextTask.id);
              }, 500);
            } else {
              scheduleNotification(
                "All tasks completed!",
                "You have completed all your tasks."
              );
              setActiveTaskId(null);
            }

            // Return the updated tasks array without the completed task
            return updatedTasks;
          }

          // Just update the time for the active task
          return prevTasks.map((task) => {
            if (task.id === activeTaskId) {
              return { ...task, timeRemaining: newTimeRemaining };
            }
            return task;
          });
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeTaskId]);

  // Add a new task
  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: `Task ${tasks.length + 1}`,
      duration: 5, // set timer static
      timeRemaining: 5,
      isActive: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Toggle play/pause for a task
  const togglePlayPause = (taskId: string) => {
    if (activeTaskId === taskId) {
      // Pause the current task
      setActiveTaskId(null);
    } else {
      // If another task is active, pause it first
      if (activeTaskId) {
        setActiveTaskId(null);
      }

      // Start the selected task
      setActiveTaskId(taskId);
    }
  };

  // Update task status when activeTaskId changes
  useEffect(() => {
    if (activeTaskId) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          isActive: task.id === activeTaskId,
        }))
      );
    }
  }, [activeTaskId]);

  return (
    <PageContainer>
      <Typography
        variant="subheader"
        style={{ marginBottom: 30, marginTop: 40 }}
      >
        {tasks.length === 0
          ? `Add your first task ${name || "Lorem ipsum"}!`
          : `This is your task ${name || "Lorem ipsum"}!`}
      </Typography>

      {tasks.length > 0 && (
        <TaskList
          tasks={tasks}
          formatTime={formatTime}
          onTaskPress={togglePlayPause}
          activeTaskId={activeTaskId}
        />
      )}

      <TaskControls
        onAddTask={addTask}
        onTogglePlayPause={() =>
          togglePlayPause(activeTaskId || (tasks.length > 0 ? tasks[0].id : ""))
        }
        isPlaying={!!activeTaskId}
        hasActiveTasks={tasks.length > 0}
      />
    </PageContainer>
  );
}
