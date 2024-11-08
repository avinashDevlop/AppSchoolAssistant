import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const DriverLogin = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Missing fields', 'Please enter both username and password');
      return;
    }

    setLoading(true);

    axios.get('https://studentassistant-18fdd-default-rtdb.firebaseio.com/accounts/Driver.json')
      .then(response => {
        const drivers = response.data;
        if (!drivers) {
          throw new Error('No drivers found');
        }

        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        const driver = Object.values(drivers).find(driver => driver.userName === trimmedUsername);

        if (driver && driver.password === trimmedPassword) {
          navigation.navigate('Driver Home', driver);
        } else {
          Alert.alert('Invalid credentials', 'Please enter correct username and password');
        }
      })
      .catch(error => {
        console.error('Error fetching driver data:', error);
        Alert.alert('Error', 'An error occurred while trying to login. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Ionicons name="car-sport-outline" size={100} color="#007bff" style={styles.icon} />
      <Text style={styles.title}>Driver</Text>

      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry={!showPassword}
        />
        <Ionicons
          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
          size={24}
          color="#333"
          style={styles.passwordIcon}
          onPress={togglePasswordVisibility}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonTitle}>Login</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff',
  },
  icon: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#333',
  },
  passwordIcon: {
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default DriverLogin;
