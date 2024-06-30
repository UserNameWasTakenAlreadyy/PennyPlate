import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth, db, storage } from '../../utils/firebase';
import { setDoc, doc } from 'firebase/firestore';
import CustomButton from '../components/CustomButtons/CustomButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomInput from '../components/Custom Inputs/CustomInput';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Colors from '../../constants/Colors';

function UpdateFoodScreen() {
    const user = auth.currentUser;
    const navigation = useNavigation();
    const route = useRoute();
    const { selectedFoodObj, refreshFoodItems } = route.params;
    const [foodDescription, setFoodDescription] = useState(selectedFoodObj.foodDescription || '');
    const [foodPrice, setFoodPrice] = useState(selectedFoodObj.foodPrice || '');
    const [foodHalal, setFoodHalal] = useState(selectedFoodObj.foodHalal || '');
    const [imageUrl, setImageUrl] = useState(selectedFoodObj.imageUrl || null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false); // State to manage loading indicator

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                const localUri = result.assets[0].uri;
                setImage(localUri);
                setImageUrl(localUri);
            }
        } catch (error) {
            console.log('Error picking image:', error);
        }
    };

    const updateFoodItems = async () => {
        setLoading(true); // Set loading to true when update starts
        try {
            let newImageUrl = imageUrl;

            if (image) {
                const response = await fetch(image);
                const blob = await response.blob();
                const storageRef = ref(storage, `images/${user.uid}/${selectedFoodObj.foodId}`);
                await uploadBytes(storageRef, blob);
                newImageUrl = await getDownloadURL(storageRef);
            }

            const newFoodItem = {
                description: foodDescription,
                price: parseFloat(foodPrice),
                halal: foodHalal,
                imageUrl: newImageUrl,
            };

            await setDoc(doc(db, user.displayName, selectedFoodObj.foodId), newFoodItem);

            Alert.alert("Food Updated!");

            if (refreshFoodItems) {
                refreshFoodItems();
            }

            navigation.navigate('Merchant Main Screen');
        } catch (error) {
            console.log('Error updating food item:', error);
        } finally {
            setLoading(false); // Set loading to false when update is complete
        }
    };

    const back = () => {
        navigation.navigate('Merchant Main Screen');
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.bgroot}>
            <View style={styles.root}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Update Food</Text>
                </View>

                {/* Display current image */}
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <Text>No Image</Text>
                )}

                <TouchableOpacity onPress={pickImage} style={styles.selectImageButton}>
                    <Text>Select Image</Text>
                </TouchableOpacity>

                {/* Inputs for food description, price, and halal status */}
                <CustomInput placeholder="Food Description" value={foodDescription} setValue={setFoodDescription} />
                <CustomInput placeholder="Food Price" value={foodPrice} setValue={setFoodPrice} />
                <CustomInput placeholder="Food Halal Status" value={foodHalal} setValue={setFoodHalal} />

                {/* Show loading indicator */}
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
                ) : (
                    <>
                        <CustomButton onPress={updateFoodItems} text="Update" type='Primary' />
                        <CustomButton onPress={back} text="Cancel" type='Primary' />
                    </>
                )}
            </View>
        </ScrollView>
    );
}

export default UpdateFoodScreen;

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        flex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    titleContainer: {
        marginBottom: 20,
        marginTop: 100,
    },
    bgroot: {
        flex: 1,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginVertical: 10,
    },
    selectImageButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryComplement,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 20,
    },
    loadingIndicator: {
        marginVertical: 20,
    },
});
