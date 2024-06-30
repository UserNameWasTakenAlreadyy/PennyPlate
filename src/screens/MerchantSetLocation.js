import { Text, View, StyleSheet, ImageBackground, Dimensions, Alert } from "react-native";
import CustomButton from "../components/CustomButtons/CustomButton";
import { useEffect, useState } from "react";
import background from '../../assets/images/backgroundSignUp.jpg'
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import * as Location from 'expo-location';
import SelectMap from "../components/Maps/SelectMap";

function MerchantSetLocation() {
    const user = auth.currentUser;
    const [location, setLocation] = useState(null);
    const navigation = useNavigation();

    // Fetching location of the merchant if it exists
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const userDoc = doc(db, "merchant", user.displayName);
                const docSnapshot = await getDoc(userDoc);
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    if (data.latitude && data.longitude) {
                        setLocation({
                            latitude: data.latitude,
                            longitude: data.longitude
                        });
                    } else {
                        // If no location is set, get the current location
                        const { status } = await Location.requestForegroundPermissionsAsync();
                        if (status !== 'granted') {
                            console.log("Permission to access location was denied");
                            return;
                        }

                        const currentLocation = await Location.getCurrentPositionAsync({});
                        setLocation({
                            latitude: currentLocation.coords.latitude,
                            longitude: currentLocation.coords.longitude
                        });
                    }
                } else {
                    // If no document exists, get the current location
                    const { status } = await Location.requestForegroundPermissionsAsync();
                    if (status !== 'granted') {
                        console.log("Permission to access location was denied");
                        return;
                    }

                    const currentLocation = await Location.getCurrentPositionAsync({});
                    setLocation({
                        latitude: currentLocation.coords.latitude,
                        longitude: currentLocation.coords.longitude
                    });
                }
            } catch (error) {
                console.log('Error fetching location from Firestore: ', error);
            }
        };

        fetchLocation();
    }, [user.displayName]);

    // Function to go to the menu
    const onMenuPress = () => {
        navigation.navigate('Merchant Main Screen');
    }

    //set location in database
    const onConfirmPress = async () => {
        if (location) {
            try {
                const userDoc = doc(db, "merchant", user.displayName);
                await setDoc(userDoc, {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    rating: [],
                }, { merge: true });
                Alert.alert("Location Set!");
            } catch (error) {
                console.log('Error saving location to Firestore: ', error);
            }
        } else {
            console.log('No location selected.');
        }
    };

    return (
        <ImageBackground
            style={styles.imageContainer}
            imageStyle={styles.image}
            source={background}
            resizeMode="cover">
            <View style={styles.root}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Merchant Set Location</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <SelectMap onLocationSelect={setLocation} initialLocation={location} />
                </View>
                <CustomButton onPress={onConfirmPress} text='Confirm' type='Primary' />
                <CustomButton onPress={onMenuPress} text='To Menu' type='Primary' />
                
            </View>
        </ImageBackground>
    );
}

export default MerchantSetLocation;

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
    bgroot: {
        alignItems: 'center',
        flex: 1,
        position: 'absolute',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    }
});
