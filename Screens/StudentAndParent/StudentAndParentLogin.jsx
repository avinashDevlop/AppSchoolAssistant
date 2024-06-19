import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const StudentAndParentLogin = ({ navigation }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState();
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/previousYearStudents.json"
        );
        const data = response.data || {};

        const dataArray = Object.entries(data).map(([value, label]) => ({
          value,
          label,
        }));
        setDataArray(dataArray);

        if (data) {
          const fetchedOptions = Object.keys(data).map((className) => ({
            value: className,
            label: className,
          }));
          const options = [
            { value: '10th Class', label: '10th Class' },
            { value: '9th Class', label: '9th Class' },
            { value: '8th Class', label: '8th Class' },
            { value: '7th Class', label: '7th Class' },
            { value: '6th Class', label: '6th Class' },
            { value: '5th Class', label: '5th Class' },
            { value: '4th Class', label: '4th Class' },
            { value: '3rd Class', label: '3rd Class' },
            { value: '2nd Class', label: '2nd Class' },
            { value: '1st Class', label: '1st Class' },
            { value: 'UKG', label: 'UKG' },
            { value: 'LKG', label: 'LKG' },
            { value: 'Pre-K', label: 'Pre-K' },
            ...fetchedOptions,
          ];
          setClassOptions(options);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching class options:", error);
      }
    };

    fetchClassOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let data;

      try {
        setLoading(true);

        if (dataArray.some((item) => item.value === selectedClass)) {
          const response = await axios.get(
            `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/previousYearStudents/${selectedClass}.json`
          );
          data = response.data;
        } else {
          const response = await axios.get(
            `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/${selectedClass}.json`
          );
          data = response.data;
        }
        if (data) {
          const sections = Object.keys(data);
          setSections(sections);
          setSelectedSection(sections[0]);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    if (selectedClass) {
      fetchData();
    }
  }, [selectedClass, dataArray]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        let url = "";

        if (dataArray.some((item) => item.value === selectedClass)) {
          url = `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/previousYearStudents/${selectedClass}/${selectedSection}.json`;
        } else {
          url = `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/${selectedClass}/${selectedSection}.json`;
        }

        const response = await axios.get(url);
        const data = response.data;

        setStudentData(Array.isArray(data) ? data : Object.values(data || {}));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching student data:", error);
      }
    };

    if (selectedClass && selectedSection) {
      fetchStudentData();
    }
  }, [selectedClass, selectedSection, dataArray]);

  const handleLogin = () => {
    // console.log(studentData)
    const student = studentData.find(
      (student) => student.email === username && student.formNo === password
    );
     //student
    if (student) {
      navigation.navigate('Student & Parent Home',student);
    } else {
      Alert.alert('Invalid credentials', 'Please enter correct username and password');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#007bff" />}
      {!loading && (
        <>
          <Ionicons name="people-outline" size={100} color="#007bff" style={styles.icon} />
          <Text style={styles.title}>Student & Parent</Text>
          <Text style={styles.label}>Class:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedClass}
              onValueChange={(itemValue) => setSelectedClass(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select class" value="" />
              {classOptions.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Section:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedSection}
              onValueChange={(itemValue) => setSelectedSection(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select section" value="" />
              {sections.map((section) => (
                <Picker.Item key={section} label={section} value={section} />
              ))}
            </Picker>
          </View>
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
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonTitle}>Login</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  pickerContainer: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom:

 20,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  loginButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  loginButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default StudentAndParentLogin;