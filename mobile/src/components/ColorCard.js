import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const ColorCard = ({ color, onPress }) => {
    return (
        <TouchableOpacity
            className="flex-row items-center bg-surface-light dark:bg-surface-dark/20 p-3 rounded-xl shadow-sm mb-2"
            onPress={onPress}
        >
            <View style={{ backgroundColor: color.hex }} className="w-12 h-12 rounded-full border border-gray-200 mr-4" />
            <View className="flex-1">
                {color.colorFamily ? (
                    <Text className="text-base font-bold text-text-light dark:text-text-dark">
                        {color.colorFamily}{' '}
                        <Text className="font-normal text-text-muted-light dark:text-text-muted-dark">· {color.name}</Text>
                    </Text>
                ) : (
                    <Text className="text-base font-bold text-text-light dark:text-text-dark">{color.name}</Text>
                )}
                <Text className="text-sm text-text-muted-light dark:text-text-muted-dark">{color.hex}</Text>
            </View>
            <View>
                <Text className="text-xs text-text-muted-light dark:text-text-muted-dark">RGB: {color.rgb}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ColorCard;
