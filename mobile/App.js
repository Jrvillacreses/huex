import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useColorScheme, NativeWindStyleSheet } from 'nativewind';
import AppNavigator from './src/navigation/AppNavigator';

NativeWindStyleSheet.setOutput({
  default: "native",
});

function RootContainer() {
  const { colorScheme } = useColorScheme();
  return (
    <View className={colorScheme} style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <AppNavigator />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <RootContainer />
    </SafeAreaProvider>
  );
}
