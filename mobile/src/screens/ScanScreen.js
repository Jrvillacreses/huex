import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as ImageManipulator from 'expo-image-manipulator';
import { rgbToHex, getColorName, rgbToLab, rgbToCmyk } from '../utils/colorUtils';
import localStorageService from '../services/localStorageService';
import authService from '../services/authService';
import syncService from '../services/syncService';
import { useIsFocused } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

const ScanScreen = ({ navigation }) => {
    const isFocused = useIsFocused();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const iconColor = isDark ? '#EDF2F4' : '#2B2D42';
    const mutedIconColor = '#8D99AE';
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const webViewRef = useRef(null);

    // State
    const [hasScanned, setHasScanned] = useState(false);
    const [scannedColor, setScannedColor] = useState(null);
    const [zoom, setZoom] = useState(0);
    const [loading, setLoading] = useState(false);

    // --- Message Handler (One-shot) ---
    const onMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.r !== undefined) {
                const { r, g, b } = data;
                const hex = rgbToHex(r, g, b);

                let c = 0, m = 0, y = 0, k = 0;
                if (r === 0 && g === 0 && b === 0) { k = 100; }
                else {
                    const cmyk = rgbToCmyk(r, g, b);
                    c = cmyk.c; m = cmyk.m; y = cmyk.y; k = cmyk.k;
                }

                const lab = rgbToLab(r, g, b);
                const labString = `L:${lab.l} A:${lab.a} B:${lab.b}`;

                const resultColor = {
                    hex,
                    rgb: `${r}, ${g}, ${b}`,
                    cmyk: `${c}, ${m}, ${y}, ${k}`,
                    lab: labString,
                    name: getColorName(hex),
                };

                setScannedColor(resultColor);

                // Save to local history automatically
                localStorageService.addHistory({
                    hex: resultColor.hex,
                    rgb: resultColor.rgb,
                    name: resultColor.name,
                    cmyk: resultColor.cmyk,
                    lab: resultColor.lab,
                }).then(async () => {
                    // Sync if authenticated
                    const isAuth = await authService.isAuthenticated();
                    if (isAuth) {
                        syncService.sync().catch(err => console.log('Sync queued'));
                    }
                }).catch(err => console.log("History Save Error", err));

                setHasScanned(true);
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
        }
    };

    // --- Single-Shot Action ---
    const handleScanCommit = async () => {
        if (cameraRef.current && !loading) {
            setLoading(true);
            try {
                // High Quality for Final Result
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 1.0,
                    skipProcessing: true,
                    shutterSound: false,
                });

                const { width, height } = photo;
                const cropSize = 30;
                const safeCropSize = Math.min(cropSize, width, height);
                const originX = Math.max(0, (width - safeCropSize) / 2);
                const originY = Math.max(0, (height - safeCropSize) / 2);

                const manipResult = await ImageManipulator.manipulateAsync(
                    photo.uri,
                    [{ crop: { originX, originY, width: safeCropSize, height: safeCropSize } }, { resize: { width: 1, height: 1 } }],
                    { base64: true, format: ImageManipulator.SaveFormat.PNG }
                );

                const base64Image = `data:image/png;base64,${manipResult.base64}`;
                const injectScript = `getColor('${base64Image}'); true;`;
                webViewRef.current?.injectJavaScript(injectScript);

            } catch (e) {
                setLoading(false);
            }
        }
    };

    const handleReset = () => {
        setHasScanned(false);
        setScannedColor(null);
    };

    const handleSaveFavorite = async () => {
        const colorToSave = scannedColor;
        if (!colorToSave) return;
        try {
            // Save locally
            await localStorageService.addFavorite({
                hex: colorToSave.hex,
                rgb: colorToSave.rgb,
                cmyk: colorToSave.cmyk,
                lab: colorToSave.lab,
                name: colorToSave.name,
            });

            // Sync if authenticated
            const isAuth = await authService.isAuthenticated();
            if (isAuth) {
                syncService.sync().catch(err => console.log('Sync queued'));
            }

            Alert.alert("Guardado", "Añadido a favoritos");
        } catch (error) {
            console.error("Save Fav Error:", error);
            Alert.alert("Error", "No se pudo guardar");
        }
    };

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View className="flex-1 justify-center items-center p-4 bg-background-light dark:bg-background-dark">
                <Text>Necesitamos permiso de cámara</Text>
                <TouchableOpacity onPress={requestPermission}><Text>Conceder</Text></TouchableOpacity>
            </View>
        );
    }

    const htmlContent = `
    <html><body><script>
      function getColor(base64) {
        var img = new Image();
        img.onload = function() {
          var canvas = document.createElement('canvas');
          canvas.width = 1; height = 1;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, 1, 1);
          var p = ctx.getImageData(0, 0, 1, 1).data;
          window.ReactNativeWebView.postMessage(JSON.stringify({r: p[0], g: p[1], b: p[2]}));
        };
        img.onerror = function() { window.ReactNativeWebView.postMessage(JSON.stringify({error: 'Image load failed'})); };
        img.src = base64;
      }
    </script></body></html>`;

    // Static display data
    const detailsColor = { ...(scannedColor || { name: 'Detectando...', hex: '---', rgb: '---', cmyk: '---', lab: '---' }) };

    return (
        <View className="flex-1 bg-background-light dark:bg-background-dark">
            <View style={{ height: 0, width: 0, overflow: 'hidden' }}>
                <WebView ref={webViewRef} source={{ html: htmlContent }} onMessage={onMessage} javaScriptEnabled={true} />
            </View>

            {/* MAIN CONTENT AREA */}
            <View style={{ flex: 1, backgroundColor: 'black' }} className="relative">
                {/* 1. CAMERA LAYOUT */}
                <View
                    style={{
                        width: '100%',
                        height: hasScanned ? '50%' : '100%',
                    }}
                    className="relative overflow-hidden"
                >
                    {isFocused && (
                        <CameraView style={{ flex: 1 }} ref={cameraRef} facing="back" zoom={zoom} />
                    )}

                    {/* OVERLAYS - ONLY visible when !hasScanned */}
                    {!hasScanned && (
                        <>
                            {/* Clear Reticle Target */}
                            <View style={{ position: 'absolute', inset: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10 }} pointerEvents="none">
                                {/* Outer Ring */}
                                <View className="w-16 h-16 items-center justify-center rounded-full border-2 border-white shadow-lg bg-transparent">
                                    {/* Crosshair Lines */}
                                    <View className="absolute w-4 h-[2px] bg-white opacity-80" />
                                    <View className="absolute h-4 w-[2px] bg-white opacity-80" />
                                </View>
                            </View>

                            {/* CONTROLS */}
                            <View className="absolute bottom-12 w-full items-center z-50 gap-6">
                                {/* Zoom Controls */}
                                <View className="w-[90%] bg-black/40 p-2 rounded-xl backdrop-blur-sm flex-row items-center justify-between gap-4">
                                    <TouchableOpacity
                                        onPress={() => setZoom(Math.max(0, zoom - 0.1))}
                                        className="w-10 h-10 items-center justify-center bg-white/20 rounded-full"
                                    >
                                        <MaterialIcons name="remove" size={24} color="white" />
                                    </TouchableOpacity>

                                    <View className="flex-1 h-3 bg-gray-500/50 rounded-full overflow-hidden relative mx-2">
                                        <View style={{ width: `${zoom * 100}%` }} className="h-full bg-white transition-all" />
                                    </View>
                                    <Text className="text-white text-xs font-bold w-8 text-right">{(zoom * 10 + 1).toFixed(1)}x</Text>

                                    <TouchableOpacity
                                        onPress={() => setZoom(Math.min(1, zoom + 0.1))}
                                        className="w-10 h-10 items-center justify-center bg-white/20 rounded-full"
                                    >
                                        <MaterialIcons name="add" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>

                                {/* Big Scan Button */}
                                <TouchableOpacity
                                    onPress={handleScanCommit}
                                    disabled={loading}
                                    className="w-20 h-20 rounded-full bg-white border-4 border-gray-200 items-center justify-center shadow-xl"
                                >
                                    <View className={`w-16 h-16 rounded-full items-center justify-center border-2 border-white ${loading ? 'bg-green-500' : 'bg-primary'}`}>
                                        {loading ? (
                                            <MaterialIcons name="hourglass-empty" size={32} color="white" />
                                        ) : (
                                            <MaterialIcons name="camera" size={32} color="white" />
                                        )}
                                    </View>
                                </TouchableOpacity>

                                <Text className="text-white/80 font-medium text-sm bg-black/20 px-4 py-1 rounded-full backdrop-blur-md">
                                    Apunte y presione para escanear
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                {/* 2. RESULT PANEL */}
                {hasScanned && (
                    <View style={{ flex: 1 }} className="bg-background-light dark:bg-background-dark rounded-t-3xl -mt-6 overflow-hidden">
                        <ScrollView contentContainerStyle={{ paddingTop: 32, paddingHorizontal: 24, paddingBottom: 150 }}>
                            {/* Header */}
                            <View className="flex-row items-center gap-4 mb-6">
                                <View style={{ backgroundColor: detailsColor.hex }} className="w-16 h-16 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm" />
                                <View className="flex-1">
                                    <Text className="text-2xl font-bold text-text-light dark:text-text-dark" numberOfLines={2}>{detailsColor.name}</Text>
                                    <Text className="text-text-muted-light dark:text-text-muted-dark font-mono">{detailsColor.hex}</Text>
                                </View>
                            </View>

                            {/* Actions */}
                            <View className="flex-row gap-3 mb-6">
                                <TouchableOpacity onPress={() => Alert.alert("Info", `Color: ${detailsColor.name}`)} className="flex-1 bg-surface-light dark:bg-surface-dark py-3 rounded-xl items-center justify-center border border-gray-200 dark:border-gray-700">
                                    <MaterialIcons name="volume-up" size={24} color={iconColor} />
                                    <Text className="text-[10px] text-text-muted-light mt-1">Audio</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleSaveFavorite} className="flex-1 bg-surface-light dark:bg-surface-dark py-3 rounded-xl items-center justify-center border border-gray-200 dark:border-gray-700">
                                    <MaterialIcons name="bookmark" size={24} color={iconColor} />
                                    <Text className="text-[10px] text-text-muted-light mt-1">Guardar</Text>
                                </TouchableOpacity>

                                {/* Reset */}
                                <TouchableOpacity onPress={handleReset} className="flex-[1.2] bg-primary py-3 rounded-xl items-center justify-center shadow-lg">
                                    <MaterialIcons name="refresh" size={24} color="white" />
                                    <Text className="text-white text-[10px] font-bold mt-1">NUEVO</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Data Grid */}
                            <View className="grid grid-cols-2 gap-3 mb-6">
                                <View className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <Text className="text-[10px] text-text-muted-light dark:text-text-muted-dark uppercase font-bold mb-1">RGB</Text>
                                    <Text className="text-text-light dark:text-text-dark font-mono font-medium">{detailsColor.rgb}</Text>
                                </View>
                                <View className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <Text className="text-[10px] text-text-muted-light dark:text-text-muted-dark uppercase font-bold mb-1">CMYK</Text>
                                    <Text className="text-text-light dark:text-text-dark font-mono font-medium">{detailsColor.cmyk}</Text>
                                </View>
                                <View className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800 col-span-2">
                                    <Text className="text-[10px] text-text-muted-light dark:text-text-muted-dark uppercase font-bold mb-1">LAB</Text>
                                    <Text className="text-text-light dark:text-text-dark font-mono font-medium">{detailsColor.lab}</Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                )}
            </View>
        </View>
    );
};

export default ScanScreen;
