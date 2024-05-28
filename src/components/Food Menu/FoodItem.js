import { View, Text, StyleSheet } from "react-native";


function FoodItem() {
    return (
        <View style={styles.rootContainer}>
            <View style={styles.imageContainer}>
                <Text>Image</Text>
            </View>

            <View style={styles.foodItemContainer}>
                <Text>#FoodItem 1</Text>
                <Text>Description</Text>
                <View style={styles.priceAndHalalContainer}>
                    <Text style={styles.priceConainter}>Price</Text>
                    <Text style={styles.halalContainer}>Halal</Text>
                </View>
            </View>
            
        </View>
    );
}



export default FoodItem;

const styles = StyleSheet.create({
    rootContainer: {
        flexDirection: 'row',
        borderWidth: 3,
        borderRadius: 5,
        
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

    }
});
