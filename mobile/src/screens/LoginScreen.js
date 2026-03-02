import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import authService from '../services/authService';
import syncService from '../services/syncService';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const iconColor = isDark ? '#EDF2F4' : '#2B2D42';
    const mutedColor = '#8D99AE';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Animated color circles for the branding area
    const pulse1 = useRef(new Animated.Value(1)).current;
    const pulse2 = useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse1, { toValue: 1.15, duration: 2000, useNativeDriver: true }),
                Animated.timing(pulse1, { toValue: 1, duration: 2000, useNativeDriver: true }),
            ])
        ).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse2, { toValue: 0.85, duration: 2500, useNativeDriver: true }),
                Animated.timing(pulse2, { toValue: 1, duration: 2500, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Campos requeridos', 'Por favor, rellena todos los campos.');
            return;
        }

        setLoading(true);
        const result = await authService.login(email, password);
        setLoading(false);

        if (result.success) {
            syncService.sync().catch(err => {
                console.log('Sync failed, will retry later:', err);
            });
            navigation.replace('Main');
        } else {
            Alert.alert('Error de inicio de sesión', result.error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 justify-between px-6 py-4">

                    {/* === Top Branding Area === */}
                    <View className="items-center mt-8 mb-4">
                        {/* Animated Color Orbs */}
                        <View className="w-40 h-40 items-center justify-center mb-6">
                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    width: 100,
                                    height: 100,
                                    borderRadius: 50,
                                    backgroundColor: '#EF233C',
                                    opacity: 0.2,
                                    transform: [{ scale: pulse1 }],
                                    top: 0,
                                    left: 10,
                                }}
                            />
                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    backgroundColor: '#2B2D42',
                                    opacity: 0.15,
                                    transform: [{ scale: pulse2 }],
                                    bottom: 0,
                                    right: 10,
                                }}
                            />
                            <View
                                style={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: 36,
                                    backgroundColor: '#EF233C',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    shadowColor: '#EF233C',
                                    shadowOffset: { width: 0, height: 6 },
                                    shadowOpacity: 0.35,
                                    shadowRadius: 12,
                                    elevation: 10,
                                }}
                            >
                                <MaterialIcons name="palette" size={36} color="#fff" />
                            </View>
                        </View>

                        <Text className="text-3xl font-bold text-text-light dark:text-text-dark tracking-tight">
                            HueX
                        </Text>
                        <Text className="text-base text-text-muted-light dark:text-text-muted-dark mt-1">
                            Tu mundo en color
                        </Text>
                    </View>

                    {/* === Form Area === */}
                    <View className="mb-4">
                        {/* Email Input */}
                        <View className="bg-surface-light dark:bg-surface-dark/20 rounded-xl mb-3 flex-row items-center px-4 border border-gray-200/60 dark:border-white/10">
                            <MaterialIcons name="email" size={20} color={mutedColor} />
                            <TextInput
                                className="flex-1 py-4 px-3 text-base text-text-light dark:text-text-dark"
                                placeholder="Correo electrónico"
                                placeholderTextColor="#8D99AE"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                editable={!loading}
                            />
                        </View>

                        {/* Password Input */}
                        <View className="bg-surface-light dark:bg-surface-dark/20 rounded-xl mb-5 flex-row items-center px-4 border border-gray-200/60 dark:border-white/10">
                            <MaterialIcons name="lock" size={20} color={mutedColor} />
                            <TextInput
                                className="flex-1 py-4 px-3 text-base text-text-light dark:text-text-dark"
                                placeholder="Contraseña"
                                placeholderTextColor="#8D99AE"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <MaterialIcons
                                    name={showPassword ? 'visibility' : 'visibility-off'}
                                    size={20}
                                    color={mutedColor}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            style={{
                                backgroundColor: '#EF233C',
                                borderRadius: 12,
                                paddingVertical: 16,
                                alignItems: 'center',
                                shadowColor: '#EF233C',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 6,
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white text-lg font-bold">Iniciar Sesión</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* === Bottom Links === */}
                    <View className="items-center mb-4">
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                            disabled={loading}
                            className="mb-4"
                        >
                            <Text className="text-text-muted-light dark:text-text-muted-dark text-sm">
                                ¿No tienes cuenta?{' '}
                                <Text className="text-primary font-bold">Regístrate</Text>
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.replace('Main')}
                            disabled={loading}
                            className="flex-row items-center gap-1 py-2 px-4 rounded-full bg-surface-light dark:bg-surface-dark/20 border border-gray-200/50 dark:border-white/10"
                        >
                            <MaterialIcons name="explore" size={16} color={mutedColor} />
                            <Text className="text-text-muted-light dark:text-text-muted-dark text-sm">
                                Explorar sin cuenta
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
