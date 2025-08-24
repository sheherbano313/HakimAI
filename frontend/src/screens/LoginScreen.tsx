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

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log('Login button clicked!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Email length:', email.length);
    console.log('Password length:', password.length);
    console.log('Email type:', typeof email);
    console.log('Password type:', typeof password);
    
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      console.log('Making API call to login...');
      console.log('Request payload:', { email, password });
      const response: AuthResponse = await authAPI.login({ email, password });
      console.log('Login response:', response);
      console.log('Login successful, navigating to App...');
      try {
        navigation.replace("App");
        console.log('Navigation to App successful');
      } catch (navError) {
        console.error('Navigation error:', navError);
        // Fallback to Alert if navigation fails
        Alert.alert("Success", response.message, [
          {
            text: "OK",
            onPress: () => {
              console.log('Alert OK pressed, attempting navigation to App again...');
              try {
                navigation.replace("App");
                console.log('Navigation to App successful on retry');
              } catch (retryError) {
                console.error('Navigation retry error:', retryError);
              }
            }
          }
        ]);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
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
        <Text style={styles.title}>HakimAI</Text>
        
        {/* Debug display - remove this later */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>Debug Info:</Text>
          <Text style={styles.debugText}>Email: "{email}" (length: {email.length})</Text>
          <Text style={styles.debugText}>Password: "{password}" (length: {password.length})</Text>
          <Text style={styles.debugText}>Loading: {loading.toString()}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#e0e0e0"
          value={email}
          onChangeText={(text) => {
            console.log('Email input changed:', text);
            console.log('Email input type:', typeof text);
            console.log('Email input length:', text.length);
            setEmail(text);
            console.log('Email state after setEmail:', text);
          }}
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
          onChangeText={(text) => {
            console.log('Password input changed:', text);
            console.log('Password input type:', typeof text);
            console.log('Password input length:', text.length);
            setPassword(text);
            console.log('Password state after setPassword:', text);
          }}
          autoComplete="password"
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={() => {
            console.log('Button pressed!');
            console.log('Current state - email:', email, 'password:', password, 'loading:', loading);
            if (!loading) {
              handleLogin();
            } else {
              console.log('Button is disabled due to loading state');
            }
          }}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        {/* Test button to verify TouchableOpacity is working */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#e74c3c', marginTop: 10 }]} 
          onPress={() => Alert.alert("Test", "Button is working!")}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Test Button</Text>
        </TouchableOpacity>

        {/* Test button to set test values */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#9b59b6', marginTop: 10 }]} 
          onPress={() => {
            setEmail('test@example.com');
            setPassword('password123');
            console.log('Test values set manually');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Set Test Values</Text>
        </TouchableOpacity>

        {/* Test navigation button */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#f39c12', marginTop: 10 }]} 
          onPress={() => {
            console.log('Testing navigation...');
            console.log('Navigation object:', navigation);
            try {
              navigation.navigate("Signup");
              console.log('Navigation to Signup successful');
            } catch (navError) {
              console.error('Navigation test error:', navError);
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Test Navigation</Text>
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
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 28,
    textAlign: "center",
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
  debugContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  debugText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
});
