import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Navigation from './src/Navigation/Navigation';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Navigation/>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
});


