import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from 'expo-location';
import api from "../../api"

const MapScreen = ({ route }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [driverStatus, setDriverStatus] = useState(null);
  const { destination, stopTracking, name } = route.params || {};

  useEffect(() => {
    const fetchDriverStatus = async () => {
      try {
        const response = await api.get(`accounts/Driver/${name}/Vehicle/status.json`);
        setDriverStatus(response.data);
      } catch (error) {
        console.error('Error fetching driver status from Firebase:', error);
        Alert.alert('Error', 'Failed to fetch driver status from Firebase.');
      }
    };

    fetchDriverStatus();
  }, [name]);

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

          if (!stopTracking && driverStatus === 'active') {
            updateLocationInFirebase(latitude, longitude);
          }

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

    if (driverStatus !== null) {
      trackLocation();
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [destination, driverStatus]);

  useEffect(() => {
    if (stopTracking && locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  }, [stopTracking, locationSubscription]);

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
      await api.put(`accounts/Driver/${name}/Vehicle/Location.json`, {
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
      {currentLocation && (
        <MapView
          style={styles.map}
          initialRegion={currentLocation}
          showsUserLocation={false} // Set to false as we are using a custom marker
        >
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Bus Location"
          >
            <FontAwesome5 name="bus" size={30} color="#f0a029" />
          </Marker>
          {destination && (
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              title="School"
            >
              <FontAwesome5 name="school" size={30} color="blue" />
            </Marker>
          )}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={4}
              strokeColor="blue"
            />
          )}
        </MapView>
      )}
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