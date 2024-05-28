import { StyleSheet, ActivityIndicator, View } from "react-native";
import Colors from "../../../constants/Colors";

function CustomIndicator() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size='small'/>
        </View>
    );
}

export default CustomIndicator;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 15,
        marginVertical: 6,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: Colors.primaryComplement,
    },
});