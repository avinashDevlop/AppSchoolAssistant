import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const TeacherLogin = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true); // Start loading

    axios.get('https://studentassistant-18fdd-default-rtdb.firebaseio.com/accounts/Teachers.json')
      .then(response => {
        const teachers = response.data;
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        const teacher = Object.values(teachers).find(teacher => teacher.userName === trimmedUsername);

        if (teacher && teacher.password === trimmedPassword) {
          setLoading(false); // Stop loading
          navigation.navigate('Teacher Home', teacher);
        } else {
          setLoading(false); // Stop loading
          Alert.alert('Invalid credentials', 'Please enter correct username and password');
        }
      })
      .catch(error => {
        setLoading(false); // Stop loading
        console.error('Error fetching teacher data:', error);
        Alert.alert('Error', 'An error occurred while trying to login. Please try again later.');
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Ionicons name="school-outline" size={100} color="#007bff" style={styles.icon} />
        <Text style={styles.title}>Teacher</Text>

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

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonTitle}>Login</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    marginTop: 20,
  },
  loginButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default TeacherLogin;
