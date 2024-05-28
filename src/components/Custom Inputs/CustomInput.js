import { Text, View, TextInput, StyleSheet } from "react-native";

function CustomInput({placeholder, value, setValue, secure}) {
    return (
        <View style={styles.container}>
            <TextInput
            value={value}
            onChangeText={setValue} 
            placeholder={placeholder} 
            style={styles.input}
            secureTextEntry={secure}></TextInput>
        </View>
    )
}

export default CustomInput;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        height: '5%',
        borderColor: '#9fe0d0',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginVertical: 5
    },
    input: {}
});