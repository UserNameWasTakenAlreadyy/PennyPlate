import { Text, View, StyleSheet, ImageBackground, Dimensions, FlatList } from "react-native";
import CustomButton from "../components/CustomButtons/CustomButton";
import { useEffect, useState } from "react";
import background from '../../assets/images/backgroundSignUp.jpg'
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import FoodPlaces from "../components/Food Places/FoodPlaces";
import { useRoute } from "@react-navigation/native";
import Carousell from "../components/Carousell/Carousell";


function UserFoodDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { storeName } = route.params;
    return (
        <ImageBackground
            style={styles.imageContainer}
            imageStyle={styles.image}
            source={background}
            resizeMode="cover">
            <View style={styles.root}>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>User Food Details</Text>
                </View>

                <Carousell storeName={storeName} />


                <CustomButton onPress={() => { navigation.navigate('User Main Screen') }} text='Back' type='Primary' />



            </View>
        </ImageBackground>



    );
}

export default UserFoodDetailsScreen;


const styles = StyleSheet.create({
    root: {
        alignItems: 'stretch',
        padding: 20,
        flex: 1

    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',

    },
    titleContainer: {
        marginBottom: 20,
        marginTop: 100,
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
        //to fix the keyboard popup!!!
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    }
});