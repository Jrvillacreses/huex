import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import localStorageService from '../services/localStorageService';
import syncService from '../services/syncService';
import authService from '../services/authService';
import { getColorFamily } from '../utils/colorUtils';


const FavoritesScreen = ({ navigation }) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const iconColor = isDark ? '#EDF2F4' : '#2B2D42';
    const mutedIconColor = '#8D99AE';
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            // Load from local storage (works offline)
            const data = await localStorageService.getFavorites();
            setFavorites(data);
        } catch (error) {
            console.error('Error loading favorites:', error);
            Alert.alert('Error', 'No se pudieron cargar los favoritos.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            // Check if authenticated
            const isAuth = await authService.isAuthenticated();
            if (isAuth) {
                // Sync with server
                await syncService.sync();
                // Reload from local storage
                const data = await localStorageService.getFavorites();
                setFavorites(data);
            } else {
                // Just reload local data
                await loadFavorites();
            }
        } catch (error) {
            console.error('Sync error:', error);
            // Still reload local data even if sync fails
            await loadFavorites();
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [])
    );

    const handleDelete = async (id, name) => {
        Alert.alert(
            "Eliminar Favorito",
            `¿Quieres eliminar ${name}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Delete from local storage
                            await localStorageService.removeFavorite(id);

                            // Add to sync queue if authenticated
                            const isAuth = await authService.isAuthenticated();
                            if (isAuth) {
                                await localStorageService.addToSyncQueue({
                                    type: 'DELETE_FAVORITE',
                                    data: { id }
                                });
                                // Try to sync immediately
                                syncService.sync().catch(err => console.log('Sync queued for later'));
                            }

                            // Reload favorites
                            loadFavorites();
                        } catch (e) {
                            console.error('Delete error:', e);
                            Alert.alert("Error", "No se pudo eliminar");
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
                <Text className="text-lg font-bold text-text-light dark:text-text-dark">Colores Favoritos</Text>
                <View className="w-10" />
            </View>

            {/* Main Content */}
            <View className="flex-1 px-4 pt-6 pb-24">
                <FlatList
                    data={favorites}
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
                            {/* Clickable Area: Navigates to Detail */}
                            <TouchableOpacity
                                className="flex-row items-center flex-1 gap-3"
                                onPress={() => navigation.navigate('ColorDetail', { color: item })}
                            >
                                <View style={{ backgroundColor: item.hex }} className="w-12 h-12 rounded-full border border-gray-200" />
                                <View className="flex-1 justify-center">
                                    <Text className="text-base font-medium text-text-light dark:text-text-dark" numberOfLines={1}>
                                        {(() => { const fam = item.colorFamily || getColorFamily(item.hex); return fam ? `${fam} · ${item.name || 'Color Personalizado'}` : (item.name || 'Color Personalizado'); })()}
                                    </Text>
                                    <Text className="text-sm text-text-muted-light dark:text-text-muted-dark font-mono">
                                        {item.hex.toUpperCase()} • {new Date(item.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/* Actions Area: Delete Button */}
                            <View className="border-l border-gray-200/50 dark:border-white/10 pl-2">
                                <TouchableOpacity
                                    className="p-2"
                                    onPress={() => handleDelete(item.id, item.name)}
                                >
                                    <MaterialIcons name="close" size={24} color={mutedIconColor} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        !loading && (
                            <View className="items-center justify-center mt-20 p-8">
                                <MaterialIcons name="favorite-border" size={64} className="text-text-muted-light dark:text-text-muted-dark mb-4" />
                                <Text className="text-xl font-bold text-text-light dark:text-text-dark mb-2">Sin favoritos</Text>
                                <Text className="text-center text-text-muted-light dark:text-text-muted-dark">
                                    Los colores que guardes aparecerán aquí.
                                </Text>
                            </View>
                        )
                    }
                />
            </View>

            {/* Floating Action Button */}
            <View className="absolute bottom-6 right-6">
                <TouchableOpacity
                    className="w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
                    onPress={() => navigation.navigate('Scan')}
                >
                    <MaterialIcons name="add" size={32} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default FavoritesScreen;
