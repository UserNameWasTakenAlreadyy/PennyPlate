import { Text, View, Image, StyleSheet, useWindowDimensions, ScrollView, Alert} from "react-native";
import Logo from '../../assets/images/FoodLogo.png'
import CustomInput from '../components/Custom Inputs/CustomInput';
import CustomButton from "../components/CustomButtons/CustomButton";
import { useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import CustomIndicator from "../components/Custom Indicator/CustomIndicator";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useCallback} from "react";


function SignInScreen({ route }) {
    const navigation = useNavigation();
    const { height } = useWindowDimensions();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { userType } = route.params;

    // Use useFocusEffect to re-check auth state when the screen is focused
    useFocusEffect(
        useCallback(() => {
            // Re-check auth state here
            const checkAuthState = async () => {
                const user = auth.currentUser;
                if (user && user.emailVerified) {
                    const docRef = doc(db, 'users', user.displayName);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.data().userType === userType) {
                        navigation.navigate(userType === 'merchant' ? 'Merchant Main Screen' : 'User Main Screen');
                    }
                }
            };
            checkAuthState();
        }, [])
    );

    //function to handle sign in
    const onSignInPress = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, username, password);
            const user = userCredential.user;
            const docRef = doc(db, 'users', user.displayName);
            const docSnap = await getDoc(docRef);

            if (user.emailVerified) {
                if (docSnap.data().userType !== userType) {
                    Alert.alert('Sign in unsuccessful', `Not a ${userType}`);
                    signOut(auth);
                } else {
                    navigation.navigate(userType === 'merchant' ? 'Merchant Main Screen' : 'User Main Screen');
                }
            } else {
                Alert.alert('Sign in unsuccessful', 'Please verify your email before signing in!');
                return;
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };


    //navigates to forgot password page
    const onForgotPasswordPress = () => {
        navigation.navigate('Forgot Password', { userType: userType });
    };

    const onBackPress = () => {
        navigation.navigate('Home');
    };

    //implement google later on
    const onSignInGoogle = () => {
        console.log('sign in');
    };

    //navigates to sign up page
    const onSignUp = () => {
        navigation.navigate('Sign Up', { userType: userType });
    };

    //to handle loading indicator
    const loadingIndicator = loading ? <CustomIndicator /> : <CustomButton onPress={onSignInPress} text={loading ? 'Loading...' : 'Sign In'} type='Primary' />


    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.root}>
                <Image
                    source={Logo}
                    style={[styles.logo, { height: height * 0.4 }]}
                    resizeMode="contain" />
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>PennyPlate</Text>
                </View>


                <CustomInput placeholder='Email' value={username} setValue={setUsername} />
                <CustomInput placeholder='Password' value={password} setValue={setPassword} secure={true} />

                {loadingIndicator}
                <CustomButton onPress={onBackPress} text='Back' type='Primary' bgColor='#5774ea' fgColor='white' />
                <CustomButton onPress={onForgotPasswordPress} text='Forgot Password?' type='Tertiary' />
                <CustomButton onPress={onSignInGoogle} text='Sign In With Google' type='Primary' bgColor='#5774ea' fgColor='white' />
                <CustomButton onPress={onSignUp} text="Don't have an account? Create one here" type='Tertiary' />
            </View>
        </ScrollView>

    );
}

export default SignInScreen;


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

    },
    scrollViewContent: {
        flexGrow: 1,
    },
});