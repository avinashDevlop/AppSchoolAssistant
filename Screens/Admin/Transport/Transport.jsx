import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-elements';

const transportData = [
  { id: '1', route: 'Route 1', timing: '7:30 AM - 8:00 AM', vehicle: 'Bus 101' },
  { id: '2', route: 'Route 2', timing: '7:45 AM - 8:15 AM', vehicle: 'Bus 102' },
  { id: '3', route: 'Route 3', timing: '8:00 AM - 8:30 AM', vehicle: 'Bus 103' },
];

const TransportScreen = () => {
  const renderItem = ({ item }) => (
    <Card>
      <View style={styles.cardHeader}>
        <Icon name="bus" type="font-awesome" size={24} color="#517fa4" />
        <Text style={styles.cardTitle}>Driver : {item.route}</Text>
      </View>
      <Text style={styles.cardText}>Timing: {item.timing}</Text>
      <Text style={styles.cardText}>Vehicle: {item.vehicle}</Text>
      <TouchableOpacity style={styles.button}>
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
