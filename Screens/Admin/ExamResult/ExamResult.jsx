import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Table, Row } from "react-native-table-component";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
const { width } = Dimensions.get("window");


const HomeworkScreen = () => {
  const navigation = useNavigation();

  const [Classopen, setClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('10th Class');
  const [classItems, setClassItems] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testNames, setTestNames] = useState([]);
  const [selectedTestName, setSelectedTestName] = useState("");

  const [Sectionopen, setSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState();
  const [sectionItems, setSectionItems] = useState([]);

  const [ExamResultopen, setExamResultOpen] = useState(false);
  const [selectedExamResult, setSelectedExamResult] = useState("");
  const [ExamResultItems, setExamResultItems] = useState([]);
  const [firstDate, setFirstDate] = useState(null);
  const [lastDate, setLastDate] = useState(null);

  const [tableData, setTableData] = useState([]);

  const tableHead = ["SI no.", "Name", "Gender", "Grade", "Obtain Marks", "Max Marks"];
  const widthArr = [
    width * 0.12, 
    width * 0.35,
    width * 0.15,
    width * 0.15,
    width * 0.2,
    width * 0.2,
  ];

  // Allowed test names
  const allowedTestNames = [
    "Class Test",
    "FORMATIVE ASSESSMENT - I",
    "FORMATIVE ASSESSMENT - II",
    "SUMMATIVE ASSESSMENT - I",
    "FORMATIVE ASSESSMENT - III",
    "FORMATIVE ASSESSMENT - IV",
    "SUMMATIVE ASSESSMENT - II",
    "SUMMATIVE ASSESSMENT - III",
  ];

  const handleRowPress = (rowData) => {
    const [_, studentName, gender] = rowData;

    navigation.navigate("Student Exam Result", {
      studentName,
      gender,
      selectedClass,
      selectedSection,
      selectedTestName,
    });
  };

  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching class options:", error);
      }
    };

    fetchClassOptions();
  }, []);

  useEffect(() => {
    const fetchSectionOptions = async () => {
      try {
        setLoading(true);
        let url = `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/${selectedClass}.json`;

        const response = await axios.get(url);
        const data = response.data;

        if (data) {
          const sections = Object.keys(data).map((section) => ({
            label: `${section}`,
            value: section,
          }));
          setSectionItems(sections);
          setSelectedSection(sections[0]?.value || "A");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching section options:", error);
      }
    };

    if (selectedClass) {
      fetchSectionOptions();
    }
  }, [selectedClass, dataArray]);

  useEffect(() => {
    const fetchExamDataOnLoad = async () => {
      try {
        const response = await fetch(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/ExamSchedule/${selectedClass}.json`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data) {
          const names = Object.keys(data)
            .filter((examName) => allowedTestNames.includes(examName)) // Filter by allowed test names
            .map((examName) => ({
              label: examName,
              value: examName,
            }));
          setExamResultItems(names);

          // Select the first test by default if test names are available
          if (names.length > 0) {
            setSelectedExamResult(names[0].value);
          }
        } else {
          setExamResultItems([]);
          setSelectedExamResult("");
        }
      } catch (error) {
        console.error("Error fetching test names:", error);
        setExamResultItems([]);
        setSelectedExamResult("");
      }
    };

    fetchExamDataOnLoad();
  }, [selectedClass]);

  useEffect(() => {
    const fetchTestNames = async () => {
      try {
        const response = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/ExamMarks/${selectedClass}/${selectedSection}.json`
        );
        const data = response.data || {};
        const testNames = Object.keys(data).filter((name) =>
          allowedTestNames.includes(name)
        ); // Filter by allowed test names
        setTestNames(testNames);
        setSelectedTestName(testNames[0] || "");
      } catch (error) {
        console.error("Error fetching test names:", error);
      }
    };

    if (selectedSection) {
      fetchTestNames();
    }
  }, [selectedClass, selectedSection]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/ExamMarks/${selectedClass}/${selectedSection}/${selectedExamResult}.json`
        );
        const conductedOnData = response.data?.conductedOn || {};
        setFirstDate(conductedOnData.firstDate);
        setLastDate(conductedOnData.lastDate);

        const marksData = response.data?.studentResults || {};
        const studentResultsArray = Object.entries(marksData).map(
          ([name, result], index) => {
            return {
              SINo: index + 1,
              Name: name,
              Gender: result.gender,
              Grade: result.grade,
              "Obtain Marks": result.obtainMarks,
              "Max Marks": result.totalMarks,
            };
          }
        );
        setTableData(studentResultsArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (selectedClass && selectedSection && selectedExamResult) {
      fetchData();
    }
  }, [selectedClass, selectedSection, selectedExamResult]);

  return (
    <View style={styles.container}>
      <View style={styles.dropdownsContainer}>
        {/* Dropdown for selecting class */}
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

        {/* Dropdown for selecting section */}
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

        {/* Dropdown for selecting exams */}
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

      <ScrollView horizontal>
        <View>
          <Table borderStyle={styles.tableBorder}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.text}
            />
          </Table>
          <ScrollView>
            <Table borderStyle={styles.tableBorder}>
              {tableData.map((rowData, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleRowPress(Object.values(rowData))}
                >
                  <Row
                    data={Object.values(rowData)}
                    widthArr={widthArr}
                    style={[
                      styles.row,
                      index % 2 && { backgroundColor: "#F7F6E7" },
                    ]}
                    textStyle={styles.text}
                  />
                </TouchableOpacity>
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 105,
    backgroundColor: "#fff",
  },
  dropdownsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dropdown: {
    flex: 1,
    height: 40,
    marginHorizontal: 5,
  },
  item: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingLeft: 2,
    paddingRight: 2,
    backgroundColor: "#fff",
  },
  text: {
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  header: { height: 40, backgroundColor: "#b8ebe0", borderBottomWidth: 1 },
  text: { textAlign: "center", fontWeight: "900" },
  dataWrapper: { marginTop: -1 },
  row: { height: 40 },
  cellText: { textAlign: "center", fontWeight: "500", paddingVertical: 10 },
});

export default HomeworkScreen;
