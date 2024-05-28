import { Text, View, Image, StyleSheet, ImageBackground, ScrollView, Dimensions } from "react-native";
import CustomInput from '../components/Custom Inputs/CustomInput';
import CustomButton from "../components/CustomButtons/CustomButton";
import { useState } from "react";
import Colors from "../../constants/Colors";
import background from '../../assets/images/backgroundSignUp.jpg'
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";

function MerchantMainScreen() {
    const navigation = useNavigation();
    //functions to be implemented later
    const onBackPress = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Sign In');
        } catch (error) {
            console.log('Error signing out: ', error);
        }
    };

    const onAddMenuItemsPress = () => {
        navigation.navigate('Add Food Item');
    }





    return (
        <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bgroot} >
            <ImageBackground
            style={styles.imageContainer}
            imageStyle={styles.image}
            source={background}
            resizeMode="cover">
                <View style={styles.root}>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Merchant Main Screen</Text>
                    </View>
                    <CustomButton onPress={onBackPress} text='Log Out' type='Primary' />
                    <CustomButton onPress={onAddMenuItemsPress} text='Add Menu Items' type='Primary' />
                </View>
            </ImageBackground>

        </ScrollView>

    );
}

export default MerchantMainScreen;


const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
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
        justifyContent: 'center',
        height: '100%',
        width: '100%'
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