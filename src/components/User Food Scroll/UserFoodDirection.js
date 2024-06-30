import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { requestForegroundPermissionsAsync, watchPositionAsync, LocationAccuracy } from 'expo-location';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import CustomPicker from '../Picker/Picker';

function UserFoodDirection({ storeName }) {
    const [userLocation, setUserLocation] = useState(null);
    const [storeLocation, setStoreLocation] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [error, setError] = useState(null);
    const [selectedTransport, setSelectedTransport] = useState('DRIVE'); // Default transport mode is driving

    useEffect(() => {
        const fetchStoreLocation = async () => {
            try {
                const query = doc(db, 'merchant', storeName);
                const docSnapshot = await getDoc(query);
                if (docSnapshot.exists()) {
                    const storeData = docSnapshot.data();
                    setStoreLocation({
                        latitude: storeData.latitude,
                        longitude: storeData.longitude,
                    });
                } else {
                    setError('Store document not found in Firestore');
                }
            } catch (error) {
                setError('Error fetching store location');
            }
        };

        const requestLocationPermission = async () => {
            try {
                const { status } = await requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setError('Location permission not granted');
                }
            } catch (error) {
                setError('Error requesting location permission');
            }
        };

        fetchStoreLocation();
        requestLocationPermission();
    }, [storeName]);

    useEffect(() => {
        const startLocationUpdates = async () => {
            try {
                await watchPositionAsync({
                    accuracy: LocationAccuracy.High,
                    timeInterval: 1000, // Update every 1 second
                    distanceInterval: 10, // Update when the user moves 10 meters
                }, async (newLocation) => {
                    setUserLocation(newLocation.coords);
                    if (storeLocation) {
                        await fetchRoute(newLocation.coords, storeLocation, selectedTransport);
                    }
                });
            } catch (error) {
                setError('Error starting location updates');
            }
        };

        startLocationUpdates();
    }, [storeLocation, selectedTransport]);

    const fetchRoute = async (origin, destination, transport) => {
        try {
            const response = await fetch(
                `https://routes.googleapis.com/directions/v2:computeRoutes?key=AIzaSyBAL3jnjoHqIJrCdfbPYIZVdphctl7yP7g`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline',
                    },
                    body: JSON.stringify({
                        origin: {
                            location: {
                                latLng: {
                                    latitude: origin.latitude,
                                    longitude: origin.longitude,
                                },
                            },
                        },
                        destination: {
                            location: {
                                latLng: {
                                    latitude: destination.latitude,
                                    longitude: destination.longitude,
                                },
                            },
                        },
                        travelMode: selectedTransport, // Pass the selected transport mode
                    }),
                }
            );
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
                const points = decodePolyline(data.routes[0].polyline.encodedPolyline);
                setRouteCoordinates(points);
            } else {
                setError(`Error fetching route: ${data.error || 'No routes found'}`);
            }
        } catch (error) {
            setError('Error fetching route: Network error');
        }
    };


    //plotting of direction to location by reversing the encoding of google maps polyline
    const decodePolyline = (encoded) => {
        //poly stores all the coordinates 
        let poly = [];
        //index starts at 0 and shifts across each character, len is the length of the encoded string
        let index = 0, len = encoded.length;
        let lat = 0, lng = 0;

        while (index < len) {
            //b and shift is initialised, shift is used to shift by 5 to obtain the last 5 digits of 
            //the binary of each character when read into variable b
            let b, shift = 0, result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            //accumulated lat to track movement
            lat += dlat;
            //shift and result are reset for the next set of coordinates
            shift = 0;
            result = 0;
            //same as finding latitude above
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            //stored to the array in the form of an object: {latitude:..., longitude:...}
            poly.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
        }
        return poly;
    };

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    // Callback function to handle transport mode selection
    const handleTransportSelect = (transport) => {
        setSelectedTransport(transport);
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Food Direction</Text>
            </View>
            <View style={styles.pickerContainer}>
                <CustomPicker onSelectTransport={handleTransportSelect} />
            </View>

            {(userLocation && storeLocation) ? (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    provider={PROVIDER_GOOGLE}
                >
                    <Marker
                        coordinate={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        }}
                        title="Your Location"
                        description="You are here"
                    />
                    <Marker
                        coordinate={{
                            latitude: storeLocation.latitude,
                            longitude: storeLocation.longitude,
                        }}
                        title="Store Location"
                        description={storeName}
                    />
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#0008ff"
                        strokeWidth={3}
                    />
                </MapView>
            ) : (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading map...</Text>
                </View>
            )}
        </View>
    );
}

export default UserFoodDirection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    map: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    titleContainer: {
        alignItems: 'center'
    },
});
