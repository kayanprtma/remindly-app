"use client";

import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import PageContainer from "./templates/PageContainer";
import WelcomeHeader from "./molecules/WelcomeHeader";
import Input from "./atoms/Input";
import Button from "./atoms/Button";

export default function GetStarted() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleGetStarted = () => {
    router.push({
      pathname: "/tasks",
      params: { name },
    });
  };

  return (
    <PageContainer>
      <WelcomeHeader />

      <View style={styles.inputContainer}>
        <Input
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>

      <Button
        text="Get Started!"
        onPress={handleGetStarted}
        style={styles.button}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 40,
  },
  button: {
    marginTop: 40,
  },
});
