import { Text, View, StyleSheet, Dimensions, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import FoodItemUser from "../Food Menu/FoodItemUser";

function UserFoodMenu({ storeName }) {
    const [foodMenu, setFoodMenu] = useState([]);

    const fetchFoodMenu = async () => {
        try {
            const menuRef = collection(db, storeName); // Fetching from the collection named after the store
            const querySnapshot = await getDocs(menuRef);
            const menuItems = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setFoodMenu(menuItems);
        } catch (error) {
            console.log("Error fetching food menu: ", error);
        }
    };

    useEffect(() => {
        fetchFoodMenu();
    }, []);

    const renderItem = ({ item }) => (
        <FoodItemUser
            id={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            halal={item.halal}
            imageUrl={item.imageUrl}
        />
    );

    return (
        <View style={styles.root}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Food Menu</Text>
            </View>
            <FlatList
                data={foodMenu}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ gap: 10 }}
            />
        </View>
    );
}

export default UserFoodMenu;

const styles = StyleSheet.create({
    root: {
        alignItems: 'stretch',
        padding: 20,
        flex: 1,
        width: Dimensions.get('window').width,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    titleContainer: {
        alignItems: 'center'
    },
});
