import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Switch,
  TouchableOpacity,
  Alert, Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Table, Row } from "react-native-table-component";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";

const AttendancePage = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;

  const [Classopen, setClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("10th Class");
  const [classItems, setClassItems] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [Sectionopen, setSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState();
  const [sectionItems, setSectionItems] = useState([]);
  const [dataArray, setDataArray] = useState([]);

  const [studentData, setStudentData] = useState([]);
  const [currentDate, setCurrentDate] = useState("");


  useEffect(() => {
    const now = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDay = days[now.getDay()];
    const date = now.getDate();
    const month = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();
    setCurrentDate(`${currentDay}, ${month} ${date}, ${year}`);
  }, []);

  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        const response = await axios.get(
          "https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms.json"
        );
        const data = response.data;

        const dataArray = Object.entries(data).map(([value, label]) => ({
          value,
          label,
        }));
        setDataArray(dataArray);

        if (data) {
          const options = [
            { value: "10th Class", label: "10th Class" },
            { value: "9th Class", label: "9th Class" },
            { value: "8th Class", label: "8th Class" },
            { value: "7th Class", label: "7th Class" },
            { value: "6th Class", label: "6th Class" },
            { value: "5th Class", label: "5th Class" },
            { value: "4th Class", label: "4th Class" },
            { value: "3rd Class", label: "3rd Class" },
            { value: "2nd Class", label: "2nd Class" },
            { value: "1st Class", label: "1st Class" },
            { value: "UKG", label: "UKG" },
            { value: "LKG", label: "LKG" },
            { value: "Pre-K", label: "Pre-K" },
          ];
          setClassItems(options);
        }
      } catch (error) {
        console.error("Error fetching class options:", error);
      }
    };

    fetchClassOptions();
  }, []);

  useEffect(() => {
    const fetchSectionOptions = async () => {
      try {
        const response = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/${selectedClass}.json`
        );
        const data = response.data;

        if (data) {
          const sections = Object.keys(data).map((section) => ({
            label: `${section}`,
            value: section,
          }));
          setSectionItems(sections);
          setSelectedSection(sections[0]?.value || "A");
        }
      } catch (error) {
        console.error("Error fetching section options:", error);
      }
    };

    if (selectedClass) {
      fetchSectionOptions();
    }
  }, [selectedClass, dataArray]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const now = new Date();
        const month = now.toLocaleString("default", { month: "long" }).toLowerCase();
        const date = now.getDate();
  
        const response = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/${selectedClass}/${selectedSection}.json`
        );
        const data = response.data;
  
        const formattedData = data && typeof data === 'object'
          ? await Promise.all(Object.values(data).map(async (student, index) => {
              let attendance = false;
              try {
                const attendanceResponse = await axios.get(
                  `https://studentassistant-18fdd-default-rtdb.firebaseio.com/Attendance/StudAttendance/${selectedClass}/${selectedSection}/${month}/${month}_${date}/present.json`
                );
                const presentData = attendanceResponse.data ? Object.values(attendanceResponse.data) : [];
                attendance = presentData.includes(`${student.surname} ${student.name}`);
              } catch (attendanceError) {
                console.error("Error fetching attendance data:", attendanceError);
              }
  
              return [
                index + 1,
                `${student.surname} ${student.name}`,
                student.gender,
                attendance,
              ];
            }))
          : [];
  
        setStudentData(formattedData);
        setIsDataLoaded(true); // Mark data as loaded once fetched
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
  
    if (selectedClass && selectedSection) {
      fetchStudentData();
    }
  }, [selectedClass, selectedSection, dataArray]);
  

  const handleToggleAttendanceInTable = (index) => {
    const newData = [...studentData];
    newData[index][3] = !newData[index][3];
    setStudentData(newData);
  };

  const handleViewPress = async () => {
    if (!isDataLoaded) return; // Prevent navigation if data is not loaded
  
    try {
      const now = new Date();
      const month = now.toLocaleString("default", { month: "long" }).toLowerCase();
      const date = now.getDate();
  
      const presentResponse = await axios.get(
        `https://studentassistant-18fdd-default-rtdb.firebaseio.com/Attendance/StudAttendance/${selectedClass}/${selectedSection}/${month}/${month}_${date}/present.json`
      );
      const absentResponse = await axios.get(
        `https://studentassistant-18fdd-default-rtdb.firebaseio.com/Attendance/StudAttendance/${selectedClass}/${selectedSection}/${month}/${month}_${date}/absent.json`
      );
  
      const presentData = presentResponse.data ? Object.values(presentResponse.data) : [];
      const absentData = absentResponse.data ? Object.values(absentResponse.data) : [];
      const present = presentData.length;
      const absent = absentData.length;
  
      const sectionMap = {
        "Section A": "A",
        "Section B": "B",
        "Section C": "C",
      };
      const mappedSection = sectionMap[selectedSection] || "C";
  
      navigation.navigate("Class Wise Attendance", {
        className: selectedClass,
        section: mappedSection,
        present,
        absent,
        presentData,
        absentData,
      });
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

    const tableHead = ["SI no.", "Name", "Gender", "Attendance"];
    const widthArr = [screenWidth * 0.15, screenWidth * 0.4, screenWidth * 0.2, screenWidth * 0.25];

    const handleSaveChanges = async () => {
      try {
        const now = new Date();
        const month = now
          .toLocaleString("default", { month: "long" })
          .toLowerCase();
        const date = now.getDate();
        const presentStudentsData = studentData.filter((student) => student[3]);
        const absentStudentsData = studentData.filter((student) => !student[3]);
        const attendanceData = {
        

  present: presentStudentsData.map((student) => `${student[1]}`),
          absent: absentStudentsData.map((student) => `${student[1]}`),
        };

        Alert.alert(
          "Submit Attendance",
          `Are you sure you want to submit the attendance?\nPresent: ${presentStudentsData.length}, Absent: ${absentStudentsData.length}`,
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Submit",
              onPress: async () => {
                try {
                  await axios.put(
                    `https://studentassistant-18fdd-default-rtdb.firebaseio.com/Attendance/StudAttendance/${selectedClass}/${selectedSection}/${month}/${month}_${date}.json`,
                    attendanceData
                  );
                  Alert.alert("Success", "Attendance submitted successfully.");
                } catch (error) {
                  Alert.alert("Error", "Failed to submit attendance.");
                  console.error("Error submitting attendance:", error);
                }
              },
            },
          ]
        );
      } catch (error) {
        console.error("Error in submitRegularAttendanceToDatabase:", error);
      }
    };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownsContainer}>
        <DropDownPicker
          placeholder="Select Class"
          open={Classopen}
          value={selectedClass}
          items={classItems}
          setOpen={setClassOpen}
          setValue={setSelectedClass}
          setItems={setClassItems}
          containerStyle={styles.dropdown}
        />

        <DropDownPicker
          placeholder="Select Section"
          open={Sectionopen}
          value={selectedSection}
          items={sectionItems}
          setOpen={setSectionOpen}
          setValue={setSelectedSection}
          setItems={setSectionItems}
          containerStyle={styles.dropdown}
        />
      </View>
      <View style={styles.dateContainer}>
        <View>
        <Text style={styles.currentDate}>{currentDate}</Text>
        </View>
        <View>
        <TouchableOpacity style={styles.viewButton} onPress={handleViewPress} disabled={!isDataLoaded}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
        </View>
      </View>
      <View style={styles.containerTable}>
        <ScrollView horizontal={true}>
          <View>
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
                {studentData.map((rowData, rowIndex) => (
                  <Row
                    key={rowIndex}
                    data={rowData.map((cellData, cellIndex) => {
                      if (cellIndex === 3) {
                        return (
                          <View style={styles.switchContainer} key={cellIndex}>
                            <Switch
                              trackColor={{ false: "#fd1717", true: "#2f9c09" }}
                              thumbColor="#fff"
                              value={cellData}
                              onValueChange={() =>
                                handleToggleAttendanceInTable(rowIndex)
                              }
                            />
                          </View>
                        );
                      }
                      return cellData ? cellData.toString() : ""; // Ensure cellData is defined before calling toString
                    })}
                    widthArr={widthArr}
                    style={[
                      styles.row,
                      rowIndex % 2 === 1
                        ? { backgroundColor: "#eff0f2" }
                        : null,
                    ]}
                    textStyle={styles.cellText}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
        <View style={styles.statsContainer}>
          <View style={styles.statsContainer2}>
            <Text style={styles.statsText}>
              Present: {studentData.filter((row) => row[3]).length}
            </Text>
            <Text style={styles.statsText}>
              Absent: {studentData.filter((row) => !row[3]).length}
            </Text>
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
    </View>
  );
};

export default AttendancePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8FF",
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 5,
  },
  currentDate: {
    fontSize: 16,
  },
  viewButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "bold",
    paddingHorizontal: 16,
  },
  dropdownsContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  dropdown: {
    flex: 1,
    height: 40,
    marginHorizontal: 5,
  },
  studentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  studentName: {
    fontSize: 16,
  },
  containerTable: { flex: 1, paddingBottom: 5, backgroundColor: "#fff" },
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
    paddingHorizontal: 22,
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
    paddingHorizontal: 30,
    borderRadius: 5,
    alignSelf: "flex-end",
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