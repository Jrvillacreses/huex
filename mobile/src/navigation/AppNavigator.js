import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { View, ActivityIndicator } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ScanScreen from '../screens/ScanScreen';
import SimulatorScreen from '../screens/SimulatorScreen';
import ColorDetailScreen from '../screens/ColorDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';

import authService from '../services/authService';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
}

function MainTabs() {
    const { colorScheme } = useColorScheme();
    const iconColor = colorScheme === 'dark' ? '#8D99AE' : '#8D99AE';
    const activeColor = '#EF233C';
    const bgColor = colorScheme === 'dark' ? '#2B2D42' : '#EDF2F4';

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: bgColor,
                    borderTopColor: 'transparent',
                    elevation: 0,
                    height: 60,
                    paddingBottom: 10,
                },
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: iconColor,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Inicio',
                    tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
                }}
            />
            <Tab.Screen
                name="Scan"
                component={ScanScreen}
                options={{
                    tabBarLabel: 'Escanear',
                    tabBarIcon: ({ color }) => <MaterialIcons name="photo-camera" size={24} color={color} />,
                }}
            />
            <Tab.Screen
                name="Simulator"
                component={SimulatorScreen}
                options={{
                    tabBarLabel: 'Simulador',
                    tabBarIcon: ({ color }) => <MaterialIcons name="visibility" size={24} color={color} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const authenticated = await authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* Auth screens always accessible for offline-first approach */}
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="History" component={HistoryScreen} />
                <Stack.Screen name="Favorites" component={FavoritesScreen} />
                <Stack.Screen name="ColorDetail" component={ColorDetailScreen} options={{ presentation: 'modal' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
