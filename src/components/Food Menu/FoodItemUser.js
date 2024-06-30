import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity } from "react-native";
import CustomIconButton from "../CustomButtons/CustomIconButton"; // Import the CustomIconButton component
import { auth } from "../../../utils/firebase";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../../constants/Colors";

const sampleParagraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

function FoodItemUser({ id, description, price, halal, imageUrl, refreshFoodItems }) {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const dismissModal = () => setVisible(false);
    const user = auth.currentUser;

    return (
        <View style={styles.rootContainer}>
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <Text>No Image</Text>
                )}
            </View>

            <View style={styles.foodItemContainer}>
                <View style={{ flex: 1 }}>
                    <View>
                        <Text>{id}</Text>
                    </View>

                    <Text numberOfLines={3} ellipsizeMode="tail">{description}</Text>
                    <Text onPress={showModal} style={{ color: 'blue', textDecorationLine: 'underline' }}>Click for more info</Text>
                </View>
                <View style={styles.priceAndHalalContainer}>
                    <Text style={styles.priceConainter}>Price: {price}</Text>
                    <Text style={styles.halalContainer}>Halal: {halal}</Text>
                </View>
            </View>
            <Modal visible={visible} animationType="fade" transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={dismissModal} style={styles.minimizeIconContainer}>
                                <CustomIconButton icon='remove' color="#fff" size={24} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalParagraphContainer}>
                            <Text style={styles.paragraphText}>
                                {sampleParagraph}
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default FoodItemUser;

const styles = StyleSheet.create({
    rootContainer: {
        flexDirection: 'row',
        borderWidth: 0,
        borderRadius: 20,
        backgroundColor: Colors.menuMerchant,
        borderColor: Colors.menuMerchantBorder,
        marginBottom: 10,
    },
    imageContainer: {
        padding: 10,
        marginRight: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 5,
    },
    foodItemContainer: {
        padding: 10,
        flex: 1,
        justifyContent: 'space-between', // Ensure items are spaced out
    },
    priceAndHalalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priceConainter: {},
    halalContainer: {},
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(171, 167, 167, 0.5)', // Semi-transparent background
    },
    modalContainer: {
        width: '80%', // Adjust the width as needed
        backgroundColor: Colors.primaryBackground,
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    minimizeIconContainer: {
        padding: 10,
        backgroundColor: Colors.primary,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalParagraphContainer: {
        padding: 10,
        justifyContent: "center",
        borderRadius: 10,
        borderColor: '#2b8cc8',
        backgroundColor: '#38bdc2',
        marginBottom: 20
    },
    paragraphText: {
        color: '#d1fdfe',
        fontWeight: 'bold'
    },
    iconsContainer: {
        flexDirection: "row",
        justifyContent: 'flex-end'
    },
    iconContainer: {
        padding: 5
    }
});
