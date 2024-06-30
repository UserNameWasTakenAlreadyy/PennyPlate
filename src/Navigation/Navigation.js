import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import HomeScreen from "../screens/HomeScreen";
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { auth, db } from "../../utils/firebase";
import ForgotPassWordScreen from '../screens/ForgotPasswordScreen';
import Colors from '../../constants/Colors';
import MerchantMainScreen from "../screens/MerchantMainScreen";
import MerchantSetLocation from "../screens/MerchantSetLocation";
import { onAuthStateChanged } from "firebase/auth";
import AddFoodItemScreen from "../screens/AddFoodItemScreen";
import UpdateFoodScreen from "../screens/UpdateFoodScreen";
import UserMainScreen from "../screens/UserMainScreen";
import { getDoc, doc } from "firebase/firestore";
import UserFoodDetailsScreen from "../screens/UserFoodDetailsScreen";
import IdleGameScreen from "../screens/IdleGameScreen";
import TapCounterGame from "../components/Games/TapCounterGame";
import TicTacToeGame from "../components/Games/TicTacToeGame";
import FlappyBurgerGame from "../components/Games/FlappyBurgerGame";
import BirdSelectionScreen from "../components/Games/SelectionScreen";
import MerchantSetPicture from "../screens/MerchantSetPictureScreen";

const Stack = createNativeStackNavigator();
const foodTemp = {
    id: "chicken rice",
    description: "yummy",
    price: "5",
    halal: "no"
}

function Navigation() {
    const [isSignedIn, setIsSignedIn] = useState(null);
    const [userType, setUserType] = useState('');

    const getUserType = async (user) => {
        const docRef = doc(db, 'users', user.displayName);
        const docSnap = await getDoc(docRef);
        return docSnap.data().userType;
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user && user.emailVerified) {
                const type = await getUserType(user);
                setIsSignedIn(true);
                setUserType(type);
            } else {
                setIsSignedIn(false);
            }
        });
        return unsub;
    }, []);

    if (isSignedIn === null) {
        return null; // Or a loading indicator
    }

    const merchantStack = <>
        <Stack.Screen name="Merchant Main Screen" component={MerchantMainScreen} />
        <Stack.Screen name="Merchant Set Location" component={MerchantSetLocation} />
        <Stack.Screen name="Merchant Set Picture" component={MerchantSetPicture} />
        <Stack.Screen name="Add Food Item" component={AddFoodItemScreen} />
        <Stack.Screen name="Update Food Item" component={UpdateFoodScreen} initialParams={{ selectedFoodObj: foodTemp }} />
    </>;

    const userStack = <>
        <Stack.Screen name="User Main Screen" component={UserMainScreen} />
        <Stack.Screen name="User Food Details" component={UserFoodDetailsScreen} />
        <Stack.Screen name="Idle Game Screen" component={IdleGameScreen} />
        <Stack.Screen name="Tap Counter Game" component={TapCounterGame} />
        <Stack.Screen name="Tic Tac Toe Game" component={TicTacToeGame} />
        <Stack.Screen name="Flappy Burger Game Selection" component={BirdSelectionScreen} />
        <Stack.Screen name="Flappy Burger Game" component={FlappyBurgerGame} />
    </>;

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.primaryBackground }
            }}>
                {isSignedIn ? (
                    userType === 'merchant' ? merchantStack : userStack
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Sign In" component={SignInScreen} />
                        <Stack.Screen name="Sign Up" component={SignUpScreen} />
                        <Stack.Screen name="Forgot Password" component={ForgotPassWordScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;
