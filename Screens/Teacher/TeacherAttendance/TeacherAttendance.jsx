import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from '@react-native-ml-kit/face-detection';
import * as Location from 'expo-location';
import { auth, storage, database } from '../../../firebaseConfig';
import { ref, push, serverTimestamp } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const TeacherAttendance = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestPermissionsAsync();
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      setHasPermission(cameraStatus === 'granted' && locationPermission.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({ quality: 0.85 });
        const faceDetected = await detectFace(photo.uri);

        if (faceDetected) {
          const location = await Location.getCurrentPositionAsync({});
          await markAttendance(photo.uri, location);
          Alert.alert('Success', 'Attendance marked successfully!');
        } else {
          Alert.alert('Error', 'No face detected. Please try again.');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const detectFace = async (uri) => {
    const faces = await FaceDetector.detectFromUri(uri);
    return faces.length > 0;
  };

  const markAttendance = async (imageUri, location) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Upload image to Firebase Storage
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const imageRef = storageRef(storage, `attendance/${user.uid}_${Date.now()}.jpg`);
    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);

    // Add attendance record to Firebase Realtime Database
    const attendanceRef = ref(database, 'attendance');
    await push(attendanceRef, {
      userId: user.uid,
      timestamp: serverTimestamp(),
      imageUrl,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  };

  if (!hasPermission) {
    return <Text>No access to camera or location</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ref={(ref) => setCameraRef(ref)}
        type={Camera.Constants.Type.front}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.buttonText}>Mark Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default TeacherAttendance;
