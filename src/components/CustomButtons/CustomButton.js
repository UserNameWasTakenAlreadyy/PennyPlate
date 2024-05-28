import { View, Text, StyleSheet, Pressable } from "react-native";
import Colors from "../../../constants/Colors";

function CustomButton({ onPress, text, type, bgColor, fgColor }) {
    return (
        <Pressable 
        style={[styles.container, styles[`container${type}`], bgColor ? {backgroundColor: bgColor} : {}]}
        onPress={onPress}>
            <Text style={[styles.text, styles[`text${type}`], fgColor ? {color: fgColor} : {}]}>{text}</Text>
        </Pressable>
    );
}

export default CustomButton;

const styles = StyleSheet.create({
    container: {
        
        width: '100%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 10
    },
    text: {
        fontWeight: 'bold',
        color: Colors.fontColor,
        fontSize: 16
    },
    containerPrimary: {
        backgroundColor: Colors.primaryComplement,
    },
    containerTertiary: {
        marginVertical:0
    },
    textTertiary: {
        color: 'grey',
        fontSize: 14
    }
});