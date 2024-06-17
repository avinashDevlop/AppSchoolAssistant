import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import axios from 'axios';

const baseURL = 'https://studentassistant-18fdd-default-rtdb.firebaseio.com/accounts/Driver';

const TransportScreen = ({ navigation }) => {
  const [transportData, setTransportData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseURL}.json`);
      const data = response.data;
      if (data) {
        const transportArray = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name,
          vehicle: data[key].Vehicle.vehicleNo,
        }));
        setTransportData(transportArray);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderItem = ({ item }) => (
    <Card>
      <View style={styles.cardHeader}>
        <Icon name="bus" type="font-awesome" size={24} color="#517fa4" />
        <Text style={styles.cardTitle}>Driver: {item.name}</Text>
      </View>
      <Text style={styles.cardText}>Vehicle: {item.vehicle}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('adminTransport', { driverName: item.name })}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={transportData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardText: {
    fontSize: 16,
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#517fa4',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default TransportScreen;
