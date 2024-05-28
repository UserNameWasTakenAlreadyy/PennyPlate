import { StyleSheet, Text, View, SafeAreaView, Dimensions } from "react-native";
import Colors from "../../constants/Colors";
import { auth, db } from "../../utils/firebase";
import { collection, addDoc, setDoc, doc, getDoc, getDocs } from "firebase/firestore";
import CustomButton from "../components/CustomButtons/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "@react-native-firebase/auth";
import { useState } from "react";
import FoodItem from "../components/Food Menu/FoodItem";


function AddFoodItemScreen() {
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);
    const todoRef = collection(db, "user1");

    //fields in doc() should be handled dynamically later on
    const back = () => {
        navigation.navigate('Merchant Main Screen');
    }

    //read data from data base
    const dummyTest = async () => {
        const querySnapshot = await getDocs(todoRef);
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({id: doc.id, ...doc.data() });
        });

        console.log(documents);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Menu</Text>
            <FoodItem/>
            <CustomButton onPress={dummyTest} text='Test' type='Primary' />
        </SafeAreaView>
    )

}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        padding: 20,
        marginTop:100
    }, 
    titleText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.fontColor
    }
});

export default AddFoodItemScreen;