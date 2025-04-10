import { FlatList, StyleSheet } from "react-native";
import TaskCard from "../molecules/TaskCard";

interface Task {
  id: string;
  name: string;
  timeRemaining: number;
  isActive: boolean;
}

interface TaskListProps {
  tasks: Task[];
  formatTime: (seconds: number) => string;
  onTaskPress: (taskId: string) => void;
  activeTaskId: string | null;
}

export default function TaskList({
  tasks,
  formatTime,
  onTaskPress,
  activeTaskId,
}: TaskListProps) {
  const renderTaskItem = ({ item }: { item: Task }) => {
    return (
      <TaskCard
        name={item.name}
        timeFormatted={formatTime(item.timeRemaining)}
        isActive={item.id === activeTaskId}
        onPress={() => onTaskPress(item.id)}
      />
    );
  };

  return (
    <FlatList
      data={tasks}
      renderItem={renderTaskItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.taskList}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  taskList: {
    flexGrow: 1,
    gap: 16,
  },
});
