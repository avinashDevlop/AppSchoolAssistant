import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const Notice = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = () => {
    axios.get('https://studentassistant-18fdd-default-rtdb.firebaseio.com/Notices.json')
      .then(response => {
        const fetchedNotices = [];
        for (let key in response.data) {
          fetchedNotices.push({
            ...response.data[key],
            id: key
          });
        }
        setNotices(fetchedNotices.reverse());
      })
      .catch(error => {
        console.error('Error fetching notices:', error);
      });
  };

  const renderNoticeItem = ({ item }) => (
    <View style={styles.noticeCard}>
      <Text style={styles.noticeDate}>Date: {item.date}</Text>
      <Text style={[styles.noticeType, { backgroundColor: getTypeColor(item.type) }]}>{item.type}</Text>
      <Text style={styles.noticeTitle}>{item.title}</Text>
      <Text style={styles.noticeContent}>{item.content}</Text>
    </View>
  );

  const getTypeColor = (type) => {
    switch (type) {
      case 'Announcement':
        return 'blue';
      case 'Assignment':
        return 'green';
      case 'Feedback':
        return 'orange';
      case 'Emergency':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notices}
        renderItem={renderNoticeItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.noticeList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  noticeList: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  noticeCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  noticeDate: {
    marginBottom: 5,
    color: '#888',
  },
  noticeType: {
    marginBottom: 10,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
    color: '#fff',
    alignSelf: 'flex-start',
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noticeContent: {
    fontSize: 16,
  },
});

export default Notice;