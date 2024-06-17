import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import api from '../../../api';
import { FontAwesome5 } from 'react-native-vector-icons';

const AdminTransport = ({ route, navigation }) => {
  const { driverName } = route.params || {};
  const [driverLocation, setDriverLocation] = useState(null);
  const destination = {
    latitude: 14.16104,
    longitude: 79.37695
  };

  useEffect(() => {
    let intervalId;

    const fetchDriverLocation = async () => {
      try {
        if (driverName) {
          const locationResponse = await api.get(`accounts/Driver/${driverName}/Vehicle/Location.json`);
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
            navigation.navigate('Transport');
          }
        } else {
          Alert.alert('Error', 'Driver information not found.');
          navigation.navigate('Transport');
        }
      } catch (error) {
        console.error('Error fetching driver location:', error);
        Alert.alert('Error', 'Failed to fetch driver location.');
        navigation.navigate('Transport');
      }
    };

    fetchDriverLocation();
    intervalId = setInterval(fetchDriverLocation, 5000); // Fetch the location every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [driverName, navigation]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={driverLocation} showsUserLocation={false}>
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
        <Marker
          coordinate={{
            latitude: destination.latitude,
            longitude: destination.longitude,
          }}
          title="Destination"
        >
          <FontAwesome5 name="school" size={30} color="blue" />
        </Marker>
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

export default AdminTransport;