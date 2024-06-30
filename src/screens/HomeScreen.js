import { Text, View, Image, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import Logo from '../../assets/images/FoodLogo.png'
import CustomInput from '../components/Custom Inputs/CustomInput';
import CustomButton from "../components/CustomButtons/CustomButton";
import { useState } from "react";
import Colors from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

function HomeScreen() {
    const navigation = useNavigation();
    const { height } = useWindowDimensions();
    const onSignInPressUser = () => {
        navigation.navigate('Sign In', {userType: 'user'});
    };
    const onSignInPressMerchant = () => {
        navigation.navigate('Sign In', {userType: 'merchant'});
    };


    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.root}>
                <Image
                    source={Logo}
                    style={[styles.logo, { height: height * 0.4 }]}
                    resizeMode="contain" />
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>PennyPlate</Text>
                    <Text style={styles.subtitle}>Sign In As:</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <View style={styles.buttonContainer}>
                        <CustomButton onPress={onSignInPressUser} text='User' type='Primary' />
                    </View>
                    <View style={styles.buttonContainer}>
                        <CustomButton onPress={onSignInPressMerchant} text='Merchant' type='Primary' />
                    </View>
                </View>
            </View>



        </ScrollView>

    );
}

export default HomeScreen;


const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,

    },
    logo: {
        width: '80%',
        maxHeight: 400,
        maxWidth: 300
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    titleContainer: {
        marginBottom: 20,
        alignItems: 'center'

    },
    buttonsContainer: {
        flexDirection: 'row',
        alignContent: 'space-evenly'
    },
    buttonContainer: {
        padding: 10,
        flex: 1
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
});