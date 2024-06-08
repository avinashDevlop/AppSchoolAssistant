import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Platform, Button, ActivityIndicator } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeworkScreen = () => {
  const [Classopen, setClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('10th Class');
  const [classItems, setClassItems] = useState([]);
  const [Sectionopen, setSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState();
  const [sectionItems, setSectionItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [newDate, setNewDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newSyllabus, setNewSyllabus] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [homeworkData, setHomeworkData] = useState([]);
  const [deletingHomeworkId, setDeletingHomeworkId] = useState(null); // New state for tracking deletion

  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms.json"
        );
        const data = response.data || {};

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
        const data = response.data || {};

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
    const fetchHomeworkEntries = async () => {
      try {
        setLoading(true);
        const url = `https://studentassistant-18fdd-default-rtdb.firebaseio.com/homework/${selectedClass}/${selectedSection}.json`;
        const response = await axios.get(url);
        const data = response.data || {};

        if (data) {
          const homeworkArray = Object.values(data).flatMap((dateObj) => 
            Object.values(dateObj).map((homework) => ({
              ...homework,
              class: selectedClass,
              section: selectedSection,
            }))
          );
          setHomeworkData(homeworkArray);
        } else {
          setHomeworkData([]);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching homework entries:", error);
      }
    };

    if (selectedClass && selectedSection) {
      fetchHomeworkEntries();
    }
  }, [selectedClass, selectedSection]);

  const handleAddHomework = async () => {
    const homeworkId = uuid.v4();
    const homeworkEntry = {
      id: homeworkId,
      date: formatDate(newDate),
      subject: newSubject,
      syllabus: newSyllabus,
      description: newDescription,
    };

    try {
      await axios.put(
        `https://studentassistant-18fdd-default-rtdb.firebaseio.com/homework/${selectedClass}/${selectedSection}/${homeworkEntry.date}/${homeworkId}.json`,
        homeworkEntry
      );
      // Update local state to reflect the new homework entry
      setHomeworkData([...homeworkData, { ...homeworkEntry, class: selectedClass, section: selectedSection }]);
      // console.log("Homework entry added successfully");
    } catch (error) {
      console.error("Error adding homework entry:", error);
    }
  };

  const handleDeleteHomework = async (homeworkId, date) => {
    // Optimistically update the UI
    const updatedHomeworkData = homeworkData.filter((item) => item.id !== homeworkId);
    setHomeworkData(updatedHomeworkData);
    setDeletingHomeworkId(homeworkId);

    try {
      await axios.delete(
        `https://studentassistant-18fdd-default-rtdb.firebaseio.com/homework/${selectedClass}/${selectedSection}/${date}/${homeworkId}.json`
      );
      // console.log("Homework entry deleted successfully");
    } catch (error) {
      // Revert the optimistic update if there's an error
      setHomeworkData([...updatedHomeworkData, homeworkData.find((item) => item.id === homeworkId)]);
      console.error("Error deleting homework entry:", error);
    } finally {
      setDeletingHomeworkId(null); // Reset the deletingHomeworkId state
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newDate;
    setShowDatePicker(Platform.OS === 'ios');
    setNewDate(currentDate);
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero indexed
    const year = date.getFullYear();
    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  };

  const renderHomeworkItem = ({ item }) => (
    <View style={styles.item}>
      {deletingHomeworkId === item.id ? (
        <ActivityIndicator size="small" color="red" style={styles.deleteButton} />
      ) : (
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteHomework(item.id, item.date)}>
          <Icon name="delete" size={35} color="red"/>
        </TouchableOpacity>
      )}
      <Text style={styles.detail}>{`Date: ${item.date}`}</Text>
      <Text style={styles.detail}>{`${item.class} , ${item.section}`}</Text>
      <Text style={styles.detail}>{`Subject: ${item.subject}`}</Text>
      <Text style={styles.detail}>{`Syllabus: ${item.syllabus}`}</Text>
      <Text style={styles.detail}>{`Description: ${item.description}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.dropdownsContainer}>
        {/* Class dropdown */}
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

        {/* Section dropdown */}
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

      {/* Date picker */}
      <View style={styles.datePickerContainer}>
        <Button onPress={showDatepicker} title="Select Date" />
        {showDatePicker && (
          <DateTimePicker
            value={newDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            style={styles.datePicker}
          />
        )}
        <Text style={styles.selectedDate}>{`Selected Date: ${formatDate(newDate)}`}</Text>
      </View>

      {/* Text input fields for adding new homework */}
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={newSubject}
        onChangeText={setNewSubject}
      />
      <TextInput
        style={styles.input}
        placeholder="Syllabus"
        value={newSyllabus}
        onChangeText={setNewSyllabus}
      />
      <TextInput
        style={[styles.input, { height: 80 }]} // Adjust height for multiline description
        placeholder="Description"
        multiline
        value={newDescription}
        onChangeText={setNewDescription}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddHomework}>
        <Text style={styles.buttonText}>Add Homework</Text>
      </TouchableOpacity>

      {/* Display homework list */}
      {homeworkData.length === 0 ? (
        <Text style={styles.noHomeworkText}>No Homework Entries</Text>
      ) : (
        <FlatList
          data={homeworkData}
          renderItem={renderHomeworkItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#fff',
  },
  dropdownsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dropdown: {
    flex: 1,
    height: 40,
    marginHorizontal: 2,
  },
  datePickerContainer: {
    marginBottom: 10,
    alignItems: 'center', 
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    position: 'relative', // Ensure absolute positioning of the delete button
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  listContainer: {
    flexGrow: 1,
    marginTop: 20,
  },
  datePicker: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    marginVertical: 10,
  },
  selectedDate: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  noHomeworkText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeworkScreen;