import React from 'react';
import { Text, View, StyleSheet, ImageBackground, Dimensions } from "react-native";
import CustomButton from "../components/CustomButtons/CustomButton";
import AppIconButton from '../components/CustomButtons/AppButton';
import background from '../../assets/images/backgroundSignUp.jpg'
import { useNavigation } from "@react-navigation/native";

function IdleGameScreen() {
    const navigation = useNavigation();

    const games = [
        { icon: '❌', label: 'TicTacToe', onPress: () => navigation.navigate('Tic Tac Toe Game') },
        { icon: '🎯', label: 'Flappy Burger', onPress: () => navigation.navigate('Flappy Burger Game Selection') },
        { icon: '👆🏼', label: 'Tap Counter', onPress: () => navigation.navigate('Tap Counter Game') },
        // Add more games as needed
    ];

    return (
        <ImageBackground
            style={styles.imageContainer}
            imageStyle={styles.image}
            source={background}
            resizeMode="cover">
            <View style={styles.root}>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Fun Games while waiting in line!</Text>
                </View>

                <View style={styles.gameContainer}>
                    {games.map((game, index) => (
                        <AppIconButton
                            key={index}
                            icon={game.icon}
                            label={game.label}
                            onPress={game.onPress}
                        />
                    ))}
                </View>

                <CustomButton onPress={() => navigation.navigate('User Main Screen')} text='Back' type='Primary' />

            </View>
        </ImageBackground>
    );
}

export default IdleGameScreen;

const styles = StyleSheet.create({
    root: {
        alignItems: 'stretch',
        padding: 20,
        flex: 1
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold'
    },
    titleContainer: {
        marginBottom: 20,
        marginTop: 100
    },
    imageContainer: {
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        alignItems: 'stretch'
    },
    image: {
        flex: 1,
        opacity: 0.2
    },
    gameContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        flex: 1,
        alignContent: 'center'
    },
});
