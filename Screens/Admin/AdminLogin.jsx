import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../../firebaseConfig';

const AdminLogin = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please enter both username and password');
      return;
    } 

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, username, password);
      navigation.navigate('Admin Home');
    } catch (error) {
      Alert.alert('Invalid Credentials', 'Incorrect username or password');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ionicons name="person-circle-outline" size={100} color="#007bff" style={styles.icon} />
      <Text style={styles.title}>Admin</Text>

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
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonTitle}>Login</Text>
        </TouchableOpacity>
      )}
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
  loginButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
});

export default AdminLogin;
