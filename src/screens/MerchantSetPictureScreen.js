import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ImageBackground, Dimensions, Alert, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import CustomButton from "../components/CustomButtons/CustomButton";
import background from '../../assets/images/backgroundSignUp.jpg';
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth, db, storage } from "../../utils/firebase"; // Ensure storage is exported from your firebase setup
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Icon from 'react-native-vector-icons/Ionicons';

function MerchantSetPicture() {
    const user = auth.currentUser;
    const [image, setImage] = useState(null);
    const [currentProfilePicture, setCurrentProfilePicture] = useState(null); // State for current profile picture
    const [loading, setLoading] = useState(false); // State for loading indicator
    const navigation = useNavigation();

    //if user has a profile picture set beforehand, try to get the picture first
    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const userDoc = await getDoc(doc(db, "merchant", user.displayName));
                if (userDoc.exists() && userDoc.data().profilePicture) {
                    setCurrentProfilePicture(userDoc.data().profilePicture);
                }
            } catch (error) {
                console.log('Error fetching profile picture: ', error);
            }
        };

        fetchProfilePicture();
    }, [user.displayName]);


    //use image picker to select image, upload with aspect ratio 4:3
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        //else cancelled don't do anything
        if (!result.cancelled) {
            setImage(result.assets[0].uri);
        }
    };

    //uploading of images based on firebase api documentation
    const uploadImage = async () => {
        if (!image) {
            Alert.alert("No image selected");
            return;
        }

        setLoading(true); // Show loading indicator

        try {
            const response = await fetch(image);
            const blob = await response.blob();
            const storageRef = ref(storage, `profilePictures/${user.uid}`);
            await uploadBytes(storageRef, blob);
            const downloadUrl = await getDownloadURL(storageRef);

            const userDoc = doc(db, "merchant", user.displayName);
            await setDoc(userDoc, { profilePicture: downloadUrl }, { merge: true });

            setCurrentProfilePicture(downloadUrl); // Update current profile picture
            Alert.alert("Profile picture uploaded successfully!");
        } catch (error) {
            console.log('Error uploading image: ', error);
            Alert.alert("Error uploading image");
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };


    const onMenuPress = () => {
        navigation.navigate('Merchant Main Screen');
    };

    return (
        <ImageBackground
            style={styles.imageContainer}
            imageStyle={styles.image}
            source={background}
            resizeMode="cover">
            <View style={styles.root}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Merchant Set Picture</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    {currentProfilePicture ? (
                        <Image source={{ uri: currentProfilePicture }} style={styles.imagePreview} />
                    ) : (
                        <Text>No Image Selected</Text>
                    )}
                    {image && (
                        <Image source={{ uri: image }} style={styles.imagePreview} />
                    )}
                    <TouchableOpacity onPress={pickImage} style={styles.selectImageButton}>
                        <Icon name="camera" size={30} color="black" />
                        <Text>Select Image</Text>
                    </TouchableOpacity>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        <CustomButton onPress={uploadImage} text='Upload Profile Picture' type='Primary' />
                        <CustomButton onPress={onMenuPress} text='To Menu' type='Primary' />
                        
                    </>
                )}
            </View>
        </ImageBackground>
    );
}

export default MerchantSetPicture;

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
    imagePreview: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginVertical: 10
    },
    selectImageButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        flexDirection: 'row',
        gap: 5
    },
    bgroot: {
        alignItems: 'center',
        flex: 1,
        position: 'absolute',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    }
});
