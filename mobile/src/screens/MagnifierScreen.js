import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

const MagnifierScreen = ({ navigation }) => {
    const [zoom, setZoom] = useState(0);
    const [permission, requestPermission] = useCameraPermissions();
    const [flashMode, setFlashMode] = useState('off');

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View className="flex-1 justify-center items-center p-4 bg-background-dark">
                <Text className="text-white text-lg mb-4">Necesitamos permiso para usar la cámara</Text>
                <TouchableOpacity onPress={requestPermission} className="bg-primary p-3 rounded-lg">
                    <Text className="text-white font-bold">Conceder Permiso</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const toggleFlash = () => {
        setFlashMode(prev => prev === 'off' ? 'on' : 'off');
    };

    return (
        <View className="flex-1 bg-background-dark">
            <CameraView
                style={{ flex: 1 }}
                facing="back"
                zoom={zoom}
                enableTorch={flashMode === 'on'}
            >
                <SafeAreaView className="flex-1 justify-between">
                    {/* Header */}
                    <View className="flex-row justify-between p-4">
                        <TouchableOpacity
                            onPress={toggleFlash}
                            className="w-12 h-12 rounded-full bg-black/50 items-center justify-center backdrop-blur-sm"
                        >
                            <MaterialIcons name={flashMode === 'on' ? "flash-on" : "flash-off"} size={24} color="#EDF2F4" />
                        </TouchableOpacity>
                        <TouchableOpacity className="w-12 h-12 rounded-full bg-black/50 items-center justify-center backdrop-blur-sm">
                            <MaterialIcons name="settings" size={24} color="#EDF2F4" />
                        </TouchableOpacity>
                    </View>

                    {/* Center Overlay */}
                    <View className="items-center justify-center">
                        <View className="w-8 h-8 relative">
                            <View className="absolute top-0 left-1/2 w-[1px] h-2 bg-white -translate-x-1/2" />
                            <View className="absolute bottom-0 left-1/2 w-[1px] h-2 bg-white -translate-x-1/2" />
                            <View className="absolute left-0 top-1/2 h-[1px] w-2 bg-white -translate-y-1/2" />
                            <View className="absolute right-0 top-1/2 h-[1px] w-2 bg-white -translate-y-1/2" />
                            <View className="w-full h-full rounded-full border border-white" />
                        </View>
                    </View>

                    {/* Footer Controls */}
                    <View className="p-4 pb-8 items-center gap-6">
                        {/* Zoom Slider Placeholder */}
                        <View className="w-full max-w-sm bg-black/50 p-4 rounded-xl backdrop-blur-sm">
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-white font-medium">Zoom</Text>
                                <Text className="text-white font-bold">{(zoom * 10 + 1).toFixed(1)}x</Text>
                            </View>
                            <View className="flex-row items-center gap-4">
                                <TouchableOpacity onPress={() => setZoom(Math.max(0, zoom - 0.1))}><MaterialIcons name="remove" size={24} color="white" /></TouchableOpacity>
                                <View className="flex-1 h-1.5 bg-gray-500 rounded-full overflow-hidden">
                                    <View style={{ width: `${zoom * 100}%` }} className="h-full bg-primary" />
                                </View>
                                <TouchableOpacity onPress={() => setZoom(Math.min(1, zoom + 0.1))}><MaterialIcons name="add" size={24} color="white" /></TouchableOpacity>
                            </View>
                        </View>

                        {/* Capture Button */}
                        <TouchableOpacity className="w-20 h-20 rounded-full border-4 border-white items-center justify-center">
                            <View className="w-[72px] h-[72px] bg-primary rounded-full" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </CameraView>
        </View>
    );
};

export default MagnifierScreen;
