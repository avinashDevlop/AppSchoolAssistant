import React, { useState, useEffect, useCallback  } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { Alert, ActivityIndicator } from "react-native";

const AddMarks = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // Dropdown states
  const [Classopen, setClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("10th Class");
  const [classItems, setClassItems] = useState([]);

  const [Sectionopen, setSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("A");
  const [sectionItems, setSectionItems] = useState([]);

  const [ExamResultopen, setExamResultOpen] = useState(false);
  const [selectedExamResult, setSelectedExamResult] = useState("Select Exam");
  const [ExamResultItems, setExamResultItems] = useState([]);

  const [firstDate, setFirstDate] = useState(null);
  const [lastDate, setLastDate] = useState(null);
  const [subMaxMarks, setSubMaxMarks] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [maxMarks, setmaxMarks] = useState(0);
  const [studentsData, setStudentsData] = useState([]);

  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
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
          setSelectedSection(sections[0]?.value || "");
        } else {
          // Clear section dropdown if no data is available
          setSectionItems([]);
          setSelectedSection("");
        }
      } catch (error) {
        console.error("Error fetching section options:", error);
        // Clear section dropdown on error
        setSectionItems([]);
        setSelectedSection("");
      }
    };

    if (selectedClass) {
      fetchSectionOptions();
    }
  }, [selectedClass]);

  // Control dropdowns opening/closing
  useEffect(() => {
    if (Classopen) {
      setSectionOpen(false);
      setExamResultOpen(false);
    }
  }, [Classopen]);

  useEffect(() => {
    if (Sectionopen) {
      setClassOpen(false);
      setExamResultOpen(false);
    }
  }, [Sectionopen]);

  useEffect(() => {
    if (ExamResultopen) {
      setClassOpen(false);
      setSectionOpen(false);
    }
  }, [ExamResultopen]);

  // Rest of the state declarations remain the same
  const [testNames, setTestNames] = useState([]);
  const [selectedTestName, setSelectedTestName] = useState("");
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

  const [tableData, setTableData] = useState([]);

  const tableHead = ["SI no.", "Name", "Gender", ...subjects, "Obtain Marks", "Total Marks", "Percentage", "Grade", "Pass/Fail"];
  const widthArr = [40, 100, 80, ...Array(subjects.length).fill(80), 90, 90, 100, 80, 80];
  
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

  // Fetch student names based on selected section
  useEffect(() => {
    const fetchStudentNames = async () => {
      try {
        const response = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/${selectedClass}/${selectedSection}.json`
        );
        const data = response.data || {};

        const students = Object.keys(data).map((studentId, index) => [
          index + 1,
          `${data[studentId].surname} ${data[studentId].name}`,
          data[studentId].gender,
          "",
        ]);

        setTableData(students);
      } catch (error) {
        console.error("Error fetching student names:", error);
        setTableData([]);
      }
    };

    if (selectedSection) {
      fetchStudentNames();
    }
  }, [selectedClass, selectedSection]);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/ExamSchedule/${selectedClass}/${selectedExamResult}.json`
        );
        const data = response.data || {};
        
        if (Object.keys(data).length > 0) {
          const Dates = Object.keys(data);
          const subjects = Dates.map((date) => data[date].subject);
          const subMaxMarksData = {};
          
          Dates.forEach((date) => {
            const subject = data[date].subject;
            const maxMarks = Number(data[date].maxMarks) || 0;
            subMaxMarksData[subject] = maxMarks;
          });
          
          const totalMaxMarks = Object.values(subMaxMarksData).reduce(
            (acc, curr) => acc + curr,
            0
          );
          
          setSubMaxMarks(subMaxMarksData);
          setSubjects(subjects);
          setmaxMarks(totalMaxMarks);
          setFirstDate(Dates[0]);
          setLastDate(Dates[Dates.length - 1]);
        } else {
          setSubjects([]);
          setFirstDate(null);
          setLastDate(null);
          setmaxMarks(0);
          setSubMaxMarks({});
        }
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };
  
    if (selectedClass && selectedExamResult) {
      fetchExamData();
    }
  }, [selectedClass, selectedExamResult]);

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C+";
    if (percentage >= 40) return "C";
    return "F";
  };
    
  const calculateTotalExamPercentage = () => {
    let totalMarks = 0;
    let totalObtainMarks = 0;

    studentsData.forEach(student => {
      totalMarks += parseInt(student.totalMarks) || 0;
      totalObtainMarks += parseInt(student.obtainMarks) || 0;
    });

    return totalMarks ? ((totalObtainMarks / totalMarks) * 100).toFixed(2) : 0;
  };

  const fetchStudentData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/${selectedClass}/${selectedSection}.json`
      );
      const data = response.data || {};
  
      const students = await Promise.all(
        Object.entries(data).map(async ([id, student]) => {
          const marksResponse = await axios.get(
            `https://studentassistant-18fdd-default-rtdb.firebaseio.com/ExamMarks/${selectedClass}/${selectedSection}/${selectedTestName}/studentResults/${id}.json`
          );
          const marksData = marksResponse.data?.subjects || {};
  
          const studentSubjects = subjects.reduce((acc, subj) => ({
            ...acc,
            [subj]: marksData[subj] || ""
          }), {});
  
          const obtainMarks = subjects.reduce(
            (total, subj) => total + (parseInt(studentSubjects[subj]) || 0),
            0
          );
  
          const percentage = maxMarks > 0 ? ((obtainMarks / maxMarks) * 100).toFixed(2) : "";
          const grade = calculateGrade(percentage);
          const passFail = subjects.every((subj) =>
            parseInt(studentSubjects[subj] || 0) >= (maxMarks / subjects.length) * 0.3
          ) ? "Pass" : "Fail";
  
          return {
            id,
            name: student.name,
            gender: student.gender,
            subjects: studentSubjects,
            totalMarks: maxMarks,
            obtainMarks: obtainMarks,
            percentage: percentage,
            grade: grade,
            passFail: passFail
          };
        })
      );
  
      setStudentsData(students);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  }, [selectedClass, selectedSection, selectedTestName, subjects, maxMarks]);
  
  // Use `fetchStudentData` in useEffect directly.
  useEffect(() => {
    if (selectedClass && selectedSection && selectedTestName) {
      fetchStudentData();
    }
  }, [selectedClass, selectedSection, selectedTestName, fetchStudentData]);
  

  const handleSubmitMarks = async () => {
    try {
      if (!selectedClass || !selectedSection || !selectedTestName) {
        Alert.alert("Missing Information", "Please select a class, section, and test name before submitting.");
        return;
      }
  
      const allFieldsFilled = studentsData.every(student =>
        subjects.every(subject => student.subjects[subject] !== "")
      );
  
      if (!allFieldsFilled) {
        Alert.alert("Incomplete Data", "Please fill in all fields before submitting.");
        return;
      }
  
      setLoading(true); // Start loading
      const totalExamPercentage = calculateTotalExamPercentage();
      const gradeCounts = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'F': 0 };
      
      studentsData.forEach(student => {
        const grade = calculateGrade(student.percentage);
        gradeCounts[grade]++;
      });
  
      const dataToSend = {
        conductedOn: { firstDate, lastDate },
        studentResults: {},
        TotalExamPercentage: totalExamPercentage,
        NoOfGrades: gradeCounts
      };
  
      studentsData.forEach(student => {
        dataToSend.studentResults[student.id] = {
          ...student,
          subjectMaxMarks: subMaxMarks,
        };
      });
  
      await axios.put(
        `https://studentassistant-18fdd-default-rtdb.firebaseio.com/ExamMarks/${selectedClass}/${selectedSection}/${selectedTestName}.json`,
        dataToSend
      );
  
      Alert.alert("Success", "Marks submitted successfully!");
      await fetchStudentData(); // Fetch again to get the updated values
    } catch (error) {
      Alert.alert("Submission Failed", "There was an error submitting the marks.");
      console.error("Error submitting marks:", error);
    } finally {
      setLoading(false); // End loading
    }
  };
  
  
  const handleInputChange = (studentIndex, subjectIndex, value, totalMaxMarks ) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[studentIndex][subjectIndex + 3] = value; // +3 to skip initial columns (SI no., Name, Gender)
      return newData;
    });

    const numericValue = value === "" ? "" : parseInt(value, 10);
  
    // Only update if value is valid (empty or non-negative integer)
    if (value === "" || (!isNaN(value) && numericValue >= 0)) {
      setStudentsData((prevData) => {
        return prevData.map((student) => {
          if (student.id === id) {
            const updatedStudent = { ...student };
  
            // Update subjects based on the field
            if (subjects.includes(field)) {
              updatedStudent.subjects[field] = numericValue;
            }
  
            // Calculate obtained marks by summing all subject marks
            const obtainMarks = subjects.reduce(
              (total, subj) => total + (parseInt(updatedStudent.subjects[subj]) || 0),
              0
            );
            updatedStudent.obtainMarks = obtainMarks;
  
            // Set totalMarks to totalMaxMarks
            updatedStudent.totalMarks = maxMarks;
  
            // Calculate percentage if totalMaxMarks is greater than zero
            if (updatedStudent.totalMarks > 0) {
              updatedStudent.percentage = ((obtainMarks / updatedStudent.totalMarks) * 100).toFixed(2);
              updatedStudent.grade = calculateGrade(updatedStudent.percentage);
            }
  
            // Calculate pass/fail based on subject-wise threshold
            const passThreshold = (updatedStudent.totalMarks / subjects.length) * 0.3;
            updatedStudent.passFail = subjects.every((subj) => 
              parseInt(updatedStudent.subjects[subj]) >= passThreshold
            ) ? 'Pass' : 'Fail';
  
            return updatedStudent;
          }
          return student;
        });
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownsContainer}>
        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            placeholder="Class"
            open={Classopen}
            value={selectedClass}
            items={classItems}
            setOpen={setClassOpen}
            setValue={setSelectedClass}
            setItems={setClassItems}
            style={styles.dropdownStyle}
            containerStyle={styles.dropdownContainer}
            zIndex={3000}
          />
        </View>
        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            placeholder="Section"
            open={Sectionopen}
            value={selectedSection}
            items={sectionItems}
            setOpen={setSectionOpen}
            setValue={setSelectedSection}
            setItems={setSectionItems}
            style={styles.dropdownStyle}
          />
        </View>
      </View>

      <View style={styles.examDropdownWrapper}>
        <DropDownPicker
          placeholder="Exams"
          open={ExamResultopen}
          value={selectedExamResult}
          items={ExamResultItems}
          setOpen={setExamResultOpen}
          setValue={setSelectedExamResult}
          setItems={setExamResultItems}
          style={styles.dropdownStyle}
          containerStyle={styles.dropdownContainer}
          zIndex={1000}
          zIndexInverse={3000}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Conducted on :: {firstDate} : {lastDate}{" "}
        </Text>
      </View>

      <ScrollView horizontal>
        <View>
          <Table borderStyle={{ borderColor: "#C10036" }}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.text}
            />
           <Rows
  data={tableData.map((row, studentIndex) => [
    row[0], // SI no.
    row[1], // Name
    row[2], // Gender
    ...subjects.map((subject, subjectIndex) => (
      <TextInput
        key={subject}
        style={styles.input}
        keyboardType="numeric"
        value={row[subjectIndex + 3]} // Subject marks start from 4th column id, field, value, totalMaxMarks
        onChangeText={(value) => handleInputChange(studentIndex, subjectIndex, value, totalMaxMarks)}
      />
    )),
    row.obtainMarks,      // Add obtainMarks column
    row.percentage,       // Add percentage column
    row.grade,            // Add grade column
    row.passFail          // Add passFail column
  ])}
  widthArr={widthArr}
  textStyle={styles.cellText}
/>
          </Table>
        </View>
      </ScrollView>

      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.saveButton1}
          onPress={() => navigation.navigate("Exam Result")}
        >
          <Text style={styles.buttonText}>All Results</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmitMarks}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  dropdownsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dropdownWrapper: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  examDropdownWrapper: {
    marginHorizontal: 5,
    marginBottom: 20,
  },
  dropdownStyle: {
    borderColor: "#C1C0B9",
  },
  dropdownContainer: {
    height: 40,
  },
  textContainer: {
    alignItems: "flex-end",
    padding: 15,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#C1C0B9",
    borderRadius: 8,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    height: 40,
    backgroundColor: "#b8ebe0",
    borderBottomWidth: 1,
  },
  dataWrapper: {
    marginTop: -1,
  },
  row: {
    height: 40,
  },
  cellText: {
    textAlign: "center",
    paddingVertical: 10,
  },
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
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
  },
});

export default AddMarks;
