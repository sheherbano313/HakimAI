import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ModulesScreen from "../screens/ModulesScreen";
import RemediesScreen from "../screens/RemediesScreen";
import HealthTipsScreen from "../screens/HealthTipsScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import ContactUsScreen from "../screens/ContactUsScreen";
import HakimsScreen from "../screens/HakimsScreen";
import { AppStackParamList } from "../types/navigation";

const Stack = createStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Modules" component={ModulesScreen} />
      <Stack.Screen name="Remedies" component={RemediesScreen} />
      <Stack.Screen name="HealthTips" component={HealthTipsScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="Hakims" component={HakimsScreen} />
    </Stack.Navigator>
  );
}
