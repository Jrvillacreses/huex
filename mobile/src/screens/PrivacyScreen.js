import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { styled, useColorScheme } from 'nativewind';

const StyledSafeAreaView = styled(SafeAreaView);

export default function PrivacyScreen({ navigation }) {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const iconColor = isDark ? '#EDF2F4' : '#2B2D42';

    const SectionTitle = ({ children }) => (
        <Text className="text-lg font-bold text-text-light dark:text-text-dark mt-6 mb-2">
            {children}
        </Text>
    );

    const Paragraph = ({ children }) => (
        <Text className="text-sm text-text-muted-light dark:text-text-muted-dark leading-6 mb-3 text-justify">
            {children}
        </Text>
    );

    return (
        <StyledSafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <View className="flex-row items-center justify-center w-full h-14 border-b border-gray-200/50 dark:border-white/5 relative">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-12 h-12 flex items-center justify-center absolute left-2 z-10">
                    <MaterialIcons name="arrow-back-ios" size={24} color={iconColor} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-text-light dark:text-text-dark">
                    Privacidad y Términos
                </Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 }}>
                <View className="bg-surface-light dark:bg-surface-dark/10 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mt-4">
                    <MaterialIcons name="privacy-tip" size={32} color="#EF233C" style={{ marginBottom: 12 }} />
                    <Text className="text-xl font-bold text-text-light dark:text-text-dark mb-4">
                        Nuestra promesa de privacidad
                    </Text>
                    <Paragraph>
                        En HueX valoramos tu privacidad por encima de todo. Nuestra aplicación ha sido desarrollada
                        para ayudarte a normalizar e identificar colores, sin interés en recolectar tus datos con
                        fines publicitarios.
                    </Paragraph>

                    <SectionTitle>1. Datos Recopilados</SectionTitle>
                    <Paragraph>
                        HueX únicamente almacena la información necesaria para el funcionamiento de tu cuenta, incluyendo:
                        corrreo electrónico, contraseña encriptada (salt + hash) para autenticación y los colores que
                        tú de manera arbitraria decidas almacenar en el Historial o sección de Favoritos.
                    </Paragraph>

                    <SectionTitle>2. Uso de la Cámara</SectionTitle>
                    <Paragraph>
                        Las fotos escaneadas por nuestra cámara de extracción y el simulador de visión, se procesan de manera local y en el momento
                        (dentro de tu propio dispositivo celular). Las imágenes no se envían, guardan ni comparten en la nube como fotos, sólo extraemos su información cromática hexadecimal.
                    </Paragraph>

                    <SectionTitle>3. Compartir con Terceros</SectionTitle>
                    <Paragraph>
                        HueX es un trabajo de fin de grado y un sistema de utilidad. No se comparte ni se comercia con
                        datos personales a empresas de terceros bajo ninguna circunstancia.
                    </Paragraph>

                    <SectionTitle>Términos de Uso Requisito</SectionTitle>
                    <Paragraph>
                        Todo el uso de nuestra tecnología, análisis y estimación de colores está destinado a informar, ayudar
                        y proveer herramientas útiles de identificación de contraste o tipo. No debe usarse como sustituto a
                        un test clínico de validación de daltonismo emitido por oftalmólogos certificados.
                    </Paragraph>

                    <Paragraph>
                        Última actualización: Marzo 2026.
                    </Paragraph>
                </View>
            </ScrollView>
        </StyledSafeAreaView>
    );
}
