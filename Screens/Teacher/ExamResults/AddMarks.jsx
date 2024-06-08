import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Table, Row } from "react-native-table-component";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";

const AddMarks = () => {
  const navigation = useNavigation();
  const handleSaveChanges = () => {
    // Example: Implement save functionality (e.g., send updated data to server)
    console.log("Changes saved!");
    // Add your save logic here...
  };

  const [Classopen, setClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('10th');
  const [classItems, setClassItems] = useState([
    { label: "10th", value: "10th" },
    { label: "9th", value: "9th" },
    { label: "8th", value: "8th" },
    { label: "7th", value: "7th" },
    { label: "6th", value: "6th" },
    { label: "5th", value: "5th" },
    { label: "4th", value: "4th" },
    { label: "3rd", value: "3rd" },
    { label: "2nd", value: "2nd" },
    { label: "1st", value: "1st" },
    { label: "UKG", value: "UKG" },
    { label: "LKG", value: "LKG" },
    { label: "Pre-K", value: "Pre-K" },
  ]);

  const [Sectionopen, setSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('A');
  const [sectionItems, setSectionItems] = useState([
    { label: "Sec-A", value: "A" },
    { label: "Sec-B", value: "B" },
    { label: "Sec-C", value: "C" },
  ]);

  const [ExamResultopen, setExamResultOpen] = useState(false);
  const [selectedExamResult, setSelectedExamResult] = useState("Select Exam");
  const [ExamResultItems, setExamResultItems] = useState([
    { label: "Term-1", value: "Term-1" },
    { label: "Term-2", value: "Term-2" },
    { label: "Term-3", value: "Term-3" },
  ]);

  const [tableData, setTableData] = useState([
    [1, "John Doe", "Male", ""],
    [2, "Jane Smith", "Female", ""],
    [3, "Michael Johnson", "Male", ""],
    [4, "Emily Brown", "Female",""],
    [5, "David Lee", "Male","" ],
    [6, "Sarah Taylor", "Female",""],
    [7, "Chris Evans", "Male",""],
    [8, "Olivia Parker", "Female",""],
    [9, "Samuel Lee", "Male",""],
    [10, "Sophia Adams", "Female",""],
    [11, "Daniel White", "Male",""],
    [12, "Ella Johnson", "Female",""],
    [13, "Matthew Clark", "Male",""],
    [14, "Ava Martin", "Female",""],
    [15, "Ryan Wilson", "Male",""],
    [16, "Grace Anderson", "Female",""],
  ]);

  const tableHead = ["SI no.", "Name", "Gender", "Add Marks"];
  const widthArr = [25, 150, 80, 85];

  const handleRowPress = (rowData) => {
    const [_, studentName, gender] = rowData;
    navigation.navigate("Student Exam Result", {
      studentName,
      gender,
      selectedClass,
      selectedSection,
    });
  };

  const handleMarksChange = (text, rowIndex) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][3] = text;
    setTableData(updatedData);
  };

  return (
    <View style={styles.container}>
    
      <View style={styles.dropdownsContainer}>
        {/* Dropdowns for selecting class, section, and exam */}
        <DropDownPicker
          placeholder="Class"
          open={Classopen}
          value={selectedClass}
          items={classItems}
          setOpen={setClassOpen}
          setValue={setSelectedClass}
          setItems={setClassItems}
          containerStyle={styles.dropdown}
        />
        <DropDownPicker
          placeholder="Section"
          open={Sectionopen}
          value={selectedSection}
          items={sectionItems}
          setOpen={setSectionOpen}
          setValue={setSelectedSection}
          setItems={setSectionItems}
          containerStyle={styles.dropdown}
        />
        <DropDownPicker
          placeholder="Exams"
          open={ExamResultopen}
          value={selectedExamResult}
          items={ExamResultItems}
          setOpen={setExamResultOpen}
          setValue={setSelectedExamResult}
          setItems={setExamResultItems}
          containerStyle={styles.dropdown}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Connected on: 12-Jan-2024</Text>
      </View>
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderColor: "#C10036" }}>
            {/* Render table header */}
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.text}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table>
              {/* Render table rows with input for Add Marks column */}
              {tableData.map((rowData, rowIndex) => (
                  <Row
                    data={rowData.map((cellData, cellIndex) => {
                      if (cellIndex === 3) {
                        // Render TextInput for Add Marks column
                        return (
                          <TextInput
                            style={styles.input}
                            value={cellData}
                            onChangeText={(text) => handleMarksChange(text, rowIndex)}
                            keyboardType="numeric"
                          />
                        );
                      } else {
                        // Render regular text for other columns
                        return (
                          <Text style={styles.cellText}>{cellData}</Text>
                        );
                      }
                    })}
                    widthArr={widthArr}
                    style={{
                      ...styles.row,
                      backgroundColor: rowIndex % 2 === 1 ? "#eff0f2" : "",
                    }}
                  />
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
      <View style={styles.statsContainer}>
        <View >
        <TouchableOpacity
            style={styles.saveButton1}
            onPress={ () => {navigation.navigate("Exam Result")}}
          >
            <Text style={styles.buttonText}>All Results</Text>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  dropdownsContainer: {
    flexDirection: "row",
    marginBottom:20, 
  },
  dropdown: {
    flex: 1,
    height: 40,
    marginHorizontal: 5,
  },
  textContainer: {
    alignItems: "right",
    padding: 15,
    paddingLeft: 2,
    paddingRight: 2,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    textAlign: "center",
    fontWeight: "500",
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#C1C0B9",
    borderRadius: 8,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  header: { height: 40, backgroundColor: "#b8ebe0", borderBottomWidth: 1 },
  dataWrapper: { marginTop: -1 },
  row: { height: 40 },
  cellText: { textAlign: "center", fontWeight: "500", paddingVertical: 10 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  saveButton1: {
    backgroundColor: "#0000dd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
  },
});

export default AddMarks;