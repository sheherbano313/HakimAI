import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import { authAPI, AuthResponse } from "../api/apiService";
import CustomLogo from "../components/CustomLogo";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with:', { email, password });
      const response: AuthResponse = await authAPI.login({ email, password });
      console.log('Login response:', response);
      
      if (response.success) {
        console.log('Login successful, navigating to App...');
        navigation.replace("App");
      } else {
        console.log('Login failed:', response.message);
        Alert.alert("Login Failed", response.message || "Login failed. Please try again.");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      const errorMessage = error.response?.data?.error || error.message || "Login failed. Please try again.";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri:
          "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1000&q=80",
      }}
      style={styles.background}
      blurRadius={2}
    >
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <CustomLogo size="large" color="#2e7d32" />
        </View>
        <Text style={styles.subtitle}>Herbal Medicine AI Assistant</Text>
        


        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#e0e0e0"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#e0e0e0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoComplete="password"
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert("Reset Password", "Coming soon!")}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Divider line */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* ✅ Create Account Button */}
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.signupText}>Create Account</Text>
        </TouchableOpacity>

        {/* Test Connection Button */}
        <TouchableOpacity
          style={[styles.signupButton, { backgroundColor: '#ff9800', marginTop: 10 }]}
          onPress={async () => {
            try {
              const response = await fetch('http://192.168.18.22:5000/health');
              const data = await response.json();
              Alert.alert("Connection Test", `Backend is reachable: ${JSON.stringify(data)}`);
            } catch (error) {
              Alert.alert("Connection Test", `Backend not reachable: ${error.message}`);
            }
          }}
        >
          <Text style={[styles.signupText, { color: '#fff' }]}>Test Connection</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    marginHorizontal: 24,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 16,
    padding: 32,
    elevation: 5,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 28,
    fontStyle: "italic",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#a5d6a7",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2e7d32",
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    zIndex: 1000,
    elevation: 10,
  },
  buttonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotText: {
    color: "#388e3c",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#c8e6c9",
  },
  orText: {
    marginHorizontal: 10,
    color: "#555",
    fontWeight: "500",
  },
  signupButton: {
    backgroundColor: "#e8f5e9",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "#2e7d32",
    fontSize: 16,
    fontWeight: "600",
  },

});
