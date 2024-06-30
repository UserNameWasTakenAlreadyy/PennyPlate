import React, { useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function SelectMap({ onLocationSelect, initialLocation }) {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(initialLocation);


  //get permission to use location service, then get current location first
  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync({});
      if (status !== 'granted') {
        console.log("Please grant location permissions!");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      
      if (initialLocation) {
        setRegion({
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.0922,  // adjust this value to change the zoom level
          longitudeDelta: 0.0421, // adjust this value to change the zoom level
        });
        setMarker(initialLocation);
      } else {
        setLocation(currentLocation);
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,  // adjust this value to change the zoom level
          longitudeDelta: 0.0421, // adjust this value to change the zoom level
        });
      }
    };
    getPermissions();
  }, [initialLocation]);

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  //using the google places autocomplete component for the search bar

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <GooglePlacesAutocomplete
          placeholder='Search'
          fetchDetails={true}
          onPress={(data, details = null) => {
            const { lat, lng } = details.geometry.location;
            setRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
            setMarker({
              latitude: lat,
              longitude: lng,
            });
            onLocationSelect({ latitude: lat, longitude: lng });
          }}
          query={{
            key: 'AIzaSyBAL3jnjoHqIJrCdfbPYIZVdphctl7yP7g',
            language: 'en',
            location: `${region.latitude},${region.longitude}`, // Location bias
            radius: 10000, // Radius in meters
          }}
          styles={{
            container: styles.searchBox,
            textInput: styles.searchBoxField,
            listView: styles.listView,
          }}
        />
      </View>
      <View style={{flex: 14}}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={region}
          showsUserLocation
          showsMyLocationButton
        >
          {marker && <Marker coordinate={marker} />}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    top: 0,
  },
  searchBoxField: {
    borderRadius: 0,
    fontSize: 15,
    backgroundColor: 'white',
  },
  listView: {
    backgroundColor: 'white',
  },
});
