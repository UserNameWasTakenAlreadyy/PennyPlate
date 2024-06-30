import React from 'react';
import { View, FlatList, TouchableOpacity, Image, Text, StyleSheet, Button } from 'react-native';
import Colors from '../../../constants/Colors';

const BirdSelectionScreen = ({ navigation }) => {
    const birdData = [
        { id: 1, name: 'Avocado', image: require('../../../assets/sprites/Avocado toast.png') },
        { id: 2, name: 'Bacon toast', image: require('../../../assets/sprites/Bacon toast.png') },
        { id: 3, name: 'Burger', image: require('../../../assets/sprites/Burger.png') },
        { id: 4, name: 'Carrot stew', image: require('../../../assets/sprites/Carrot stew.png') },
        { id: 5, name: 'Chocolate croissant', image: require('../../../assets/sprites/Chocolate croissant.png') },
        { id: 6, name: 'Chocolate doughnut', image: require('../../../assets/sprites/Chocolate doughnut.png') },
        { id: 7, name: 'Cup of coffee', image: require('../../../assets/sprites/Cup of coffee.png') },
        { id: 8, name: 'Cup of tea', image: require('../../../assets/sprites/Cup of tea.png') },
        { id: 9, name: 'Egg toast', image: require('../../../assets/sprites/Egg toast.png') },
        { id: 10, name: 'Jam toast', image: require('../../../assets/sprites/Jam toast.png') },
        { id: 11, name: 'Meatballs', image: require('../../../assets/sprites/Meatballs.png') },
        { id: 12, name: 'Milk and cookies', image: require('../../../assets/sprites/Milk and cookies.png') },
        { id: 13, name: 'Mushroom Stew', image: require('../../../assets/sprites/Mushroom Stew.png') },
        { id: 14, name: 'Tomato Stew', image: require('../../../assets/sprites/Tomato stew.png') },
        // Add more bird options as needed
    ];

    const handleSelectBird = (birdImage) => {
        navigation.navigate('Flappy Burger Game', { character: birdImage });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleSelectBird(item.image)} style={{ padding: 5 }}>
            <View style={styles.birdOption}>
                <Image source={item.image} style={styles.birdImage} resizeMode='contain' />
                <Text style={styles.birdName}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Select a character!</Text>
            </View>

            <View style={styles.flatListContainer}>
                <FlatList
                    data={birdData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Back" onPress={() => { navigation.navigate('Idle Game Screen') }} color="#dc5858" />
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryBackground,
        marginTop: 75
    },
    flatListContainer: {
        flex: 9,
        width: '80%',
        borderRadius: 20,
        borderWidth: 5,
        borderColor: '#4822d2',
        backgroundColor: '#90f7e9',
        padding: 10,
        marginVertical: 50
    },
    itemContainer: {
        borderRadius: 10,
        overflow: 'hidden', // Ensure rounded corners are applied
        marginBottom: 10,
    },
    birdOption: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        borderColor: '#7f6cc6'
    },
    birdImage: {
        width: 50,
        height: 50,
        marginRight: 20,
        resizeMode: 'contain', // Ensure the entire image fits within its container
    },
    birdName: {
        fontSize: 16,
    },
    buttonContainer: {
        flex: 1
    }
});

export default BirdSelectionScreen;
