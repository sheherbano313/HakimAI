// import React from "react";
// import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Platform } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import type { StackNavigationProp } from "@react-navigation/stack";
// import CustomLogo from "../components/CustomLogo";

// type RootStackParamList = {
//   Remedies: undefined;
//   HealthTips: undefined;
//   Feedback: undefined;
//   ContactUs: undefined;
//   Hakims: undefined;
// };

// export default function ModulesScreen() {
//   const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

//   return (
//     <ImageBackground
//       source={{
//         uri: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
//       }}
//       style={styles.background}
//       resizeMode="cover"
//     >
//       <View style={styles.overlay}>
//         <ScrollView 
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={Platform.OS === 'web'}
//           bounces={Platform.OS !== 'web'}
//           scrollEventThrottle={16}
//         >
//           <View style={styles.logoContainer}>
//             <CustomLogo size="large" color="#fff" />
//           </View>
//           <Text style={styles.subtitle}>Choose a module to get started</Text>

//           <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Remedies")}>
//             <Text style={styles.buttonTitle}>🌿 Natural Remedies</Text>
//             <Text style={styles.buttonText}>Get herbal remedies by entering your symptoms</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("HealthTips")}>
//             <Text style={styles.buttonTitle}>💡 Health Tips</Text>
//             <Text style={styles.buttonText}>Learn daily tips for a healthy lifestyle</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Feedback")}>
//             <Text style={styles.buttonTitle}>📝 Feedback</Text>
//             <Text style={styles.buttonText}>Share your experience with HakimAI</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ContactUs")}>
//             <Text style={styles.buttonTitle}>📞 Contact Us</Text>
//             <Text style={styles.buttonText}>Reach out for help or inquiries</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Hakims")}>
//             <Text style={styles.buttonTitle}>👨‍⚕️ Local Hakims</Text>
//             <Text style={styles.buttonText}>Find traditional healers near you</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Remedies")}>
//             <Text style={styles.buttonTitle}>🔍 Search Plants</Text>
//             <Text style={styles.buttonText}>Search for specific medicinal plants</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("HealthTips")}>
//             <Text style={styles.buttonTitle}>🏥 Health Check</Text>
//             <Text style={styles.buttonText}>Get personalized health recommendations</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Feedback")}>
//             <Text style={styles.buttonTitle}>📊 Analytics</Text>
//             <Text style={styles.buttonText}>View your health journey progress</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ContactUs")}>
//             <Text style={styles.buttonTitle}>⚙️ Settings</Text>
//             <Text style={styles.buttonText}>Customize your app preferences</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1, // ensure it fills the screen
//     width: "100%",
//     height: "100%",
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)", // dark overlay for readability
//     padding: 20,
//   },
//   // scrollView: {
//   //   flex: 1,
//   //   ...(Platform.OS === 'web' && {
//   //     height: '100vh',
//   //     overflowY: 'auto',
//   //   }),
//   // },
//   scrollView: {
//     ...Platform.select({
//       web: {
//         height: '100vh',
//         overflowY: 'auto',
//       },
//       default: {
//         flex: 1,
//       }
//     }),
//   },
//   scrollContent: {
//     // flexGrow: 1,
//     alignItems: "center",
//     paddingVertical: 20,
//     paddingBottom: 40,
//   },
//   logoContainer: {
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: "white",
//     marginBottom: 30,
//     textAlign: "center",
//     opacity: 0.9,
//   },
//   button: {
//     backgroundColor: "rgba(255, 255, 255, 0.9)",
//     padding: 20,
//     borderRadius: 15,
//     width: "90%",
//     marginVertical: 10,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   buttonTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#2e7d32",
//   },
//   buttonText: {
//     fontSize: 14,
//     color: "#333",
//     textAlign: "center",
//     marginTop: 5,
//   },
// });

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import CustomLogo from "../components/CustomLogo";

type RootStackParamList = {
  Remedies: undefined;
  HealthTips: undefined;
  Feedback: undefined;
  ContactUs: undefined;
  Hakims: undefined;
};

export default function ModulesScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Get device screen height
  const windowHeight = Dimensions.get("window").height;

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView
          style={[
            styles.scrollView,
            Platform.OS === 'web' && {
              height: windowHeight,
              maxHeight: windowHeight,
            }
          ]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
          bounces={Platform.OS !== "web"}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <CustomLogo size="large" color="#fff" />
          </View>

          <Text style={styles.subtitle}>Choose a module to get started</Text>

          {/* Button: Natural Remedies */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Remedies")}
          >
            <Text style={styles.buttonTitle}>🌿 Natural Remedies</Text>
            <Text style={styles.buttonText}>
              Get herbal remedies by entering your symptoms
            </Text>
          </TouchableOpacity>

          {/* Button: Health Tips */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("HealthTips")}
          >
            <Text style={styles.buttonTitle}>💡 Health Tips</Text>
            <Text style={styles.buttonText}>
              Learn daily tips for a healthy lifestyle
            </Text>
          </TouchableOpacity>

          {/* Button: Feedback */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Feedback")}
          >
            <Text style={styles.buttonTitle}>📝 Feedback</Text>
            <Text style={styles.buttonText}>
              Share your experience with HakimAI
            </Text>
          </TouchableOpacity>

          {/* Button: Contact Us */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("ContactUs")}
          >
            <Text style={styles.buttonTitle}>📞 Contact Us</Text>
            <Text style={styles.buttonText}>
              Reach out for help or inquiries
            </Text>
          </TouchableOpacity>

          {/* Button: Local Hakims */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Hakims")}
          >
            <Text style={styles.buttonTitle}>👨‍⚕️ Local Hakims</Text>
            <Text style={styles.buttonText}>
              Find traditional healers near you
            </Text>
          </TouchableOpacity>

          {/* Button: Search Plants */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Remedies")}
          >
            <Text style={styles.buttonTitle}>🔍 Search Plants</Text>
            <Text style={styles.buttonText}>
              Search for specific medicinal plants
            </Text>
          </TouchableOpacity>

          {/* Button: Health Check */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("HealthTips")}
          >
            <Text style={styles.buttonTitle}>🏥 Health Check</Text>
            <Text style={styles.buttonText}>
              Get personalized health recommendations
            </Text>
          </TouchableOpacity>

          {/* Button: Analytics */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Feedback")}
          >
            <Text style={styles.buttonTitle}>📊 Analytics</Text>
            <Text style={styles.buttonText}>
              View your health journey progress
            </Text>
          </TouchableOpacity>

          {/* Button: Settings */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("ContactUs")}
          >
            <Text style={styles.buttonTitle}>⚙️ Settings</Text>
            <Text style={styles.buttonText}>
              Customize your app preferences
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...Platform.select({
      web: {
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
      },
      default: {
        flex: 1,
      }
    }),
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1, // Ensures scrolling works even with small content
    alignItems: "center",
    paddingVertical: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 30,
    textAlign: "center",
    opacity: 0.9,
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