import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { styled, useColorScheme } from 'nativewind';

const StyledSafeAreaView = styled(SafeAreaView);

export default function HelpCenterScreen({ navigation }) {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const iconColor = isDark ? '#EDF2F4' : '#2B2D42';
    const mutedColor = '#8D99AE';

    const FaqItem = ({ question, answer }) => (
        <View className="bg-surface-light dark:bg-surface-dark/10 p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm mb-3">
            <Text className="text-base font-bold text-text-light dark:text-text-dark mb-2">{question}</Text>
            <Text className="text-sm text-text-muted-light dark:text-text-muted-dark leading-5">{answer}</Text>
        </View>
    );

    return (
        <StyledSafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <View className="flex-row items-center justify-center w-full h-14 border-b border-gray-200/50 dark:border-white/5 relative">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-12 h-12 flex items-center justify-center absolute left-2 z-10">
                    <MaterialIcons name="arrow-back-ios" size={24} color={iconColor} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-text-light dark:text-text-dark">
                    Centro de Ayuda
                </Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}>
                <View className="items-center mb-8">
                    <View className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full items-center justify-center mb-4">
                        <MaterialIcons name="support-agent" size={32} color="#EF233C" />
                    </View>
                    <Text className="text-xl font-bold text-text-light dark:text-text-dark mb-2 text-center">
                        ¿Cómo podemos ayudarte?
                    </Text>
                    <Text className="text-sm text-text-muted-light dark:text-text-muted-dark text-center">
                        Encuentra respuestas rápidas o contáctanos si necesitas más asistencia.
                    </Text>
                </View>

                <Text className="text-sm text-text-light dark:text-text-dark font-bold uppercase mb-4 ml-1">Preguntas Frecuentes (FAQ)</Text>

                <FaqItem
                    question="¿Cómo guardo un color en favoritos?"
                    answer="Una vez hayas escaneado un color, toca el botón de la estrella (guardar) en la vista de detalle. También puedes hacerlo desde el Historial reciente."
                />

                <FaqItem
                    question="¿Qué tipos de visión simula la app?"
                    answer="Puedes cambiar a Protanopia (dificultad para rojo), Deuteranopia (dificultad para verde), y Tritanopia (dificultad para azul) en la pestaña del Simulador."
                />

                <FaqItem
                    question="¿Por qué la cámara me pide permisos?"
                    answer="HueX requiere acceso a la cámara para poder capturar imágenes y detectar el color real centrado en la pantalla de manera instantánea y precisa."
                />

                <FaqItem
                    question="¿Dónde se guardan mis colores comprobados?"
                    answer="Puedes encontrar tu historial de colores en la pantalla de 'Historial' desde la pantalla principal, o pulsando en tu Perfil > 'Mi Actividad'."
                />

                <View className="mt-6 p-4 bg-primary/10 dark:bg-primary/20 rounded-xl items-center border border-primary/20">
                    <Text className="text-base font-bold text-text-light dark:text-text-dark mb-2 text-center">¿No encuentras lo que buscas?</Text>
                    <Text className="text-sm text-text-muted-light dark:text-text-muted-dark text-center mb-4">Envíanos un correo y el equipo de HueX te ayudará a resolverlo rápidamente.</Text>
                    <TouchableOpacity
                        className="bg-primary px-6 py-3 rounded-xl w-full"
                        onPress={() => Linking.openURL('mailto:soporte@huex.com')}
                    >
                        <Text className="text-white text-center font-bold">Contactar con Soporte</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </StyledSafeAreaView>
    );
}
