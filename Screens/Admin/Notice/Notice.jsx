import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Modal, FlatList, TouchableOpacity, StyleSheet, TouchableHighlight } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newNotice, setNewNotice] = useState({ type: 'Announcement', title: '', content: '' });

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

  const handleAddNotice = () => {
    const now = new Date();
    const currentDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')},${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const notice = { ...newNotice, date: now.toLocaleString() };

    axios.put(`https://studentassistant-18fdd-default-rtdb.firebaseio.com/Notices/${currentDateTime}.json`, notice)
      .then(response => {
        setNotices([notice, ...notices]);
        setNewNotice({ type: 'Announcement', title: '', content: '' });
        setModalVisible(false);
      })
      .catch(error => {
        console.error('Error adding notice:', error);
      });
  };

  const handleDeleteNotice = (id) => {
    axios.delete(`https://studentassistant-18fdd-default-rtdb.firebaseio.com/Notices/${id}.json`)
      .then(response => {
        setNotices(notices.filter(notice => notice.id !== id));
      })
      .catch(error => {
        console.error('Error deleting notice:', error);
      });
  };

  const renderNoticeItem = ({ item }) => (
    <View style={styles.noticeCard}>
      <Text style={styles.noticeDate}>Date: {item.date}</Text>
      <Text style={[styles.noticeType, { backgroundColor: getTypeColor(item.type) }]}>{item.type}</Text>
      <Text style={styles.noticeTitle}>{item.title}</Text>
      <Text style={styles.noticeContent}>{item.content}</Text>
      <TouchableOpacity style={styles.btnDelete} onPress={() => handleDeleteNotice(item.id)}>
        <Text style={styles.btnDeleteText}>Delete</Text>
      </TouchableOpacity>
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
      <Button title="Add Notice" onPress={() => setModalVisible(true)} style={styles.addNotice}/>
      <FlatList
        data={notices}
        renderItem={renderNoticeItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.noticeList}
      />
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Notice</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newNotice.type}
                onValueChange={(itemValue, itemIndex) =>
                  setNewNotice({ ...newNotice, type: itemValue })
                }>
                <Picker.Item label="Announcement" value="Announcement" />
                <Picker.Item label="Assignment" value="Assignment" />
                <Picker.Item label="Feedback" value="Feedback" />
                <Picker.Item label="Emergency" value="Emergency" />
              </Picker>
            </View>
            <TextInput
              style={styles.inputField}
              placeholder="Title"
              value={newNotice.title}
              onChangeText={(text) => setNewNotice({ ...newNotice, title: text })}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Description"
              value={newNotice.content}
              onChangeText={(text) => setNewNotice({ ...newNotice, content: text })}
              multiline
            />
            <View style={styles.buttonContainer}>
              <TouchableHighlight style={[styles.button, styles.closeButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancle</Text>
              </TouchableHighlight>
              <TouchableHighlight style={[styles.button, styles.submitButton]} onPress={handleAddNotice}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addNotice: {
    marginBottom: 20,
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
  btnDelete: {
    marginTop: 10,
    backgroundColor: 'red',
    paddingVertical: 5,
    borderRadius: 3,
    alignItems: 'center',
  },
  btnDeleteText: {
    color: '#fff',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  inputField: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
    paddingVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'gray',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: 'blue',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Notice;