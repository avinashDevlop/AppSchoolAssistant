import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';

const HomeworkScreen = () => {
  const [Classopen, setClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('AllClass');
  const [classItems, setClassItems] = useState([
    { label: 'All Classes', value: 'AllClass' },
  ]);

  const [Sectionopen, setSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('AllSections');
  const [sectionItems, setSectionItems] = useState([
    { label: 'All Sections', value: 'AllSections' },
  ]);

  const [loading, setLoading] = useState(false);
  const [homeworkData, setHomeworkData] = useState([]);

  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms.json"
        );
        const data = response.data;

        if (data) {
          setClassItems([
            { label: 'All Classes', value: 'AllClass' },
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
          ]);
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
      if (selectedClass === 'AllClass') {
        setSectionItems([{ label: 'All Sections', value: 'AllSections' }]);
        setSelectedSection('AllSections');
        return;
      }

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
          setSectionItems([{ label: 'All Sections', value: 'AllSections' }, ...sections]);
          setSelectedSection('AllSections');
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
  }, [selectedClass]);

  useEffect(() => {
    const fetchAllHomework = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://studentassistant-18fdd-default-rtdb.firebaseio.com/homework.json');
        const data = response.data;

        const allHomeworkArray = [];
        for (const [classKey, sections] of Object.entries(data)) {
          for (const [sectionKey, dates] of Object.entries(sections)) {
            for (const [dateKey, homeworks] of Object.entries(dates)) {
              for (const homework of Object.values(homeworks)) {
                allHomeworkArray.push({
                  ...homework,
                  class: classKey,
                  section: sectionKey,
                });
              }
            }
          }
        }
        setHomeworkData(allHomeworkArray);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching all homework entries:", error);
      }
    };

    fetchAllHomework();
  }, []);

  const filteredHomework = homeworkData.filter((item) => {
    const matchClass = selectedClass === 'AllClass' || item.class === selectedClass;
    const matchSection = selectedSection === 'AllSections' || item.section === selectedSection;
    return matchClass && matchSection;
  });

  const renderHomeworkItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.detail}>{`Date: ${item.date}`}</Text>
      <Text style={styles.detail}>{`Class: ${item.class} - Section: ${item.section}`}</Text>
      <Text style={styles.detail}>{`Subject: ${item.subject}`}</Text>
      <Text style={styles.detail}>{`Syllabus: ${item.syllabus}`}</Text>
      <Text style={styles.detail}>{`Description: ${item.description}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
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
              style={styles.dropdownInner}
              textStyle={styles.dropdownText}
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
              style={styles.dropdownInner}
              textStyle={styles.dropdownText}
              disabled={selectedClass === 'AllClass'}
            />
          </View>

          <FlatList
            data={filteredHomework}
            renderItem={renderHomeworkItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  dropdownsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dropdown: {
    flex: 1,
    marginHorizontal: 5,
  },
  dropdownInner: {
    backgroundColor: '#fafafa',
    borderColor: '#ccc',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  item: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  listContainer: {
    flexGrow: 1,
  },
});

export default HomeworkScreen;