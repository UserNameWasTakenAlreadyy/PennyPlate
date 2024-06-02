import { StyleSheet, Text, View, ScrollView, Dimensions, Alert } from "react-native";
import Colors from "../../constants/Colors";
import { auth, db } from "../../utils/firebase";
import { collection, addDoc, setDoc, doc, getDoc, getDocs } from "firebase/firestore";
import CustomButton from "../components/CustomButtons/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import CustomInput from "../components/Custom Inputs/CustomInput";
import { TextInput } from "react-native-paper";




function AddFoodItemScreen({route}) {
    const navigation = useNavigation();
    const [foodName, setFoodName] = useState('');
    const [foodDescription, setFoodDescription] = useState('');
    const [foodPrice, setFoodPrice] = useState('');
    const [foodHalal, setFoodHalal] = useState('');
    const user = auth.currentUser;
    const { refreshFoodItems } = route.params;

    //fields in doc() should be handled dynamically later on
    const back = () => {
        navigation.navigate('Merchant Main Screen');
    }


    //add function should also check if it is already inside database
    const addFoodItem = async () => {
        try {
            const name = foodName
            const newFoodItem = {
                description: foodDescription,
                price: foodPrice,
                halal: foodHalal
            }
            await setDoc(doc(db, user.displayName, name), newFoodItem);
            Alert.alert(title="Food Added!");
            refreshFoodItems();
            navigation.navigate('Merchant Main Screen');
        } catch (error) {
            console.log('Error', error)
        }
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.bgroot} >
            <View style={styles.root}>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Add Food</Text>
                </View>


                <CustomInput placeholder='Food Name' value={foodName} setValue={(text) => setFoodName(text)} />
                <CustomInput placeholder='Food Description' value={foodDescription} setValue={(text) => setFoodDescription(text)} />
                <CustomInput placeholder='Price' value={foodPrice} setValue={(text) => setFoodPrice(text)}/>
                <CustomInput placeholder='Halal' value={foodHalal} setValue={(text) => setFoodHalal(text)}/>



                <CustomButton onPress={addFoodItem} text="Add" type='Primary' />
                <CustomButton onPress={back} text="Cancel" type='Primary' />


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
    policyContainer: {
        marginTop: 15
    },
    policyText: {
        fontSize: 12
    },
    policyTextHighLight: {
        color: '#000000',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        height: '100%',
        width: '100%'
    },
    image: {
        opacity: 0.2,
    },
    bgroot: {
        flex: 1,
        //to fix the keyboard popup!!!
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },

});