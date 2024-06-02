import { Text, View, StyleSheet, ImageBackground, Dimensions, FlatList } from "react-native";
import CustomButton from "../components/CustomButtons/CustomButton";
import { useEffect, useState } from "react";
import background from '../../assets/images/backgroundSignUp.jpg'
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { collection, getDocs} from "firebase/firestore";
import FoodItem from "../components/Food Menu/FoodItem";


function MerchantMainScreen() {
    const navigation = useNavigation();

    //function to log out of the current merchant
    const onBackPress = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Sign In');
        } catch (error) {
            console.log('Error signing out: ', error);
        }
    };


    //function to add menu item
    const onAddMenuItemsPress = () => {
        navigation.navigate('Add Food Item', {
            refreshFoodItems: fetchFoodItems
        });
    }

    const user = auth.currentUser;
    const [foodItems, setFoodItems] = useState([]);
    let todoRef;



    //read data from data base and fetch it to put inside flat list
    const fetchFoodItems = async () => {
        try {
            todoRef = collection(db, user.displayName);
            const querySnapshot = await getDocs(todoRef);
            const documents = [];
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            setFoodItems(documents)

        } catch (error) {
            console.log("error", error);
        }
    }

    //function to render info into the flat list
    useEffect(() => {
        fetchFoodItems();
    }, []); 
    const renderItem = ({ item }) => (
        <FoodItem id={item.id} 
        description={item.description} 
        price={item.price} 
        halal={item.halal} 
        refreshFoodItems={fetchFoodItems}/>
    );

    return (
        <ImageBackground
            style={styles.imageContainer}
            imageStyle={styles.image}
            source={background}
            resizeMode="cover">
            <View style={styles.root}>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Merchant Main Screen</Text>
                </View>
                <View>

                </View>


                <FlatList
                    data={foodItems}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ gap: 10 }}
                />
                <CustomButton onPress={onBackPress} text='Log Out' type='Primary' />
                <CustomButton onPress={onAddMenuItemsPress} text='Add Menu Items' type='Primary' />
                
                
            </View>
        </ImageBackground>



    );
}

export default MerchantMainScreen;


const styles = StyleSheet.create({
    root: {
        alignItems: 'stretch',
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