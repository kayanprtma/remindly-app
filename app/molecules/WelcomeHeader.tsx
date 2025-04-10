import { View, StyleSheet } from "react-native";
import Typography from "../atoms/Typography";

interface WelcomeHeaderProps {
  showBrand?: boolean;
}

export default function WelcomeHeader({
  showBrand = true,
}: WelcomeHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <Typography variant="header">Hello There!</Typography>
      <Typography variant="header">Welcome to</Typography>
      {showBrand && <Typography variant="brand">Remindly!</Typography>}
      <Typography variant="header">Before we get</Typography>
      <Typography variant="header">started, what</Typography>
      <Typography variant="header">should we call</Typography>
      <Typography variant="header">you?</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 40,
  },
});
