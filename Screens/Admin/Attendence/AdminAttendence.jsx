import React from "react";
import { StyleSheet, View, Text } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import AttendenceTable from "../Tables/AttendenceTable";

const AttendancePage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.itemContainer}>
          <FontAwesomeIcon name="child" size={42} color="#0c46c4" />
          <View style={styles.textContainer}> 
            <Text style={styles.titleText}>Student</Text>
            <Text style={styles.subText}>
              <Text style={styles.greenText}>200</Text>
              <Text style={styles.redText}>/300</Text>
            </Text>
          </View>
        </View>
        <View style={styles.itemContainer}>
          <FontAwesomeIcon name="graduation-cap" size={30} color="#f25f38" />
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>Teacher</Text>
            <Text style={styles.subText}>
              <Text style={styles.greenText}>20</Text>
              <Text style={styles.redText}>/30</Text>
            </Text>
          </View>
        </View>
      </View>
      <View>
        <AttendenceTable textStyle={styles.attendanceText} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8FF",
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
  },
  headerButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    width: "48%", // Adjust width to fit two items in a row
  },
  textContainer: {
    marginLeft: 20,
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#0c46c4",
  },
  subText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "600",
  },
  greenText: {
    color: "green",
    fontWeight: "700",
  },
  redText: {
    color: "#303972",
  },
  studentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  attendanceText: {
    color: "#000",
    fontSize: 16, 
  },
});

export default AttendancePage;
