import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { styled,  useColorScheme  } from 'nativewind';
import VisionFilter from '../components/VisionFilter';
import { useIsFocused } from '@react-navigation/native';

const StyledSafeAreaView = styled(SafeAreaView);

const SCREEN_WIDTH = Dimensions.get('window').width;

const SimulatorScreen = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [mode, setMode] = useState('Normal');
    const [source, setSource] = useState('gallery'); // 'camera' or 'gallery'
    const [imageUri, setImageUri] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuDeb8qX6HbPloOSd4DRvOBLmDTlPaZvDsW8Ty_y6EPl87Llw9IbhLR93jcG35v7B1C9dOw506ckVRHfz4lP2I9yFSvbwJm_2m7B9pvhg-RZQYm0HpNhnXVw8_tbBpkXaPpAQPMIQJJ8O9ioXV3TP_cp62s1faoaL-2pz-QpCNh0mGP-pr6lLXVfyttNm-UnkFpMDLvZYSChx5s6N7U-XRrVA5tzgTjdi7HuYdfk0KlfMVvwtb2wnR4dvpMAby5VV1SZwbfFAoMQCiU'); // Default image
    const [capturedImage, setCapturedImage] = useState(null);
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const iconColor = isDark ? '#EDF2F4' : '#2B2D42';

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setSource('gallery');
            setCapturedImage(null);
        }
    };

    const takePicture = async () => {
        if (cameraRef.current && !isCapturing) {
            setIsCapturing(true);
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                });
                setCapturedImage(photo.uri);
            } catch (error) {
                console.error("Capture failed:", error);
            } finally {
                setIsCapturing(false);
            }
        }
    };

    const modes = ['Normal', 'Protanopia', 'Deuteranopia', 'Tritanopia'];

    return (
        <StyledSafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 h-14">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center">
                    <MaterialIcons name="arrow-back-ios" size={24} color={iconColor} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-text-light dark:text-text-dark">Simulador de Visión</Text>
                <TouchableOpacity className="w-10 h-10 items-center justify-center">
                    <MaterialIcons name="help-outline" size={24} color={iconColor} />
                </TouchableOpacity>
            </View>

            <View className="flex-1 p-4 pt-0 justify-between">
                {/* Main Content Area */}
                <View className="flex-1 items-center justify-center gap-4">
                    {source === 'camera' ? (
                        <View className="w-full h-3/4 rounded-xl overflow-hidden bg-black relative">
                            {capturedImage ? (
                                <View className="flex-1 w-full items-center justify-center">
                                    <VisionFilter
                                        mode={mode}
                                        imageUri={capturedImage}
                                        width={SCREEN_WIDTH - 32}
                                        height={(SCREEN_WIDTH - 32) * 1.2} // Approximate aspect ratio
                                    />
                                    <TouchableOpacity
                                        onPress={() => setCapturedImage(null)}
                                        className="absolute bottom-4 right-4 bg-black/60 p-3 rounded-full z-10"
                                    >
                                        <MaterialIcons name="refresh" size={24} color="white" />
                                    </TouchableOpacity>
                                    <View className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full pointer-events-none z-10">
                                        <Text className="text-white font-bold">{mode}</Text>
                                    </View>
                                </View>
                            ) : (
                                permission && permission.granted && isFocused ? (
                                    <>
                                        <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef} />
                                        <View className="absolute bottom-6 self-center z-50">
                                            <TouchableOpacity
                                                onPress={takePicture}
                                                disabled={isCapturing}
                                                className={`w-16 h-16 rounded-full border-4 border-white items-center justify-center ${isCapturing ? 'opacity-50' : ''}`}
                                            >
                                                <View className={`w-14 h-14 rounded-full ${isCapturing ? 'bg-gray-400' : 'bg-primary'}`} />
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                ) : (
                                    <View className="flex-1 items-center justify-center">
                                        {!isFocused ? (
                                            <Text className="text-white">Cámara en pausa</Text>
                                        ) : (
                                            <>
                                                <Text className="text-white mb-2">Permiso de cámara requerido</Text>
                                                <TouchableOpacity onPress={requestPermission} className="bg-primary px-4 py-2 rounded-full">
                                                    <Text className="text-white">Conceder</Text>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    </View>
                                )
                            )}
                        </View>
                    ) : (
                        <View className="w-full h-3/4 rounded-xl overflow-hidden bg-surface-light dark:bg-surface-dark/20 shadow-sm items-center justify-center">
                            {imageUri ? (
                                <VisionFilter
                                    mode={mode}
                                    imageUri={imageUri}
                                    width={SCREEN_WIDTH - 32}
                                    height={(SCREEN_WIDTH - 32) * 1.2}
                                />
                            ) : (
                                <View className="items-center gap-4 p-6 text-center">
                                    <MaterialIcons name="image" size={48} color="#8D99AE" />
                                    <Text className="text-text-muted-light">Selecciona una imagen</Text>
                                </View>
                            )}
                        </View>
                    )}

                    <View className="flex-row w-full max-w-md gap-4">
                        <TouchableOpacity
                            onPress={pickImage}
                            className={`flex-1 h-14 items-center justify-center rounded-xl shadow-sm ${source === 'gallery' ? 'bg-primary' : 'bg-surface-light dark:bg-surface-dark/20'}`}
                        >
                            <MaterialIcons name="photo-library" size={24} color={source === 'gallery' ? 'white' : '#8D99AE'} />
                            <Text className={`text-xs font-medium ${source === 'gallery' ? 'text-white' : 'text-text-light dark:text-text-dark'}`}>Galería</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setSource('camera');
                                setCapturedImage(null);
                            }}
                            className={`flex-1 h-14 items-center justify-center rounded-xl shadow-sm ${source === 'camera' ? 'bg-primary' : 'bg-surface-light dark:bg-surface-dark/20'}`}
                        >
                            <MaterialIcons name="photo-camera" size={24} color={source === 'camera' ? 'white' : '#8D99AE'} />
                            <Text className={`text-xs font-medium ${source === 'camera' ? 'text-white' : 'text-text-light dark:text-text-dark'}`}>Cámara</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Mode Selector */}
                <View className="mt-6 items-center">
                    <View className="flex-row w-full max-w-md bg-surface-light dark:bg-surface-dark/20 rounded-xl p-1 shadow-sm">
                        {modes.map((m) => (
                            <TouchableOpacity
                                key={m}
                                onPress={() => setMode(m)}
                                className={`flex-1 py-2 items-center justify-center rounded-lg ${mode === m ? 'bg-primary shadow-md' : ''}`}
                            >
                                <Text
                                    numberOfLines={1}
                                    className={`text-xs font-medium ${mode === m ? 'text-white' : 'text-text-muted-light dark:text-text-muted-dark'}`}
                                >
                                    {m}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </StyledSafeAreaView>
    );
};

export default SimulatorScreen;
