import { useState } from "react";
import { View, Text, StyleSheet, Modal, Alert } from "react-native";
import CustomButton from "../CustomButtons/CustomButton";
import Colors from "../../../constants/Colors";
import CustomIconButton from "../CustomButtons/CustomIconButton";
import { deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../../utils/firebase";
import { useNavigation } from "@react-navigation/native";



const sampleParagraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."


function FoodItem({ id, description, price, halal, refreshFoodItems }) {
    const navigation = useNavigation();
    const [visibile, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const dismissModal = () => setVisible(false);
    const user = auth.currentUser;
    
    //to delete food items, includes the refresh food item function to re render the list
    const deleteFoodItem = async (userId, name) => {
        try {
            
            await deleteDoc(doc(db, userId, name));
            Alert.alert(title="Deleted!");
            refreshFoodItems();
        } catch (error) {
            console.log('Error', error)
        }
    }

    const foodObj = {
        foodId: id, foodDescription: description, foodPrice: price, foodHalal: halal
    }

    return (
        <View style={styles.rootContainer}>
            <View style={styles.imageContainer}>
                <Text>Image</Text>
            </View>

            <View style={styles.foodItemContainer}>
                <View style={styles.iconsContainer}>
                    <View style={styles.iconContainer}>
                        <CustomIconButton icon='close' onPress={() => deleteFoodItem(user.displayName, id)}/>
                    </View>

                    <View style={styles.iconContainer}>
                        <CustomIconButton icon='edit' onPress={() => navigation.navigate("Update Food Item", {selectedFoodObj: foodObj, refreshFoodItems: refreshFoodItems})}/>
                    </View>
                </View>
                <Text>{id}</Text>
                <Text numberOfLines={3} ellipsizeMode="tail">{sampleParagraph}</Text>
                <Text onPress={showModal} style={{ color: 'blue', textDecorationLine: 'underline' }}>Click for more info</Text>
                <View style={styles.priceAndHalalContainer}>
                    <Text style={styles.priceConainter}>{price}</Text>
                    <Text style={styles.halalContainer}>{halal}</Text>
                </View>
            </View>
            <Modal visible={visibile} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalParagraphContainer}>
                        <Text style={styles.paragraphText}>
                            {sampleParagraph}
                        </Text>

                    </View>

                    <CustomButton onPress={dismissModal} type="Primary" text="Back" />
                </View>

            </Modal>
        </View>
    );
}



export default FoodItem;

const styles = StyleSheet.create({
    rootContainer: {
        flexDirection: 'row',
        borderWidth: 3,
        borderRadius: 5,
        backgroundColor: '#C3C8FF',
        borderColor: '#6870c4',

    },
    imageContainer: {
        padding: 10,
        marginRight: 100


    },
    foodItemContainer: {
        padding: 10,
        flex: 1

    },
    priceAndHalalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    priceConainter: {

    },
    halalContainer: {

    },
    modalContainer: {
        backgroundColor: Colors.primaryBackground,
        padding: 30,
        flex: 1,
    },
    modalParagraphContainer: {
        borderWidth: 5,
        padding: 10,
        justifyContent: "center",
        borderRadius: 10,
        borderColor: '#6870c4',
        backgroundColor: '#6870c4',
        marginBottom: 20
    },
    paragraphText: {
        color: 'white'
    },
    iconsContainer: {
        flexDirection: "row",
        justifyContent: 'flex-end'
    },
    iconContainer: {
        padding: 5
    }
});
