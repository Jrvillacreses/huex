import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getHistory, clearHistory, deleteHistoryItem, saveFavorite } from '../services/api';
import { rgbToLab, rgbToCmyk } from '../utils/colorUtils';

const HistoryScreen = ({ navigation }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const data = await getHistory();
            setHistory(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cargar el historial.');
        } finally {
            setLoading(false);
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
                            await clearHistory();
                            loadHistory();
                        } catch (e) {
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
                    <MaterialIcons name="arrow-back-ios" size={24} className="text-text-light dark:text-text-dark" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-text-light dark:text-text-dark">Historial de Mediciones</Text>
                <TouchableOpacity onPress={handleClearHistory} className="w-10 h-10 items-center justify-center">
                    <MaterialIcons name="delete-outline" size={24} className="text-text-light dark:text-text-dark" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View className="flex-1 px-4 pt-6 pb-4">
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id.toString()}
                    refreshing={loading}
                    onRefresh={loadHistory}
                    renderItem={({ item }) => (
                        <View className="flex-row items-center gap-2 bg-surface-light dark:bg-surface-dark/20 p-3 mb-3 rounded-lg shadow-sm">
                            {/* Color Preview */}
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ColorDetail', { color: item })}
                                className="flex-row items-center flex-1 gap-3"
                            >
                                <View style={{ backgroundColor: item.hex }} className="w-12 h-12 rounded-full border border-gray-200" />
                                <View className="flex-1 justify-center">
                                    <Text className="text-base font-medium text-text-light dark:text-text-dark" numberOfLines={1}>{item.name || "Color Desconocido"}</Text>
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
                                            // Recalculate values if missing (backward compatibility)
                                            let { hex, rgb, name, cmyk, lab } = item;

                                            // Ensure we have RGB object from string if needed
                                            // But for now, let's assume item.rgb is "r, g, b" string

                                            if (!cmyk || !lab) {
                                                // We need to parse RGB to calculate others
                                                // Assuming item.rgb is "255, 255, 255"
                                                const [r, g, b] = item.rgb.split(',').map(n => parseInt(n.trim()));

                                                if (!isNaN(r)) {
                                                    const labObj = rgbToLab(r, g, b);
                                                    lab = `L:${labObj.l} A:${labObj.a} B:${labObj.b}`;

                                                    const cmykObj = rgbToCmyk(r, g, b);
                                                    cmyk = `${cmykObj.c}, ${cmykObj.m}, ${cmykObj.y}, ${cmykObj.k}`;
                                                }
                                            }

                                            await saveFavorite({
                                                hex,
                                                rgb,
                                                name,
                                                cmyk: cmyk || "0,0,0,100", // Fallback
                                                lab: lab || "L:0 A:0 B:0", // Fallback
                                                userId: 1
                                            });
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
                                                            await deleteHistoryItem(item.id);
                                                            loadHistory();
                                                        } catch (e) {
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
