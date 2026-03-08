import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { styled, useColorScheme } from 'nativewind';

const StyledSafeAreaView = styled(SafeAreaView);

export default function SettingsScreen({ navigation }) {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Theme colors
    const iconColor = isDark ? '#EDF2F4' : '#2B2D42';
    const mutedColor = '#8D99AE';
    const primaryColor = '#EF233C';

    // Local state for toggles that don't have backend logic yet
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const SettingsSection = ({ title, children }) => (
        <View className="mb-8">
            <Text className="text-xs text-text-muted-light dark:text-text-muted-dark uppercase font-bold tracking-widest mb-4 ml-2">
                {title}
            </Text>
            <View className="bg-surface-light dark:bg-surface-dark/10 rounded-2xl border border-gray-200/50 dark:border-white/5 overflow-hidden shadow-sm">
                {children}
            </View>
        </View>
    );

    const SettingsItem = ({ icon, label, onPress, value, type = 'button', isLast = false, destructive = false }) => (
        <TouchableOpacity
            onPress={type === 'button' ? onPress : null}
            activeOpacity={type === 'button' ? 0.7 : 1}
            className={`flex-row items-center py-4 px-4 ${!isLast ? 'border-b border-gray-100 dark:border-white/5' : ''}`}
        >
            <View className={`w-10 h-10 rounded-full ${destructive ? 'bg-red-500/10' : 'bg-background-light dark:bg-background-dark/50'} items-center justify-center mr-4`}>
                <MaterialIcons name={icon} size={22} color={destructive ? primaryColor : iconColor} />
            </View>
            <View className="flex-1">
                <Text className={`text-base font-medium ${destructive ? 'text-primary' : 'text-text-light dark:text-text-dark'}`}>
                    {label}
                </Text>
            </View>

            {type === 'button' && (
                <MaterialIcons name="chevron-right" size={24} color={mutedColor} />
            )}

            {type === 'toggle' && (
                <Switch
                    trackColor={{ false: '#8D99AE', true: '#EF233C' }}
                    thumbColor={value ? '#FFFFFF' : '#F4F3F4'}
                    ios_backgroundColor="#8D99AE"
                    onValueChange={onPress}
                    value={value}
                />
            )}

            {type === 'value' && (
                <Text className="text-base text-text-muted-light dark:text-text-muted-dark font-medium">
                    {value}
                </Text>
            )}
        </TouchableOpacity>
    );

    return (
        <StyledSafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            {/* Header */}
            <View className="flex-row items-center justify-center w-full h-14 border-b border-gray-200/50 dark:border-white/5 relative">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-12 h-12 flex items-center justify-center absolute left-2 z-10">
                    <MaterialIcons name="arrow-back-ios" size={24} color={iconColor} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-text-light dark:text-text-dark">
                    Configuración
                </Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}>

                <SettingsSection title="Apariencia">
                    <SettingsItem
                        icon={isDark ? "dark-mode" : "light-mode"}
                        label="Modo Oscuro"
                        type="toggle"
                        value={isDark}
                        onPress={() => setTimeout(() => toggleColorScheme(), 0)}
                        isLast={true}
                    />
                </SettingsSection>

                <SettingsSection title="Cuenta">
                    <SettingsItem
                        icon="lock-outline"
                        label="Cambiar Contraseña"
                        onPress={() => Alert.alert("Próximamente", "La funcionalidad para cambiar contraseña se añadirá pronto.")}
                    />
                    <SettingsItem
                        icon="delete-outline"
                        label="Eliminar Cuenta"
                        destructive={true}
                        onPress={() => Alert.alert(
                            "Eliminar Cuenta",
                            "¿Estás seguro de que quieres eliminar tu cuenta permanentemente? Esta acción es irreversible.",
                            [
                                { text: "Cancelar", style: "cancel" },
                                { text: "Eliminar", style: "destructive", onPress: () => Alert.alert("Operación cancelada", "Eliminación de cuenta desactivada por seguridad temporalmente.") }
                            ]
                        )}
                        isLast={true}
                    />
                </SettingsSection>

                <SettingsSection title="Notificaciones">
                    <SettingsItem
                        icon="notifications-none"
                        label="Permitir Notificaciones"
                        type="toggle"
                        value={notificationsEnabled}
                        onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                        isLast={true}
                    />
                </SettingsSection>

                <SettingsSection title="Información y Ayuda">
                    <SettingsItem
                        icon="help-outline"
                        label="Centro de Ayuda"
                        onPress={() => navigation.navigate('HelpCenter')}
                    />
                    <SettingsItem
                        icon="policy"
                        label="Privacidad y Términos"
                        onPress={() => navigation.navigate('Privacy')}
                    />
                    <SettingsItem
                        icon="info-outline"
                        label="Versión"
                        type="value"
                        value="1.0.0"
                        isLast={true}
                    />
                </SettingsSection>

            </ScrollView>
        </StyledSafeAreaView>
    );
}
