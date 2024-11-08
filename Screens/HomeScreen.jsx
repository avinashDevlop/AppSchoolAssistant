import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = () => {
  const navigation = useNavigation();

  const CustomButton = ({ destination, icon, label }) => {
    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate(destination)}
      >
        <View style={styles.button}>
          <Icon name={icon} size={50} color="#fff" style={styles.icon} />
          <Text style={styles.label}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Choose your option</Text>
      <CustomButton destination="Admin Login" icon="user" label="Admin" />
      <CustomButton destination="Teacher Login" icon="graduation-cap" label="Teacher" />
      <CustomButton destination="Student & Parent Login" icon="child" label="Student" />
      <CustomButton destination="Driver Login" icon="car" label="Driver" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // This makes the ScrollView take the full height
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20, // Add some bottom padding to avoid cutting off the last button
  },
  text: {
    fontSize: 24,
    color: '#6D3AFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
    width: '100%',
  },
  icon: {
    margin: 7,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
