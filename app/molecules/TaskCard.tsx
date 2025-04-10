import { TouchableOpacity, StyleSheet } from "react-native";
import Typography from "../atoms/Typography";

interface TaskCardProps {
  name: string;
  timeFormatted: string;
  isActive: boolean;
  onPress: () => void;
}

export default function TaskCard({
  name,
  timeFormatted,
  isActive,
  onPress,
}: TaskCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.taskCard,
        isActive ? styles.activeTaskCard : styles.inactiveTaskCard,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Typography variant="body" style={styles.taskName}>
        {name}
      </Typography>
      <Typography
        variant="timer"
        style={{ color: isActive ? "#F5F5F5" : "#3C3C3C" }}
      >
        {timeFormatted}
      </Typography>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  },
});
