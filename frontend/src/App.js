// App.js - Main App Component
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ScanVerifyScreen from './screens/ScanVerifyScreen';
import AlertsScreen from './screens/AlertsScreen';
import ReportFraudScreen from './screens/ReportFraudScreen';
import ProfileScreen from './screens/ProfileScreen';
import ResultScreen from './screens/ResultScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Scan') {
            iconName = 'qr-code-scanner';
          } else if (route.name === 'Alerts') {
            iconName = 'notifications';
          } else if (route.name === 'Report') {
            iconName = 'report-problem';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#4F46E5' },
        headerTintColor: 'white',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanVerifyScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Report" component={ReportFraudScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Root Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{
            headerShown: true,
            title: 'Verification Result',
            headerStyle: { backgroundColor: '#4F46E5' },
            headerTintColor: 'white',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
