import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

export default function GetStarted() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleGetStarted = () => {
    // Fix: Use the correct path format without file extension
    router.push({
      pathname: "/tasks", // Changed from "./tasks.tsx" to "/tasks"
      params: { name },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Hello There!</Text>
          <Text style={styles.headerText}>Welcome to</Text>
          <Text style={styles.brandText}>Remindly!</Text>
          <Text style={styles.headerText}>Before we get</Text>
          <Text style={styles.headerText}>started, what</Text>
          <Text style={styles.headerText}>should we call</Text>
          <Text style={styles.headerText}>you?</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#666666"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started!</Text>
        </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginTop: 40,
  },
  headerText: {
    fontSize: 35,
    fontFamily: "Poppins-Bold",
    color: "#F5F5F5",
    lineHeight: 40,
  },
  brandText: {
    fontSize: 35,
    fontFamily: "Poppins-Bold",
    color: "#733FD7",
    lineHeight: 40,
  },
  inputContainer: {
    marginTop: 40,
  },
  input: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  button: {
    backgroundColor: "#733FD7",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "#F5F5F5",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
});
