import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { rgbToHex, hexToRgb, rgbToCmyk, rgbToLab, rgbToHsl, hslToRgb, getColorName } from '../utils/colorUtils';
import localStorageService from '../services/localStorageService';
import authService from '../services/authService';
import syncService from '../services/syncService';

const ColorDetailScreen = ({ route, navigation }) => {
    const { color } = route.params;

    // Helper to ensure we have all color formats (Handle missing data from navigation)
    const getFullColorData = (baseColor) => {
        let { hex, rgb, cmyk, lab, name } = baseColor;

        // Parse RGB if needed "100, 200, 255" -> {r, g, b}
        let r = 0, g = 0, b = 0;
        const rgbObj = hexToRgb(hex);
        if (rgbObj) { r = rgbObj.r; g = rgbObj.g; b = rgbObj.b; }

        // Recalculate if missing
        if (!cmyk || cmyk === '---') {
            const c = rgbToCmyk(r, g, b);
            cmyk = `${c.c}, ${c.m}, ${c.y}, ${c.k}`;
        }
        if (!lab || lab === '---') {
            const l = rgbToLab(r, g, b);
            lab = `L:${l.l} A:${l.a} B:${l.b}`;
        }
        if (!name) name = getColorName(hex);

        return { ...baseColor, hex, rgb: baseColor.rgb || `${r}, ${g}, ${b}`, cmyk, lab, name };
    };

    const fullColor = getFullColorData(color);

    // Triad Calculation (Real Logic)
    const calculateTriad = (hex) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return [];

        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const shifts = [120, 240]; // Triadic harmony

        return shifts.map(shift => {
            const newH = (hsl.h + shift) % 360;
            const newRgb = hslToRgb(newH, hsl.s, hsl.l);
            const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
            return {
                hex: newHex,
                rgb: `${newRgb.r}, ${newRgb.g}, ${newRgb.b}`,
                name: getColorName(newHex),
            };
        });
    };

    const triadColors = calculateTriad(fullColor.hex);

    const handleSaveFavorite = async () => {
        try {
            // Save locally
            await localStorageService.addFavorite({
                hex: fullColor.hex,
                rgb: fullColor.rgb,
                cmyk: fullColor.cmyk,
                lab: fullColor.lab,
                name: fullColor.name,
            });

            // Sync if authenticated
            const isAuth = await authService.isAuthenticated();
            if (isAuth) {
                await localStorageService.addToSyncQueue({
                    type: 'CREATE_FAVORITE',
                    data: {
                        hex: fullColor.hex,
                        rgb: fullColor.rgb,
                        cmyk: fullColor.cmyk,
                        lab: fullColor.lab,
                        name: fullColor.name,
                    }
                });
                syncService.sync().catch(err => console.log('Sync queued'));
            }

            Alert.alert("Éxito", "Color guardado en favoritos");
        } catch (error) {
            console.error("Save Fav Error:", error);
            Alert.alert("Error", "No se pudo guardar el favorito");
        }
    };

    const handleTriadPress = (triadColor) => {
        // Navigate to detail for the triad color
        // ensure we pass formatted data
        navigation.push('ColorDetail', { color: triadColor });
    };

    return (
        <View style={{ flex: 1, backgroundColor: fullColor.hex }}>
            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="flex-row justify-between items-center p-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 bg-black/20 rounded-full items-center justify-center backdrop-blur-md"
                    >
                        <MaterialIcons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-lg drop-shadow-md text-center max-w-[60%]" numberOfLines={1}>{fullColor.name}</Text>
                    {/* Add to Favorites Button */}
                    <TouchableOpacity
                        onPress={handleSaveFavorite}
                        className="w-10 h-10 bg-black/20 rounded-full items-center justify-center backdrop-blur-md"
                    >
                        <MaterialIcons name="bookmark-border" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-4">
                    {/* Visualizer */}
                    <View className="items-center justify-center py-10">
                        <View className="w-40 h-40 rounded-full border-4 border-white shadow-2xl bg-transparent" />
                    </View>

                    {/* Color Details Card */}
                    <View className="bg-white/90 dark:bg-black/80 rounded-3xl p-6 shadow-lg mb-6 backdrop-blur-md">
                        <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">Detalles Técnicos</Text>

                        <View className="flex-row justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                            <Text className="text-gray-500 dark:text-gray-400">HEX</Text>
                            <Text className="font-mono font-bold text-gray-800 dark:text-white">{fullColor.hex}</Text>
                        </View>
                        <View className="flex-row justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                            <Text className="text-gray-500 dark:text-gray-400">RGB</Text>
                            <Text className="font-mono font-bold text-gray-800 dark:text-white">{fullColor.rgb}</Text>
                        </View>
                        <View className="flex-row justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                            <Text className="text-gray-500 dark:text-gray-400">CMYK</Text>
                            <Text className="font-mono font-bold text-gray-800 dark:text-white">{fullColor.cmyk}</Text>
                        </View>
                        <View className="flex-row justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                            <Text className="text-gray-500 dark:text-gray-400">LAB</Text>
                            <Text className="font-mono font-bold text-gray-800 dark:text-white">{fullColor.lab}</Text>
                        </View>
                    </View>

                    {/* Functional Color Triad */}
                    <View className="bg-white/90 dark:bg-black/80 rounded-3xl p-6 shadow-lg mb-8 backdrop-blur-md">
                        <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">Triada de Color</Text>
                        <View className="flex-row justify-between gap-4">
                            {triadColors.map((c, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="flex-1 items-center"
                                    onPress={() => handleTriadPress(c)}
                                >
                                    <View style={{ backgroundColor: c.hex }} className="w-full h-16 rounded-xl mb-2 shadow-sm" />
                                    <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium">{c.hex}</Text>
                                    <View className="absolute bottom-[-20px] bg-primary/10 px-2 rounded">
                                        <Text className="text-[10px] text-primary font-bold">Ver</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            <View className="flex-1 items-center opacity-80">
                                <View style={{ backgroundColor: fullColor.hex }} className="w-full h-16 rounded-xl mb-2 shadow-sm border-2 border-primary" />
                                <Text className="text-xs font-bold text-primary">Actual</Text>
                            </View>
                        </View>
                    </View>

                    <View className="h-10" />

                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default ColorDetailScreen;
