import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

const StudentProfile = ({ route }) => {
  const { studentDetails = { ...route.params }, index = 0 } =
    route.params || {};

  useEffect(() => {
    console.log(studentDetails);
  }, [studentDetails]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: studentDetails.photo  }} // Replace with actual image URI
              style={styles.profileImage}
            />
          </View>

          {/* Student Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>
              Student Name: {studentDetails.surname || "N/A"}{" "}
              {studentDetails.name || "N/A"}
            </Text>
            <Text style={styles.detailText}>
              Gender: {studentDetails.gender || "N/A"}
            </Text>
            <Text style={styles.detailText}>
              Class: {studentDetails.selectedClass || "N/A"}
            </Text>
            <Text style={styles.detailText}>
              Section: {studentDetails.selectedSection || "N/A"}
            </Text>
            <Text style={styles.detailText}>Roll Number: {index + 1}</Text>
          </View>
        </View>

        {/* Other Details */}
        <View style={styles.otherDetailsContainer}>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Form Number:</Text>{" "}
            {studentDetails.formNo || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Admission Number:</Text>{" "}
            {studentDetails.admissionNumber || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Date of Birth:</Text>{" "}
            {studentDetails.dob || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Blood Group:</Text>{" "}
            {studentDetails.bloodGroup || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Aadhar Card No:</Text>{" "}
            {studentDetails.aadharCardNo || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Father's Name:</Text>{" "}
            {studentDetails.fathersName || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Father's Mobile:</Text>{" "}
            {studentDetails.fathersMobileNumber || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Father's Aadhar Card No:</Text>{" "}
            {studentDetails.fathersAadharCardNo || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Father's Occupation:</Text>{" "}
            {studentDetails.fathersOccupation || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Mother's Name:</Text>
            {studentDetails.mothersSurname || "N/A"}{" "}
            {studentDetails.mothersName || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Mother's Mobile:</Text>{" "}
            {studentDetails.mothersMobileNumber || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Mother's Aadhar Card No:</Text>{" "}
            {studentDetails.mothersAadharCardNo || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Mother's Occupation:</Text>{" "}
            {studentDetails.mothersOccupation || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Guardian's Name:</Text>{" "}
            {studentDetails.guardianName || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Guardian's Mobile:</Text>{" "}
            {studentDetails.guardianMobileNumber || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Academic Year:</Text>{" "}
            {studentDetails.academicYear || "N/A"}
          </Text>

          <Text style={styles.detailRow}>
            <Text style={styles.label}>Caste:</Text>{" "}
            {studentDetails.caste || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Category:</Text>{" "}
            {studentDetails.category || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Date of Issue:</Text>{" "}
            {studentDetails.dateOfIssue || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Identification Marks:</Text>{" "}
            {studentDetails.identificationMarks || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Last School Name:</Text>{" "}
            {studentDetails.lastSchoolName || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Mother Tongue:</Text>{" "}
            {studentDetails.motherTongue || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Permanent Education Number:</Text>{" "}
            {studentDetails.permanentEducationNumber || "N/A"}
          </Text>

          <Text style={styles.detailRow}>
            <Text style={styles.label}>Ration Card Number:</Text>{" "}
            {studentDetails.rationCardNumber || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Record Sheet or TC Number:</Text>{" "}
            {studentDetails.recordSheetOrTcNumber || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Religion:</Text>{" "}
            {studentDetails.religion || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>City:</Text>{" "}
            {studentDetails.city || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>State:</Text>{" "}
            {studentDetails.state || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Pincode:</Text>{" "}
            {studentDetails.pincode || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Residential Address:</Text>{" "}
            {studentDetails.residentialAddress || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Scholarship Details:</Text>{" "}
            {studentDetails.scholarshipDetails || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Previous Class Percentage:</Text>{" "}
            {studentDetails.previousClassPercentage || "N/A"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>
              Previous School Record Sheet Number:
            </Text>{" "}
            {studentDetails.previousSchoolRecordSheetNumber || "N/A"}
          </Text>
          {/* Enclosures */}
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Aadhar(copy):</Text>{" "}
            {studentDetails.enclosures?.aadhar ? "Yes" : "No"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Birth Certificate(copy):</Text>{" "}
            {studentDetails.enclosures?.birthCertificate ? "Yes" : "No"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Caste Certificate(copy):</Text>{" "}
            {studentDetails.enclosures?.casteCertificate ? "Yes" : "No"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Mother's Bank Passbook(copy):</Text>{" "}
            {studentDetails.enclosures?.mothersBankPassbook ? "Yes" : "No"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Progress Report(copy):</Text>{" "}
            {studentDetails.enclosures?.progressReport ? "Yes" : "No"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Ration Card(copy):</Text>{" "}
            {studentDetails.enclosures?.rationCard ? "Yes" : "No"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>TC/RC Study Certificate(copy):</Text>{" "}
            {studentDetails.enclosures?.tcRcStudyCertificate ? "Yes" : "No"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageContainer: {
    marginRight: 20,
    borderWidth: 3,
    borderColor: "#007bff",
    borderRadius: 60,
    overflow: "hidden",
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
    fontWeight: "500",
  },
  otherDetailsContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#007bff",
  },
  detailRow: {
    fontSize: 16,
    marginBottom: 10,
    padding: 5,
  },
});

export default StudentProfile;
