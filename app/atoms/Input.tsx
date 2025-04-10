import { TextInput, StyleSheet, type TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function Input({ value, onChangeText, ...props }: InputProps) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#666666"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
});
