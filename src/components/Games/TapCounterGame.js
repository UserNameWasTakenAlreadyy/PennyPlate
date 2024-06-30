import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TapCounterGame = () => {
    const [taps, setTaps] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isGameActive, setIsGameActive] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        let timer;
        if (isGameActive && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0) {
            setIsGameActive(false);
        }
        return () => clearTimeout(timer);
    }, [isGameActive, timeLeft]);

    const startGame = () => {
        setTaps(0);
        setTimeLeft(10);
        setIsGameActive(true);
    };

    const handleTap = () => {
        if (!isGameActive) {
            startGame();
        } else {
            setTaps(taps + 1);
        }
    };
    
    return (
        <View style={styles.root}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Tap Counter Game</Text>
            </View>
            <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
            <Text style={styles.counter}>Taps: {taps}</Text>
            <TouchableOpacity style={styles.tapArea} onPress={handleTap}>
                <ImageBackground source={require('../../../assets/cookie.png')} style={styles.cookieImage}>
                    <Text style={styles.tapText}>Tap to start!</Text>
                </ImageBackground>
            </TouchableOpacity>
            {!isGameActive}
            <View style={{ padding: 10 }}>
                <Button title="Back" onPress={() => { navigation.navigate('Idle Game Screen') }} color="#dc5858" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#6200EE', // Primary color of your app
        marginBottom: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    timer: {
        fontSize: 20,
        color: '#6200EE', // Primary color of your app
        marginBottom: 20,
    },
    counter: {
        fontSize: 20,
        color: '#6200EE', // Primary color of your app
        marginBottom: 20,
    },
    tapArea: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    cookieImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'contain',
    },
    tapText: {
        fontSize: 24,
        color: '#FFFFFF', // White text for contrast
    },
});

export default TapCounterGame;
