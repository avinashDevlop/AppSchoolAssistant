import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';

const HomeworkScreen = ({route}) => {
  const { className, section } = route.params;
  const [ClassName, setClassName] = useState(className);
  const [Section, setSection] = useState(section);
  const [loading, setLoading] = useState(false);
  const [homeworkData, setHomeworkData] = useState([]);

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
    return item.class === ClassName && item.section === Section;
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
        filteredHomework.length > 0 ? (
          <FlatList
            data={filteredHomework}
            renderItem={renderHomeworkItem}
            keyExtractor={(item, index) => `${item.class}-${item.section}-${item.date}-${index}`}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <Text style={styles.noHomeworkText}>No homeworks are available</Text>
        )
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
  noHomeworkText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default HomeworkScreen;
