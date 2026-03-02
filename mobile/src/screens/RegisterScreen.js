import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import authService from '../services/authService';

export default function RegisterScreen({ navigation }) {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const iconColor = isDark ? '#EDF2F4' : '#2B2D42';
    const mutedColor = '#8D99AE';

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleRegister = async () => {
        if (!email || !username || !password || !confirmPassword) {
            Alert.alert('Campos requeridos', 'Por favor, rellena todos los campos.');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Email inválido', 'Por favor, introduce un email válido.');
            return;
        }

        if (username.length < 3) {
            Alert.alert('Usuario corto', 'El nombre de usuario debe tener al menos 3 caracteres.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Contraseña corta', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        const result = await authService.register(email, username, password);
        setLoading(false);

        if (result.success) {
            Alert.alert(
                '¡Cuenta creada!',
                'Tu cuenta se ha creado con éxito.',
                [{ text: 'Vamos', onPress: () => navigation.replace('Main') }]
            );
        } else {
            Alert.alert('Error de registro', result.error);
        }
    };

    const InputField = ({ icon, placeholder, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize, showToggle }) => (
        <View className="bg-surface-light dark:bg-surface-dark/20 rounded-xl mb-3 flex-row items-center px-4 border border-gray-200/60 dark:border-white/10">
            <MaterialIcons name={icon} size={20} color={mutedColor} />
            <TextInput
                className="flex-1 py-4 px-3 text-base text-text-light dark:text-text-dark"
                placeholder={placeholder}
                placeholderTextColor="#8D99AE"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry && !showPassword}
                keyboardType={keyboardType || 'default'}
                autoCapitalize={autoCapitalize || 'none'}
                editable={!loading}
            />
            {showToggle && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons
                        name={showPassword ? 'visibility' : 'visibility-off'}
                        size={20}
                        color={mutedColor}
                    />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    keyboardShouldPersistTaps="handled"
                    className="px-6"
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 rounded-full bg-surface-light dark:bg-surface-dark/20 items-center justify-center mb-4 border border-gray-200/50 dark:border-white/10"
                    >
                        <MaterialIcons name="arrow-back-ios" size={18} color={mutedColor} style={{ marginLeft: 4 }} />
                    </TouchableOpacity>

                    {/* Header */}
                    <View className="mb-8">
                        <Text className="text-3xl font-bold text-text-light dark:text-text-dark tracking-tight">
                            Crear Cuenta
                        </Text>
                        <Text className="text-base text-text-muted-light dark:text-text-muted-dark mt-2">
                            Únete a HueX y guarda tus colores
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="mb-6">
                        <InputField
                            icon="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />

                        <InputField
                            icon="person"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChangeText={setUsername}
                        />

                        <InputField
                            icon="lock"
                            placeholder="Contraseña (mín. 6 caracteres)"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            showToggle
                        />

                        <InputField
                            icon="lock-outline"
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />

                        {/* Register Button */}
                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={loading}
                            style={{
                                backgroundColor: '#EF233C',
                                borderRadius: 12,
                                paddingVertical: 16,
                                alignItems: 'center',
                                marginTop: 8,
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
                                <Text className="text-white text-lg font-bold">Crear Cuenta</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Link */}
                    <View className="items-center mb-8">
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            disabled={loading}
                        >
                            <Text className="text-text-muted-light dark:text-text-muted-dark text-sm">
                                ¿Ya tienes cuenta?{' '}
                                <Text className="text-primary font-bold">Inicia sesión</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
