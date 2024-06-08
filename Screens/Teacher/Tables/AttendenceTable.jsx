import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Table, Row } from "react-native-table-component";
import { useNavigation } from "@react-navigation/native";

const ExampleThree = () => {
  const navigation = useNavigation();
  const handleSaveChanges = () => {
    // Example: Implement save functionality (e.g., send updated data to server)
    console.log("Changes saved!");
    // Add your save logic here...
  };
  const [tableData, setTableData] = useState([
    [1, "John Doe", "Male", true],
    [2, "Jane Smith", "Female", false],
    [3, "Michael Johnson", "Male", true],
    [4, "Emily Brown", "Female", false],
    [5, "Chris Lee", "Male", true],
    [6, "Sarah Johnson", "Female", true],
    [7, "David Williams", "Male", false],
    [8, "Jessica Garcia", "Female", true],
    [9, "Daniel Miller", "Male", true],
    [10, "Olivia Martinez", "Female", false],
    [11, "James Taylor", "Male", true],
    [12, "Sophia Anderson", "Female", true],
    [13, "Matthew Davis", "Male", false],
    [14, "Ava Wilson", "Female", true],
    [15, "Andrew Thompson", "Male", true],
    [16, "Emma Clark", "Female", false],
    [17, "Ryan Moore", "Male", true],
    [18, "Grace White", "Female", true],
    [19, "Benjamin Harris", "Male", false],
    [20, "Lily Brown", "Female", false],
  ]);

  const tableHead = ["SI no.", "Name", "Gender", "Attendance"];
  const widthArr = [50, 120, 80, 90];

  const handleToggleAttendance = (index) => {
    const newData = [...tableData];
    newData[index][3] = !newData[index][3]; // Toggle attendance (true/false)
    setTableData(newData);
  };

  const handleRowPress = (rowData) => {
    const [classInfo, sectionInfo, present, absent] = rowData;
    navigation.navigate('Class Wise Attendance', { classInfo, sectionInfo, present, absent });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View style={styles.table}>
          <Table borderStyle={{ borderColor: "#C10036" }}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.headerText}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table>
              {tableData.map((rowData, rowIndex) => (
                <TouchableOpacity key={rowIndex} onPress={() => handleRowPress(rowData)}>
                <Row
                  key={rowIndex}
                  data={rowData.map((cellData, cellIndex) => {
                    if (cellIndex === 3) {
                      return (
                        <View style={styles.switchContainer}>
                          <Switch
                            trackColor={{ false: "#fd1717", true: "#2f9c09" }}
                            thumbColor="#fff"
                            value={cellData}
                            onValueChange={() =>
                              handleToggleAttendance(rowIndex)
                            }
                          />
                        </View>
                      );
                    }
                    return cellData.toString(); // Ensure cellData is rendered as string
                  })}
                  widthArr={widthArr}
                  style={[
                    styles.row,
                    rowIndex % 2 === 1 ? { backgroundColor: "#eff0f2" } : null,
                  ]}
                  textStyle={styles.cellText}
                />
                </TouchableOpacity>
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
      <View style={styles.statsContainer}>
        <View style={styles.statsContainer2}>
          <Text style={styles.statsText}>Present: 15</Text>
          <Text style={styles.statsText}>Absent: 5</Text>
        </View>
        <View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 88, backgroundColor: "#fff" },
  header: { height: 40, backgroundColor: "#b8ebe0", borderBottomWidth: 1 },
  dataWrapper: { marginTop: -1 },
  cellText: { textAlign: "center", fontWeight: "500", paddingVertical: 10 },
  headerText: {
    textAlign: "center",
    fontWeight: "900",
  },
  row: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#C10036",
  },
  switchContainer: {
    paddingHorizontal: 22, // Add padding around the Switch component
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  statsContainer2: {
    flexDirection: "row",
  },
  statsText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
  },
  table: {
    paddingBottom: 20,
  },
});

export default ExampleThree;
