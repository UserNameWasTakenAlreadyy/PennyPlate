import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../../utils/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import CustomButton from '../components/CustomButtons/CustomButton';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../components/Custom Inputs/CustomInput';

function AddFoodItemScreen() {
    const navigation = useNavigation();
    const [foodName, setFoodName] = useState('');
    const [foodDescription, setFoodDescription] = useState('');
    const [foodPrice, setFoodPrice] = useState(0);
    const [foodHalal, setFoodHalal] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false); // State to control loading indicator
    const user = auth.currentUser;

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.cancelled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log('Error picking image: ', error);
        }
    };

    const addFoodItem = async () => {
        setLoading(true); // Show loading indicator
        try {
            let imageUrl = '';

            if (image) {
                // Upload the image to Firebase Storage
                const response = await fetch(image);
                const blob = await response.blob();
                const storageRef = ref(storage, `images/${user.uid}/${foodName}`);
                await uploadBytes(storageRef, blob);
                imageUrl = await getDownloadURL(storageRef);
            }

            const newFoodItem = {
                description: foodDescription,
                price: parseFloat(foodPrice),
                halal: foodHalal,
                imageUrl: imageUrl
            };

            await setDoc(doc(db, user.displayName, foodName), newFoodItem);

            Alert.alert("Food Added!");
            navigation.navigate('Merchant Main Screen');
        } catch (error) {
            console.log('Error adding food item:', error);
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    const back = () => {
        navigation.navigate('Merchant Main Screen');
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.bgroot}>
            <View style={styles.root}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Add Food</Text>
                </View>
                <CustomInput placeholder='Food Name' value={foodName} setValue={(text) => setFoodName(text)} />
                <CustomInput placeholder='Food Description' value={foodDescription} setValue={(text) => setFoodDescription(text)} />
                <CustomInput placeholder='Price' value={foodPrice.toString()} setValue={(text) => setFoodPrice(text)} keyboardType="numeric" />
                <CustomInput placeholder='Halal' value={foodHalal} setValue={(text) => setFoodHalal(text)} />
                <CustomButton onPress={pickImage} text="Add an Image" type='Primary' />
                {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        <CustomButton onPress={addFoodItem} text="Add" type='Primary' />
                        <CustomButton onPress={back} text="Cancel" type='Primary' />
                    </>
                )}
            </View>
        </ScrollView>
    );
}

export default AddFoodItemScreen;

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        flex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    titleContainer: {
        marginBottom: 20,
        marginTop: 100
    },
    bgroot: {
        flex: 1,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
});
