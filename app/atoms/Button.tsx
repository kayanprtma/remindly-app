//new commit

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  type ViewStyle,
  type TextStyle,
  type ImageSourcePropType,
} from "react-native";

interface ButtonProps {
  onPress: () => void;
  text?: string;
  icon?: ImageSourcePropType;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isCircle?: boolean;
}

export default function Button({
  onPress,
  text,
  icon,
  style,
  textStyle,
  isCircle = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isCircle ? styles.circleButton : styles.rectangleButton,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon ? (
        <Image source={icon} style={styles.buttonIcon} resizeMode="contain" />
      ) : null}
      {text ? <Text style={[styles.buttonText, textStyle]}>{text}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#733FD7",
    alignItems: "center",
    justifyContent: "center",
  },
  rectangleButton: {
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  circleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  buttonText: {
    color: "#F5F5F5",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  buttonIcon: {
    width: 24,
    height: 24,
  },
});
