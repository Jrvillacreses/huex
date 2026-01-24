import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ScanScreen from '../screens/ScanScreen';
import SimulatorScreen from '../screens/SimulatorScreen';
import ColorDetailScreen from '../screens/ColorDetailScreen';

import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
                name="Favorites"
                component={FavoritesScreen}
                options={{
                    tabBarLabel: 'Favoritos',
                    tabBarIcon: ({ color }) => <MaterialIcons name="star" size={24} color={color} />,
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    tabBarLabel: 'Historial',
                    tabBarIcon: ({ color }) => <MaterialIcons name="history" size={24} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="ColorDetail" component={ColorDetailScreen} options={{ presentation: 'modal' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
