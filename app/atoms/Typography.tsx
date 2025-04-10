import type React from "react";
import { Text, StyleSheet, type TextStyle } from "react-native";

interface TypographyProps {
  variant: "header" | "subheader" | "body" | "brand" | "timer";
  children: React.ReactNode;
  style?: TextStyle;
}

export default function Typography({
  variant,
  children,
  style,
}: TypographyProps) {
  const getStyle = () => {
    switch (variant) {
      case "header":
        return styles.header;
      case "subheader":
        return styles.subheader;
      case "brand":
        return styles.brand;
      case "timer":
        return styles.timer;
      case "body":
      default:
        return styles.body;
    }
  };

  return <Text style={[getStyle(), style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  header: {
    fontSize: 35,
    fontFamily: "Poppins-Bold",
    color: "#F5F5F5",
    lineHeight: 40,
  },
  subheader: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#F5F5F5",
  },
  body: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#F5F5F5",
  },
  brand: {
    fontSize: 35,
    fontFamily: "Poppins-Bold",
    color: "#733FD7",
    lineHeight: 40,
  },
  timer: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#F5F5F5",
  },
});
