import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Defs, Filter, FeColorMatrix, Image as SvgImage } from 'react-native-svg';

const FILTERS = {
    Normal: [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0,
    ],
    Protanopia: [
        0.567, 0.433, 0, 0, 0,
        0.558, 0.442, 0, 0, 0,
        0, 0.242, 0.758, 0, 0,
        0, 0, 0, 1, 0,
    ],
    Deuteranopia: [
        0.625, 0.375, 0, 0, 0,
        0.7, 0.3, 0, 0, 0,
        0, 0.3, 0.7, 0, 0,
        0, 0, 0, 1, 0,
    ],
    Tritanopia: [
        0.95, 0.05, 0, 0, 0,
        0, 0.433, 0.567, 0, 0,
        0, 0.475, 0.525, 0, 0,
        0, 0, 0, 1, 0,
    ],
};

const VisionFilter = ({ mode, imageUri, width, height }) => {
    const matrix = FILTERS[mode] || FILTERS.Normal;

    if (!imageUri) return null;

    try {
        return (
            <View style={{ width, height, overflow: 'hidden' }}>
                <Svg width={width} height={height}>
                    <Defs>
                        <Filter id="colorBlindFilter">
                            <FeColorMatrix
                                type="matrix"
                                values={matrix.join(' ')}
                            />
                        </Filter>
                    </Defs>
                    <SvgImage
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        preserveAspectRatio="xMidYMid slice"
                        href={{ uri: imageUri }}
                        filter="url(#colorBlindFilter)"
                    />
                </Svg>
            </View>
        );
    } catch (error) {
        console.error("SVG Render Error:", error);
        return (
            <View style={{ width, height, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
                <Text>Error rendering simulation</Text>
            </View>
        );
    }
};

export default VisionFilter;
