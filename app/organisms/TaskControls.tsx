import { View, StyleSheet } from "react-native";
import Button from "../atoms/Button";

interface TaskControlsProps {
  onAddTask: () => void;
  onTogglePlayPause: () => void;
  isPlaying: boolean;
  hasActiveTasks: boolean;
}

export default function TaskControls({
  onAddTask,
  onTogglePlayPause,
  isPlaying,
  hasActiveTasks,
}: TaskControlsProps) {
  return (
    <View style={styles.buttonContainer}>
      <Button
        isCircle
        onPress={onAddTask}
        icon={require("../../assets/images/add-icon.png")}
      />

      {hasActiveTasks && (
        <Button
          isCircle
          onPress={onTogglePlayPause}
          icon={
            isPlaying
              ? require("../../assets/images/pause-icon.png")
              : require("../../assets/images/play-icon.png")
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 20,
  },
});
