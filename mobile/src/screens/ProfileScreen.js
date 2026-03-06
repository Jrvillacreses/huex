import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { styled,  useColorScheme  } from 'nativewind';
import authService from '../services/authService';

const StyledSafeAreaView = styled(SafeAreaView);

export default function ProfileScreen({ navigation }) {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const iconColor = isDark ? '#EDF2F4' : '#2B2D42';
    const mutedColor = '#8D99AE';

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    };

    const handleLogout = () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que quieres cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: async () => {
                        await authService.logout();
                        navigation.replace('Login');
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <StyledSafeAreaView className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center">
                <ActivityIndicator size="large" color="#EF233C" />
            </StyledSafeAreaView>
        );
    }

    if (!user) {
        return (
            <StyledSafeAreaView className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center px-6">
                <View className="items-center">
                    <View
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: '#EF233C',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 24,
                            shadowColor: '#EF233C',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.25,
                            shadowRadius: 8,
                            elevation: 6,
                        }}
                    >
                        <MaterialIcons name="person-outline" size={40} color="#fff" />
                    </View>

                    <Text className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
                        Sin sesión iniciada
                    </Text>
                    <Text className="text-text-muted-light dark:text-text-muted-dark text-center mb-8">
                        Inicia sesión para sincronizar tus colores y acceder a tu perfil.
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        style={{
                            backgroundColor: '#EF233C',
                            borderRadius: 12,
                            paddingVertical: 14,
                            paddingHorizontal: 32,
                            shadowColor: '#EF233C',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6,
                        }}
                    >
                        <Text className="text-white text-base font-bold">Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </StyledSafeAreaView>
        );
    }

    const MenuButton = ({ icon, label, onPress, color = iconColor }) => (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center py-4 px-4 bg-surface-light dark:bg-surface-dark/10 rounded-2xl mb-3 border border-gray-200/50 dark:border-white/5 active:opacity-70 shadow-sm"
        >
            <View className="w-10 h-10 rounded-full bg-background-light dark:bg-background-dark/50 items-center justify-center mr-4">
                <MaterialIcons name={icon} size={22} color={color} />
            </View>
            <View className="flex-1">
                <Text className="text-base font-semibold text-text-light dark:text-text-dark">{label}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={mutedColor} />
        </TouchableOpacity>
    );

    return (
        <StyledSafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
                {/* --- Header Section --- */}
                <View className="items-center mt-6 mb-8">
                    <View
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: '#EF233C',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16,
                            shadowColor: '#EF233C',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.4,
                            shadowRadius: 15,
                            elevation: 12,
                        }}
                    >
                        <Text style={{ fontSize: 44, fontWeight: 'bold', color: '#fff' }}>
                            {user.username?.charAt(0).toUpperCase()}
                        </Text>
                    </View>

                    <Text className="text-2xl font-bold text-text-light dark:text-text-dark tracking-tight">
                        {user.username}
                    </Text>
                    <Text className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                        {user.email}
                    </Text>

                    <TouchableOpacity
                        className="mt-4 px-4 py-2 bg-white dark:bg-surface-dark/20 rounded-full border border-gray-200 dark:border-white/10"
                        onPress={() => Alert.alert("ID de Usuario", user.id)}
                    >
                        <Text className="text-xs font-mono text-text-muted-light dark:text-text-muted-dark">ID: {user.id.substring(0, 8)}...</Text>
                    </TouchableOpacity>
                </View>

                {/* --- My Activity Section --- */}
                <View className="mb-6">
                    <Text className="text-xs text-text-muted-light dark:text-text-muted-dark uppercase font-bold tracking-widest mb-4 ml-2">
                        Mi Actividad
                    </Text>

                    <MenuButton
                        icon="history"
                        label="Historial de Mediciones"
                        onPress={() => navigation.navigate('History')}
                    />

                    <MenuButton
                        icon="bookmark"
                        label="Colores Favoritos"
                        onPress={() => navigation.navigate('Favorites')}
                    />
                </View>

                {/* --- Settings Section --- */}
                <View className="mb-8">
                    <Text className="text-xs text-text-muted-light dark:text-text-muted-dark uppercase font-bold tracking-widest mb-4 ml-2">
                        Ajustes y Ayuda
                    </Text>

                    <MenuButton
                        icon="settings"
                        label="Configuración"
                        onPress={() => Alert.alert("Próximamente", "Ajustes de la aplicación")}
                    />

                    <MenuButton
                        icon="help-outline"
                        label="Centro de Ayuda"
                        onPress={() => Alert.alert("Próximamente", "Tutoriales y FAQ")}
                    />

                    <MenuButton
                        icon="policy"
                        label="Privacidad y Términos"
                        onPress={() => Alert.alert("Privacidad", "Normalización de Color HueX")}
                    />
                </View>

                {/* --- Danger Zone / Logout --- */}
                <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center justify-center py-4 bg-red-500/10 rounded-2xl border border-red-500/20"
                >
                    <MaterialIcons name="logout" size={20} color="#EF233C" />
                    <Text className="ml-2 text-primary font-bold text-base">
                        Cerrar Sesión
                    </Text>
                </TouchableOpacity>

                <View className="mt-8 items-center">
                    <Text className="text-[10px] text-text-muted-light dark:text-text-muted-dark font-mono uppercase tracking-widest">
                        HueX v1.0.0 • 2026
                    </Text>
                </View>
            </ScrollView>
        </StyledSafeAreaView>
    );
}
