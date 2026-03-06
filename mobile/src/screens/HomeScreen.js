import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { styled, useColorScheme } from 'nativewind';
import { useFocusEffect } from '@react-navigation/native';
import localStorageService from '../services/localStorageService';
import { getColorFamily } from '../utils/colorUtils';

const StyledSafeAreaView = styled(SafeAreaView);

const HomeScreen = ({ navigation }) => {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const [recentHistory, setRecentHistory] = useState([]);

    const loadRecentHistory = async () => {
        try {
            const history = await localStorageService.getHistory();
            // Get last 5 items
            setRecentHistory(history.slice(0, 5));
        } catch (error) {
            console.error('Error loading recent history:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadRecentHistory();
        }, [])
    );

    return (
        <StyledSafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <ScrollView className="p-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <View className="w-12" />
                    <Text className="text-lg font-bold text-text-light dark:text-text-dark font-display">
                        Inicio
                    </Text>
                    <TouchableOpacity className="w-12 items-end">
                        <MaterialIcons name="settings" size={24} color={colorScheme === 'dark' ? '#EDF2F4' : '#2B2D42'} />
                    </TouchableOpacity>
                </View>

                {/* Action Grid */}
                <View className="flex-row flex-wrap justify-between mb-6">
                    <TouchableOpacity
                        className="w-[48%] bg-surface-light dark:bg-surface-dark/20 p-4 rounded-xl shadow-sm mb-4"
                        onPress={() => navigation.navigate('Scan')}
                    >
                        <MaterialIcons name="photo-camera" size={32} color={colorScheme === 'dark' ? '#EDF2F4' : '#2B2D42'} />
                        <Text className="text-base font-bold text-text-light dark:text-text-dark mt-2">Escanear color</Text>
                        <Text className="text-sm text-text-muted-light dark:text-text-muted-dark">Usa tu cámara</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-[48%] bg-surface-light dark:bg-surface-dark/20 p-4 rounded-xl shadow-sm mb-4"
                        onPress={() => navigation.navigate('History')}
                    >
                        <MaterialIcons name="history" size={32} color={colorScheme === 'dark' ? '#EDF2F4' : '#2B2D42'} />
                        <Text className="text-base font-bold text-text-light dark:text-text-dark mt-2">Historial</Text>
                        <Text className="text-sm text-text-muted-light dark:text-text-muted-dark">Colores recientes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-[48%] bg-surface-light dark:bg-surface-dark/20 p-4 rounded-xl shadow-sm mb-4"
                        onPress={() => navigation.navigate('Simulator')}
                    >
                        <MaterialIcons name="visibility" size={32} color={colorScheme === 'dark' ? '#EDF2F4' : '#2B2D42'} />
                        <Text className="text-base font-bold text-text-light dark:text-text-dark mt-2">Simulador</Text>
                        <Text className="text-sm text-text-muted-light dark:text-text-muted-dark">Tipos de visión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-[48%] bg-surface-light dark:bg-surface-dark/20 p-4 rounded-xl shadow-sm mb-4"
                        onPress={() => navigation.navigate('Favorites')}
                    >
                        <MaterialIcons name="star" size={32} color={colorScheme === 'dark' ? '#EDF2F4' : '#2B2D42'} />
                        <Text className="text-base font-bold text-text-light dark:text-text-dark mt-2">Favoritos</Text>
                        <Text className="text-sm text-text-muted-light dark:text-text-muted-dark">Colores guardados</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Measurements */}
                <View className="mb-6">
                    <Text className="text-lg font-bold text-text-light dark:text-text-dark mb-3">Últimas Mediciones</Text>
                    {recentHistory.length > 0 ? (
                        <View className="bg-surface-light dark:bg-surface-dark/20 rounded-xl shadow-sm overflow-hidden">
                            {recentHistory.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id || index}
                                    onPress={() => navigation.navigate('ColorDetail', { color: item })}
                                    className={`flex-row items-center p-3 ${index < recentHistory.length - 1 ? 'border-b border-gray-200/50 dark:border-white/10' : ''}`}
                                >
                                    <View style={{ backgroundColor: item.hex }} className="w-10 h-10 rounded-full border border-gray-200 mr-3" />
                                    <View className="flex-1">
                                        <Text className="text-base font-medium text-text-light dark:text-text-dark" numberOfLines={1}>
                                            {(() => { const fam = item.colorFamily || getColorFamily(item.hex); return fam ? `${fam} · ${item.name || 'Color Desconocido'}` : (item.name || 'Color Desconocido'); })()}
                                        </Text>
                                        <Text className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                            {item.hex.toUpperCase()} • {new Date(item.createdAt).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <MaterialIcons name="chevron-right" size={24} color={colorScheme === 'dark' ? '#8D99AE' : '#8D99AE'} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <View className="bg-surface-light dark:bg-surface-dark/20 rounded-xl shadow-sm p-6 items-center">
                            <Text className="text-text-muted-light dark:text-text-muted-dark text-center">
                                Aún no hay mediciones recientes.
                            </Text>
                        </View>
                    )}
                </View>

                {/* Theme Toggle */}
                <View className="flex-row items-center justify-between bg-surface-light dark:bg-surface-dark/20 p-4 rounded-xl shadow-sm mb-6">
                    <View className="flex-row items-center gap-4">
                        <View className="w-10 h-10 rounded-full bg-background-light dark:bg-background-dark items-center justify-center">
                            <MaterialIcons name="brightness-6" size={24} color={colorScheme === 'dark' ? '#EDF2F4' : '#2B2D42'} />
                        </View>
                        <Text className="text-base text-text-light dark:text-text-dark">Modo Oscuro</Text>
                    </View>
                    <TouchableOpacity onPress={toggleColorScheme}>
                        <MaterialIcons name={colorScheme === 'dark' ? "toggle-on" : "toggle-off"} size={40} color={colorScheme === 'dark' ? '#EF233C' : '#8D99AE'} />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </StyledSafeAreaView>
    );
};

export default HomeScreen;
