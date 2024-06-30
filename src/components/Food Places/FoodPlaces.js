import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const sampleParagraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

function FoodPlaces({ id, ratings, address, imageUrl, onPress }) {
    const navigation = useNavigation();

    return (
        <Pressable
            style={styles.rootContainer}
            onPress={() => onPress(id)}
            android_ripple={{ color: '#C3C8FF' }}
        >
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <Text>No Image</Text>
                )}
            </View>

            <View style={styles.foodItemContainer}>
                <Text style={styles.idText}>{id}</Text>
                <View style={styles.ratingsAndAddressContainer}>
                    <Text style={styles.ratingsContainer}>Rating: {ratings.toFixed(1)}</Text>
                    <Text style={styles.addressContainer} numberOfLines={1}>{address}</Text>
                </View>
            </View>
        </Pressable>
    );
}

export default FoodPlaces;

const styles = StyleSheet.create({
    rootContainer: {
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: '#defff6', // Light Grey background
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        marginBottom: 10,
        marginHorizontal: 10,
        padding: 10,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 10,
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
    },
    foodItemContainer: {
        flex: 1,
    },
    idText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333333', // Dark Grey font color
    },
    descriptionText: {
        fontSize: 14,
        marginBottom: 5,
        color: '#333333', // Dark Grey font color
    },
    ratingsAndAddressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50
    },
    ratingsContainer: {
        fontSize: 12,
        color: '#333333', // Dark Grey font color
    },
    addressContainer: {
        fontSize: 12,
        color: '#333333', // Dark Grey font color
        flex: 1,
        marginLeft: 10,
    },
});

