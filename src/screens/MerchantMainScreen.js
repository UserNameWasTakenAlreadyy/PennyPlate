import React, { useEffect, useState, useCallback } from "react";
import { Text, View, StyleSheet, ImageBackground, Dimensions, FlatList, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import FoodItem from "../components/Food Menu/FoodItem";
import Icon from 'react-native-vector-icons/Ionicons';
import background from '../../assets/images/backgroundSignUp.jpg';
import Colors from "../../constants/Colors";

function MerchantMainScreen() {
    const navigation = useNavigation();
    const [user, setUser] = useState(auth.currentUser);
    const [foodItems, setFoodItems] = useState([]);
    const [showPrompt, setShowPrompt] = useState(false);

    // Check if location and profile picture are set
    const checkProfileSetup = useCallback(async () => {
        if (user && user.displayName) {
            try {
                const userDoc = doc(db, "merchant", user.displayName);
                const docSnapshot = await getDoc(userDoc);
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    if (!data.latitude || !data.longitude || !data.profilePicture) {
                        setShowPrompt(true);
                    }
                }
            } catch (error) {
                console.log("Error checking profile setup:", error);
            }
        } else {
            console.log("User or user.displayName is not defined");
        }
    }, [user]);

    // Fetch food items
    const fetchFoodItems = useCallback(async () => {
        if (user && user.displayName) {
            try {
                const todoRef = collection(db, user.displayName);
                const querySnapshot = await getDocs(todoRef);
                const documents = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFoodItems(documents);
            } catch (error) {
                console.log("Error fetching food items:", error);
            }
        } else {
            console.log("User or user.displayName is not defined");
        }
    }, [user]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchFoodItems();
                checkProfileSetup();
            }
        });

        const focusListener = navigation.addListener('focus', () => {
            fetchFoodItems();
            checkProfileSetup();
        });

        return () => {
            unsubscribe();
            focusListener();
        };
    }, [navigation, fetchFoodItems, checkProfileSetup]);

    // Rendering of food items
    const renderItem = ({ item }) => (
        <FoodItem
            id={item.id}
            description={item.description}
            price={item.price}
            halal={item.halal}
            imageUrl={item.imageUrl}
            refreshFoodItems={fetchFoodItems}
        />
    );

    const onBackPress = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Home');
        } catch (error) {
            console.log('Error signing out: ', error);
        }
    };

    const onAddMenuItemsPress = () => {
        navigation.navigate('Add Food Item');
    };

    const onSetLocationPress = () => {
        setShowPrompt(false);
        navigation.navigate('Merchant Set Location');
    };

    const onSetProfilePicturePress = () => {
        setShowPrompt(false);
        navigation.navigate('Merchant Set Picture');
    };

    return (
        <ImageBackground
            style={styles.imageContainer}
            imageStyle={styles.image}
            source={background}
            resizeMode="cover">
            <View style={styles.root}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Merchant Set Picture') }}>
                        <Icon name="person-circle-outline" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Merchant Main Screen</Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('Merchant Set Location') }}>
                        <Icon name="location-outline" size={30} color="black" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={foodItems}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ gap: 10 }}
                />
                <TouchableOpacity
                    style={[styles.floatingButton, styles.logoutButton]}
                    onPress={onBackPress}>
                    <Icon name="log-out-outline" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.floatingButton, styles.addButton]}
                    onPress={onAddMenuItemsPress}>
                    <Icon name="add-circle-outline" size={30} color="white" />
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showPrompt}
                    onRequestClose={() => {
                        setShowPrompt(false);
                    }}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Please set your location and profile picture.</Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity onPress={onSetLocationPress} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Set Location</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onSetProfilePicturePress} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Set Profile Picture</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowPrompt(false)} style={[styles.modalButton, styles.dismissButton]}>
                                    <Text style={styles.modalButtonText}>Dismiss</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        </ImageBackground>
    );
}

export default MerchantMainScreen;

const styles = StyleSheet.create({
    root: {
        alignItems: 'stretch',
        padding: 20,
        flex: 1
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        padding: 10,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoutButton: {
        left: 20,
        backgroundColor: Colors.logOut
    },
    addButton: {
        right: 20,
        backgroundColor: Colors.add
    },
    bgroot: {
        alignItems: 'center',
        flex: 1,
        position: 'absolute',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center'
    },
    modalText: {
        fontSize: 18,
        textAlign: 'center',

        justifyContent: 'center'
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 10,
        borderRadius: 5,
        backgroundColor: Colors.set,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16
    },
    dismissButton: {
        backgroundColor: Colors.dismiss
    }
});
