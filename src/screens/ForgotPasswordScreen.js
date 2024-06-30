import { Text, View, Image, StyleSheet, ImageBackground, ScrollView, Dimensions, Alert } from "react-native";
import CustomInput from '../components/Custom Inputs/CustomInput';
import CustomButton from "../components/CustomButtons/CustomButton";
import { useState } from "react";
import Colors from "../../constants/Colors";
import background from '../../assets/images/backgroundSignUp.jpg'
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../utils/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

function ForgotPassWordScreen({route}) {
    const { userType } = route.params;
    const navigation = useNavigation();
    const [email, setEmail] = useState('');

    const onSendPress = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Reset complete', 'Reset link sent. Please check your inbox.')

        } catch (error) {
            console.log(error);
            Alert.alert('Error', "Incorrect or missing email. " + error.message)
        }
    };
    const onSignInPress = () => {
        navigation.navigate('Sign In', { userType: userType });
    };

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
                        <Text style={styles.title}>Reset your password</Text>
                    </View>


                    <CustomInput placeholder='Enter your email' value={email} setValue={setEmail} />
                    
                    <CustomButton onPress={onSendPress} text='Send' type='Primary' />
                    <CustomButton onPress={onSignInPress} text="Back to Sign In" type='Tertiary' />    

                </View>
            </ImageBackground>

        </ScrollView>

    );
}

export default ForgotPassWordScreen;


const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        flex: 1,
        marginTop: 200
        
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
        width: '100%'
    },
    image: {
        flex: 1,
        opacity: 0.2
    },
    bgroot: {
        alignItems: 'center',
        flex: 1,
        //to fix the keyboard popup!!!
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    tertiaryButtonsContainer: {
        flexDirection: 'row',
        padding: 10
    }
});