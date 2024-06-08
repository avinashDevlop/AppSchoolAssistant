import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

const TrackStudBus = ({ route }) => {
  const { className, sectionName, studentName } = route.params || {};
  const [driverLocation, setDriverLocation] = useState(null);
  const destination = {
    latitude: 14.16104,
    longitude: 79.37695
  };

  useEffect(() => {
    const fetchDriverLocation = async () => {
      try {
        // Fetch the driver name based on the student's class, section, and name
        const response = await axios.get(`https://studentassistant-18fdd-default-rtdb.firebaseio.com/accounts/Driver.json`);
        const data = response.data || {};

        let driverName = null;
        // Traverse through the drivers to find the one associated with the student
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
          // Fetch the driver's location
          const locationResponse = await axios.get(`https://studentassistant-18fdd-default-rtdb.firebaseio.com/accounts/Driver/${driverName}/Location.json`);
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

    fetchDriverLocation();
  }, [className, sectionName, studentName]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={driverLocation} showsUserLocation={true}>
        {driverLocation && (
          <>
            <Marker
              coordinate={{
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
              }}
              title="Bus Location"
            />
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
            pinColor="blue"
          />
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
