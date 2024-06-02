import { View, Text, Pressable, StyleSheet, Image, Dimensions } from "react-native";
import Colors from "../../../constants/Colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const dummy = () => {
    console.log("Pressed");
}
export default function CustomIconButton({icon, onPress}) {
    return (
        <Pressable onPress={onPress}>
            <FontAwesome name={icon} size={20} color="#000000" />
        </Pressable>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primaryComplement,
        alignItems: 'center',
        justifyContent: 'center',
        height: "1%",
        width: "1%"
    },
    image: {
        width: Dimensions.get('window').width,
        aspectRatio: 1
    }
});