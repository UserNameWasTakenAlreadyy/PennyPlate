import { Text, View, StyleSheet, ImageBackground, Dimensions, FlatList } from "react-native";
import CustomButton from "../components/CustomButtons/CustomButton";
import { useState, useCallback } from "react";
import background from '../../assets/images/backgroundSignUp.jpg';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import FoodPlaces from "../components/Food Places/FoodPlaces";
import axios from 'axios';
import * as Location from 'expo-location';

function UserMainScreen() {
    const navigation = useNavigation();
    const [user, setUser] = useState(auth.currentUser);
    const [foodItems, setFoodItems] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const GOOGLE_API_KEY = 'AIzaSyBAL3jnjoHqIJrCdfbPYIZVdphctl7yP7g';

    const onBackPress = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Home');
        } catch (error) {
            console.log('Error signing out: ', error);
        }
    };

    const fetchAddress = async (lat, lng) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`);
            if (response.data.status === 'OK') {
                return response.data.results[0].formatted_address;
            } else {
                console.log('Error fetching address:', response.data.status);
                return 'Unknown location';
            }
        } catch (error) {
            console.log('Error fetching address:', error);
            return 'Unknown location';
        }
    };

    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        return total / ratings.length;
    };

    const haversineDistance = (coords1, coords2) => {
        const toRad = (x) => (x * Math.PI) / 180;
        const R = 6371; // Radius of Earth in kilometers
        const dLat = toRad(coords2.latitude - coords1.latitude);
        const dLon = toRad(coords2.longitude - coords1.longitude);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(coords1.latitude)) *
            Math.cos(toRad(coords2.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const fetchFoodItems = async (refresh = false) => {
        if (refresh) setRefreshing(true);
        try {
            const todoRef = collection(db, "merchant");
            const querySnapshot = await getDocs(todoRef);
            const documents = [];
            const addressPromises = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const averageRating = calculateAverageRating(data.rating);
                documents.push({ id: doc.id, ...data, averageRating });
                addressPromises.push(fetchAddress(data.latitude, data.longitude));
            });

            const addresses = await Promise.all(addressPromises);
            const documentsWithAddress = documents.map((doc, index) => ({
                ...doc,
                address: addresses[index]
            }));

            if (userLocation) {
                documentsWithAddress.sort((a, b) => 
                    haversineDistance(userLocation, a) - haversineDistance(userLocation, b)
                );
            }

            setFoodItems(documentsWithAddress);
        } catch (error) {
            console.log("Error", error);
        } finally {
            if (refresh) setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = auth.onAuthStateChanged((currentUser) => {
                if (currentUser) {
                    setUser(currentUser);
                    fetchFoodItems();
                }
            });

            return () => unsubscribe();
        }, [userLocation])
    );

    useFocusEffect(
        useCallback(() => {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                });
            })();
        }, [])
    );

    const renderItem = ({ item }) => (
        <FoodPlaces
            id={item.id}
            ratings={item.averageRating}
            address={item.address}
            imageUrl={item.profilePicture}
            refreshFoodItems={fetchFoodItems}
            onPress={(name) => {
                navigation.navigate('User Food Details', {storeName: name});
            }}
        />
    );

    return (
        <ImageBackground
            style={styles.imageContainer}
            imageStyle={styles.image}
            source={background}
            resizeMode="cover">
            <View style={styles.root}>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Home</Text>
                </View>

                <FlatList
                    data={foodItems}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ gap: 10 }}
                    refreshing={refreshing}
                    onRefresh={() => fetchFoodItems(true)}
                />
                <CustomButton onPress={() => navigation.navigate('Idle Game Screen')} text='Waiting in Line?' type='Primary' />
                <CustomButton onPress={onBackPress} text='Log Out' type='Primary' />

            </View>
        </ImageBackground>
    );
}

export default UserMainScreen;

const styles = StyleSheet.create({
    root: {
        alignItems: 'stretch',
        padding: 20,
        flex: 1
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    titleContainer: {
        marginBottom: 20,
        marginTop: 100,
        justifyContent: 'center',
        alignItems: 'center'
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
    bgroot: {
        alignItems: 'center',
        flex: 1,
        position: 'absolute',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    }
});
