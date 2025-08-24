import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Remedies: undefined;
  HealthTips: undefined;
  Feedback: undefined;
  ContactUs: undefined;
  Hakims: undefined;
};

export default function ModulesScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>HakimAI Modules</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Remedies")}>
          <Text style={styles.buttonTitle}>🌿 Natural Remedies</Text>
          <Text style={styles.buttonText}>Get herbal remedies by entering your symptoms</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("HealthTips")}>
          <Text style={styles.buttonTitle}>💡 Health Tips</Text>
          <Text style={styles.buttonText}>Learn daily tips for a healthy lifestyle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Feedback")}>
          <Text style={styles.buttonTitle}>📝 Feedback</Text>
          <Text style={styles.buttonText}>Share your experience with HakimAI</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ContactUs")}>
          <Text style={styles.buttonTitle}>📞 Contact Us</Text>
          <Text style={styles.buttonText}>Reach out for help or inquiries</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Hakims")}>
          <Text style={styles.buttonTitle}>👨‍⚕️ Local Hakims</Text>
          <Text style={styles.buttonText}>Find traditional healers near you</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1, // ensure it fills the screen
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // dark overlay for readability
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  buttonText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 5,
  },
});
