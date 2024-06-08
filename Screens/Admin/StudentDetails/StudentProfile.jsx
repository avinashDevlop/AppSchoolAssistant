import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const StudentProfile = ({ route }) => {
  const { studentDetails = {...route.params}, index = 0 } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://example.com/profile.jpg' }} // Replace with actual image URI
            style={styles.profileImage}
          />
        </View>

        {/* Student Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Student Name: {studentDetails.surname || 'N/A'} {studentDetails.name || 'N/A'}</Text>
          <Text style={styles.detailText}>Gender: {studentDetails.gender || 'N/A'}</Text>
          <Text style={styles.detailText}>Class: {studentDetails.selectedClass || 'N/A'}</Text>
          <Text style={styles.detailText}>Section: {studentDetails.selectedSection || 'N/A'}</Text>
          <Text style={styles.detailText}>Roll Number: {index + 1}</Text>
        </View>
      </View>

      {/* Other Details */}
      <View style={styles.otherDetailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.detail}>{studentDetails.dob || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Blood Group:</Text>
          <Text style={styles.detail}>{studentDetails.bloodGroup || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Father's Name:</Text>
          <Text style={styles.detail}>{studentDetails.fathersName || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Mother's Name:</Text>
          <Text style={styles.detail}>{studentDetails.mothersName || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.detail}>{studentDetails.contactNumber || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>E-mail:</Text>
          <Text style={styles.detail}>{studentDetails.email || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.detail}>{studentDetails.residentialAddress || 'N/A'}</Text>
        </View>
        {/* Add more details as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#007bff',
    borderRadius: 60,
    overflow: 'hidden',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  detailsContainer: {
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    padding: 1,
    fontWeight: '500',
  },
  otherDetailsContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#007bff',
    padding: 5,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
    padding: 5,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
});

export default StudentProfile;