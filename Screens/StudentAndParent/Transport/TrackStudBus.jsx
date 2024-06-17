import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';
import { FontAwesome5 } from 'react-native-vector-icons';

const TrackStudBus = ({ route }) => {
  const { className, sectionName, studentName } = route.params || {};
  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const destination = {
    latitude: 14.16104,
    longitude: 79.37695
  };

  useEffect(() => {
    const fetchDriverLocation = async () => {
      try {
        const response = await axios.get(`https://studentassistant-18fdd-default-rtdb.firebaseio.com/accounts/Driver.json`);
        const data = response.data || {};

        let driverName = null;
        for (const [name, details] of Object.entries(data)) {
          if (details.students &&
              details.students[className] &&
              details.students[className][sectionName] &&
              details.students[className][sectionName][studentName]) {
            driverName = name;
            break;
          }
        }

        if (driverName) {
          const locationResponse = await axios.get(`https://studentassistant-18fdd-default-rtdb.firebaseio.com/accounts/Driver/${driverName}/Vehicle/Location.json`);
          const locationData = locationResponse.data;

          if (locationData) {
            const { latitude, longitude } = locationData;
            setDriverLocation({
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          } else {
            Alert.alert('Error', 'Driver location not found.');
          }
        } else {
          Alert.alert('Error', 'Driver information not found.');
        }
      } catch (error) {
        console.error('Error fetching driver location:', error);
        Alert.alert('Error', 'Failed to fetch driver location.');
      }
    };

    const trackUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      const userSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (location) => {
          const { latitude, longitude } = location.coords;
          setUserLocation({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      );

      return () => {
        userSubscription.remove();
      };
    };

    fetchDriverLocation();
    trackUserLocation();
  }, [className, sectionName, studentName]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={driverLocation || userLocation} showsUserLocation={false}>
        {driverLocation && (
          <>
            <Marker
              coordinate={{
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
              }}
              title="Bus Location"
            >
              <FontAwesome5 name="bus" size={30} color="red" />
            </Marker>
            <Polyline
              coordinates={[
                { latitude: driverLocation.latitude, longitude: driverLocation.longitude },
                { latitude: destination.latitude, longitude: destination.longitude }
              ]}
              strokeColor="blue"
              strokeWidth={3}
            />
          </>
        )}
        {destination && (
          <Marker
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            title="Destination"
          >
            <FontAwesome5 name="school" size={30} color="blue" />
          </Marker>
        )}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
          >
            <FontAwesome5 name="user" size={30} color="green" />
          </Marker>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default TrackStudBus;