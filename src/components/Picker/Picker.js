import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CustomPicker = ({ onSelectTransport }) => {
    const [selectedTransport, setSelectedTransport] = useState('DRIVE'); // Default transport mode is driving

    const handleTransportChange = (transport) => {
        setSelectedTransport(transport);
        onSelectTransport(transport); // Pass the selected transport mode to the parent component
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.transportButton, selectedTransport === 'DRIVE' && styles.selectedButton]}
                onPress={() => handleTransportChange('DRIVE')}
            >
                <Text style={styles.buttonText}>Driving</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.transportButton, selectedTransport === 'WALK' && styles.selectedButton]}
                onPress={() => handleTransportChange('WALK')}
            >
                <Text style={styles.buttonText}>Walking</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.transportButton, selectedTransport === 'BICYCLE' && styles.selectedButton]}
                onPress={() => handleTransportChange('BICYCLE')}
            >
                <Text style={styles.buttonText}>Bicycling</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 10,
    },
    transportButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#5acbff',
    },
    selectedButton: {
        backgroundColor: '#42ff91', // Change to your preferred color for selected button
    },
    buttonText: {
        color: 'black', // Change to your preferred color for button text
        fontWeight: 'bold',
    },
});

export default CustomPicker;
