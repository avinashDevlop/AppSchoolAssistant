import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from 'expo-location';
import axios from 'axios';

const MapScreen = ({ route }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const { destination, stopTracking, name } = route.params || {};

  useEffect(() => {
    const trackLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (location) => {
          const { latitude, longitude } = location.coords;
          const newLocation = {
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          setCurrentLocation(newLocation);

          // Update Firebase with the new location
          updateLocationInFirebase(latitude, longitude);

          if (destination) {
            const path = generateInterpolatedPath(
              { latitude, longitude },
              { latitude: destination.latitude, longitude: destination.longitude }
            );
            setRouteCoordinates(path);
          }
        }
      );

      setLocationSubscription(subscription);
    };

    trackLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [destination, stopTracking]);

  useEffect(() => {
    if (stopTracking && locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  }, [stopTracking]);

  const generateInterpolatedPath = (start, end, numPoints = 100) => {
    const latStep = (end.latitude - start.latitude) / numPoints;
    const lngStep = (end.longitude - start.longitude) / numPoints;
    const path = [];
    for (let i = 0; i <= numPoints; i++) {
      const latitude = start.latitude + latStep * i;
      const longitude = start.longitude + lngStep * i;
      path.push({ latitude, longitude });
    }
    return path;
  };

  const updateLocationInFirebase = async (latitude, longitude) => {
    try {
      await axios.put(`https://studentassistant-18fdd-default-rtdb.firebaseio.com/accounts/Driver/${name}/Location.json`, {
        latitude,
        longitude,
      });
    } catch (error) {
      console.error('Error updating location in Firebase:', error);
      Alert.alert('Error', 'Failed to update location in Firebase.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={currentLocation}
        showsUserLocation={true}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Bus Location"
          />
        )}
        {destination && (
          <Marker
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            title="School"
            pinColor="blue"
          />
        )}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={4}
            strokeColor="blue"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;