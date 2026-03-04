import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import localStorageService from '../services/localStorageService';
import syncService from '../services/syncService';
import authService from '../services/authService';
import { rgbToLab, rgbToCmyk, getColorFamily } from '../utils/colorUtils';

const HistoryScreen = ({ navigation }) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const iconColor = isDark ? '#EDF2F4' : '#2B2D42';
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadHistory = async () => {
        try {
            setLoading(true);
            // Load from local storage (works offline)
            const data = await localStorageService.getHistory();
            setHistory(data);
        } catch (error) {
            console.error('Error loading history:', error);
            Alert.alert('Error', 'No se pudo cargar el historial.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const isAuth = await authService.isAuthenticated();
            if (isAuth) {
                await syncService.sync();
                const data = await localStorageService.getHistory();
                setHistory(data);
            } else {
                await loadHistory();
            }
        } catch (error) {
            console.error('Sync error:', error);
            await loadHistory();
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const handleClearHistory = () => {
        Alert.alert(
            "Borrar Historial",
            "¿Estás seguro de que quieres borrar todo el historial?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Borrar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Clear local storage
                            await localStorageService.clearHistory();

                            // Add to sync queue if authenticated
                            const isAuth = await authService.isAuthenticated();
                            if (isAuth) {
                                await localStorageService.addToSyncQueue({
                                    type: 'CLEAR_HISTORY',
                                    data: {}
                                });
                                syncService.sync().catch(err => console.log('Sync queued'));
                            }

                            loadHistory();
                        } catch (e) {
                            console.error('Clear error:', e);
                            Alert.alert("Error", "No se pudo borrar el historial");
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            {/* Top App Bar */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200/50 dark:border-white/10">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center">
                    <MaterialIcons name="arrow-back-ios" size={24} color={iconColor} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-text-light dark:text-text-dark">Historial de Mediciones</Text>
                <TouchableOpacity
                    onPress={handleClearHistory}
                    className="w-10 h-10 items-center justify-center"
                >
                    <MaterialIcons name="delete-sweep" size={24} color={iconColor} />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View className="flex-1 px-4 pt-6 pb-4">
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id?.toString() || item.localId?.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={['#667eea']}
                            tintColor="#667eea"
                        />
                    }
                    renderItem={({ item }) => (
                        <View className="flex-row items-center gap-2 bg-surface-light dark:bg-surface-dark/20 p-3 mb-3 rounded-lg shadow-sm">
                            {/* Color Preview */}
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ColorDetail', { color: item })}
                                className="flex-row items-center flex-1 gap-3"
                            >
                                <View style={{ backgroundColor: item.hex }} className="w-12 h-12 rounded-full border border-gray-200" />
                                <View className="flex-1 justify-center">
                                    <Text className="text-base font-medium text-text-light dark:text-text-dark" numberOfLines={1}>
                                        {(() => { const fam = item.colorFamily || getColorFamily(item.hex); return fam ? `${fam} · ${item.name || 'Color Desconocido'}` : (item.name || 'Color Desconocido'); })()}
                                    </Text>
                                    <Text className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                        {item.hex.toUpperCase()} • {new Date(item.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/* Actions Right Side */}
                            <View className="flex-row items-center gap-1 border-l border-gray-200/50 dark:border-white/10 pl-2">
                                {/* Favorite Button */}
                                <TouchableOpacity
                                    className="p-2"
                                    onPress={async () => {
                                        try {
                                            // Recalculate values if missing
                                            let { hex, rgb, name, cmyk, lab } = item;

                                            if (!cmyk || !lab) {
                                                const [r, g, b] = item.rgb.split(',').map(n => parseInt(n.trim()));

                                                if (!isNaN(r)) {
                                                    const labObj = rgbToLab(r, g, b);
                                                    lab = `L:${labObj.l} A:${labObj.a} B:${labObj.b}`;

                                                    const cmykObj = rgbToCmyk(r, g, b);
                                                    cmyk = `${cmykObj.c}, ${cmykObj.m}, ${cmykObj.y}, ${cmykObj.k}`;
                                                }
                                            }

                                            // Save to local storage
                                            await localStorageService.addFavorite({
                                                hex,
                                                rgb,
                                                name,
                                                cmyk: cmyk || "0,0,0,100",
                                                lab: lab || "L:0 A:0 B:0",
                                            });

                                            // Sync if authenticated
                                            const isAuth = await authService.isAuthenticated();
                                            if (isAuth) {
                                                syncService.sync().catch(err => console.log('Sync queued'));
                                            }

                                            Alert.alert("Guardado", "Añadido a favoritos");
                                        } catch (e) {
                                            console.error("Save Fav Error:", e);
                                            Alert.alert("Error", "No se pudo guardar");
                                        }
                                    }}
                                >
                                    <MaterialIcons name="bookmark-border" size={24} className="text-primary" />
                                </TouchableOpacity>

                                {/* Delete Button */}
                                <TouchableOpacity
                                    className="p-2"
                                    onPress={() => {
                                        Alert.alert(
                                            "Eliminar",
                                            "¿Borrar este historial?",
                                            [
                                                { text: "Cancelar", style: "cancel" },
                                                {
                                                    text: "Borrar",
                                                    style: "destructive",
                                                    onPress: async () => {
                                                        try {
                                                            // Delete from local storage
                                                            await localStorageService.getHistory().then(async (history) => {
                                                                const filtered = history.filter(h => h.id !== item.id && h.localId !== item.id);
                                                                await localStorageService.saveHistory(filtered);
                                                            });

                                                            // Add to sync queue if authenticated
                                                            const isAuth = await authService.isAuthenticated();
                                                            if (isAuth) {
                                                                await localStorageService.addToSyncQueue({
                                                                    type: 'DELETE_HISTORY',
                                                                    data: { id: item.id }
                                                                });
                                                                syncService.sync().catch(err => console.log('Sync queued'));
                                                            }

                                                            loadHistory();
                                                        } catch (e) {
                                                            console.error('Delete error:', e);
                                                            Alert.alert("Error", "No se pudo borrar");
                                                        }
                                                    }
                                                }
                                            ]
                                        );
                                    }}
                                >
                                    <MaterialIcons name="close" size={24} className="text-text-muted-light dark:text-text-muted-dark" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        !loading && (
                            <View className="items-center justify-center mt-20 p-8">
                                <MaterialIcons name="history" size={64} className="text-text-muted-light dark:text-text-muted-dark mb-4" />
                                <Text className="text-xl font-bold text-text-light dark:text-text-dark mb-2">Sin historial</Text>
                                <Text className="text-center text-text-muted-light dark:text-text-muted-dark">Los colores que escanees aparecerán aquí.</Text>
                            </View>
                        )
                    }
                />
            </View>
        </SafeAreaView>
    );
};

export default HistoryScreen;
