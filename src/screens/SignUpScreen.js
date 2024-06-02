import { Text, View, Image, StyleSheet, ImageBackground, ScrollView, Dimensions, Alert, ActivityIndicator, Button } from "react-native";
import CustomInput from '../components/Custom Inputs/CustomInput';
import CustomButton from "../components/CustomButtons/CustomButton";
import { useState } from "react";
import Colors from "../../constants/Colors";
import background from '../../assets/images/backgroundSignUp.jpg'
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from "../../utils/firebase";
import CustomIndicator from "../components/Custom Indicator/CustomIndicator";


function SignUpScreen() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [loading, setLoading] = useState(false);

    //function to pass email, password and username(as display name) to firebase authentication
    const onRegisterPressed = async () => {
        if (password !== passwordRepeat) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (loading) {
            return;
        }

        setLoading(true);

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user, { displayName: username });
            await user.reload();
            await sendEmailVerification(user);
            Alert.alert('Success', 'Sign up complete!');
        } catch (error) {
            console.log(error);
            Alert.alert('Error', error.message);
        
        } finally {
            setLoading(false);
        } 
    };

    const onSignIn = () => {
        navigation.navigate('Sign In')
    };

    //implement some terms of service page later on
    const onTermsOfUsePress = () => {
        console.log('sign in');
    };

    const onPrivacyPolicyPress = () => {
        console.log('sign in');
    };

    const loadingIndicator = loading ? <CustomIndicator/> : <CustomButton onPress={onRegisterPressed} text='Register' type='Primary' />


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
                        <Text style={styles.title}>Create an account</Text>
                    </View>


                    <CustomInput placeholder='Username' value={username} setValue={(text) => setUsername(text)} />
                    <CustomInput placeholder='Email' value={email} setValue={(text) => setEmail(text)} />
                    <CustomInput placeholder='Password' value={password} setValue={(text) => setPassword(text)} secure={true} />
                    <CustomInput placeholder='Confirm password' value={passwordRepeat} setValue={(text) => setPasswordRepeat(text)} secure={true} />

                    
                    {loadingIndicator}
                    <View style={styles.policyContainer}>
                        <Text style={styles.policyText}>By registering, you confirm that you accept
                            our <Text style={styles.policyTextHighLight}
                                onPress={onTermsOfUsePress}>Terms of Use</Text> and <Text style={styles.policyTextHighLight}
                                    onPress={onPrivacyPolicyPress}>Privacy Policy</Text></Text>
                    </View>
                    <CustomButton onPress={onSignIn} text="Already have an account? Sign in" type='Tertiary' />


                </View>
            </ImageBackground>

        </ScrollView>

    );
}

export default SignUpScreen;


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
        flex: 1,
        justifyContent: 'center',
        height: '100%',
        width: '100%'
    },
    image: {
        opacity: 0.2,
    },
    bgroot: {
        alignItems: 'center',
        flex: 1,
        //to fix the keyboard popup!!!
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    
});