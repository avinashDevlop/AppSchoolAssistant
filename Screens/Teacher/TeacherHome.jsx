import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const TeacherHome = ({ navigation, route }) => {
  const { name } = route.params || {};

  const handleLogout = () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => navigation.navigate("School Assistant"),
        },
      ],
      { cancelable: false }
    );
  };

  const features = [
    { destination: "TeacherAttendance", name: "Attendance", iconName: "event-note" },
    { destination: "TeacherHomework", name: "Home Work", iconName: "assignment" },
    { destination: "AdminExamSchedule", name: "Exam Schedule", iconName: "event" },
    // { destination: "TeacherAddMarks", name: "Add Marks", iconName: "school" },
    { destination: "Exam Result", name: "Exam Results", iconName: "school" },
    { destination: "Student Time Table", name: "Time Table", iconName: "schedule" },
    { destination: "TeacherStudentDetails", name: "Student Details", iconName: "people" },
    { destination: "TeacherChat", name: "Chat", iconName: "chat" },
    { destination: "AdminGallery", name: "Gallery", iconName: "photo-library" },
    { destination: "Notice", name: "Notice", iconName: "announcement" },
    // { destination: "RealTeacherAttendance", name: "My Attendence", iconName: "event-available" },
  ];

  const FeatureItem = ({ destination, name, iconName }) => (
    <TouchableOpacity
      style={styles.featureItem}
      onPress={() => navigation.navigate(destination)}
    >
      <Icon name={iconName} size={60} color="#007bff" />
      <Text style={styles.featureName}>{name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.adminName}>
          <Icon name="school" size={35} color="#007bff" style={styles.icon} />
          <Text style={styles.title}>{name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButtonTitle}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              destination={feature.destination}
              name={feature.name}
              iconName={feature.iconName}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "black",
    paddingBottom: 10,
  },
  adminName: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutButtonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  featureItem: {
    alignItems: "center",
    marginBottom: 20,
    width: "48%",
  },
  featureName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    margin: "9%",
  },
});

export default TeacherHome;
