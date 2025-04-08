"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Notifications from "expo-notifications";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Task interface
interface Task {
  id: string;
  name: string;
  duration: number; // in seconds
  timeRemaining: number; // in seconds
  isActive: boolean;
}

// Format time as HH:MM:SS
const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export default function TasksScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Request notification permissions
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
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
  }, [activeTaskId, name]);

  // Schedule a notification
  const scheduleNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // Show immediately
    });
  };

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

  // Edit a task (placeholder for future implementation)
  const editTask = (taskId: string) => {
    // Navigate to edit task screen or show modal
    console.log(`Edit task ${taskId}`);
  };

  // Render a task item
  const renderTaskItem = ({ item, index }: { item: Task; index: number }) => {
    const isActive = item.id === activeTaskId;

    return (
      <TouchableOpacity
        style={[
          styles.taskCard,
          isActive ? styles.activeTaskCard : styles.inactiveTaskCard,
        ]}
        onPress={() => editTask(item.id)}
        activeOpacity={0.8}
      >
        <Text style={styles.taskName}>{item.name}</Text>
        <Text
          style={[
            styles.taskTimer,
            { color: isActive ? "#F5F5F5" : "#3C3C3C" },
          ]}
        >
          {formatTime(item.timeRemaining)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>
          {tasks.length === 0
            ? `Add your first task ${name || "Lorem ipsum"}!`
            : `This is your task ${name || "Lorem ipsum"}!`}
        </Text>

        {tasks.length > 0 && (
          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.taskList}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={addTask}
            activeOpacity={0.8}
          >
            <Image
              source={require("../assets/images/add-icon.png")}
              style={styles.buttonIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {tasks.length > 0 && !activeTaskId && (
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => togglePlayPause(tasks[0].id)}
              activeOpacity={0.8}
            >
              <Image
                source={require("../assets/images/play-icon.png")}
                style={styles.buttonIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}

          {activeTaskId && (
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => togglePlayPause(activeTaskId)}
              activeOpacity={0.8}
            >
              <Image
                source={require("../assets/images/pause-icon.png")}
                style={styles.buttonIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#F5F5F5",
    marginBottom: 30,
    marginTop: 40,
  },
  taskList: {
    flexGrow: 1,
    gap: 16,
  },
  taskCard: {
    borderRadius: 24,
    padding: 20,
    height: 100,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  activeTaskCard: {
    backgroundColor: "#733FD7",
  },
  inactiveTaskCard: {
    backgroundColor: "#282828",
  },
  taskName: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#F5F5F5",
  },
  taskTimer: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    alignSelf: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 20,
  },
  circleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#733FD7",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonIcon: {
    width: 24,
    height: 24,
  },
});
