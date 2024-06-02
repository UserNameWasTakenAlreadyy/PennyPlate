import { StyleSheet, Text, View, ScrollView, Dimensions, Alert } from "react-native";
import { auth, db } from "../../utils/firebase";
import { setDoc, doc} from "firebase/firestore";
import CustomButton from "../components/CustomButtons/CustomButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import CustomInput from "../components/Custom Inputs/CustomInput";


function UpdateFoodScreen({route}) {
    const user = auth.currentUser;
    const navigation = useNavigation();
    const [foodDescription, setFoodDescription] = useState('');
    const [foodPrice, setFoodPrice] = useState('');
    const [foodHalal, setFoodHalal] = useState('');
    const { selectedFoodObj, refreshFoodItems } = route.params;

    const updateFoodItems = async () => {
        try {
            const newFoodItem = {
                description: foodDescription ? foodDescription : selectedFoodObj.foodDescription,
                price: foodPrice ? foodPrice : selectedFoodObj.foodPrice,
                halal: foodHalal ? foodHalal : selectedFoodObj.foodHalal
            }
            await setDoc(doc(db, user.displayName, selectedFoodObj.foodId), newFoodItem);
            Alert.alert(title="Food Updated!");
            refreshFoodItems();
            navigation.navigate('Merchant Main Screen');
        } catch (error) {
            console.log('Error', error)
        }
    }


    //fields in doc() should be handled dynamically later on
    const back = () => {
        navigation.navigate('Merchant Main Screen');
    }



    return (
        <ScrollView showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.bgroot} >
            <View style={styles.root}>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Update Food</Text>
                </View>

                <CustomInput placeholder={selectedFoodObj.foodDescription} value={foodDescription} setValue={(text) =>  setFoodDescription(text)} />
                <CustomInput placeholder={selectedFoodObj.foodPrice} value={foodPrice} setValue={(text) => setFoodPrice(text)}/>
                <CustomInput placeholder={selectedFoodObj.foodHalal} value={foodHalal} setValue={(text) => setFoodHalal(text)}/>

                <CustomButton onPress={updateFoodItems} text="Update" type='Primary' />
                <CustomButton onPress={back} text="Cancel" type='Primary' />


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