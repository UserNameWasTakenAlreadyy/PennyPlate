import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import HomeScreen from "../screens/HomeScreen";
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { auth } from "../../utils/firebase";
import ForgotPassWordScreen from '../screens/ForgotPasswordScreen';
import Colors from '../../constants/Colors';
import MerchantMainScreen from "../screens/MerchantMainScreen";
import { onAuthStateChanged } from "firebase/auth";
import AddFoodItemScreen from "../screens/AddFoodItemScreen";
import UpdateFoodScreen from "../screens/UpdateFoodScreen";

const Stack = createNativeStackNavigator();
const foodTemp = {
    id: "chicken rice",
    description: "yummy",
    price: "5",
    halal: "no"
}

function Navigation() {
    const [isSignedIn, setIsSignedIn] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsSignedIn(true);
            } else {
                setIsSignedIn(false);
            }
        });
        return unsub;
    }, []);;

    if (isSignedIn === null) {
        return;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.primaryBackground }
            }}>
                {isSignedIn ? (
                    <>
                    <Stack.Screen name="Merchant Main Screen" component={MerchantMainScreen} />
                    <Stack.Screen name="Add Food Item" component={AddFoodItemScreen} />
                    <Stack.Screen name="Update Food Item" component={UpdateFoodScreen} initialParams={{
                        selectedFoodObj: foodTemp
                    }}/>
                    </>

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