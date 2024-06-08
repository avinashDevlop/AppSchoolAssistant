import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const ChatContent = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/chats/All Teachers.json`
        );
        const fetchedMessages = response.data ? Object.values(response.data) : [];
        
        // Sort messages by timestamp
        fetchedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMessages();
  });


  const calculateTimeAgo = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);

    if (isNaN(messageTime.getTime())) {
      console.error("Invalid timestamp:", timestamp);
      return "Invalid date";
    }

    const differenceInMinutes = Math.floor((now - messageTime) / (1000 * 60));

    if (differenceInMinutes < 1) {
      return "Just now";
    } else if (differenceInMinutes < 60) {
      return `${differenceInMinutes} minutes ago`;
    } else {
      const differenceInHours = Math.floor(differenceInMinutes / 60);
      if (differenceInHours < 24) {
        return `${differenceInHours} hours ago`;
      } else {
        const differenceInDays = Math.floor(differenceInHours / 24);
        return `${differenceInDays} days ago`;
      }
    }
  };

  const renderMessageItem = ({ item }) => (
    <View
      style={[
        styles.messageItem,
         styles.otherMessage,
      ]}
    >
      <View style={styles.messageIconContainer}>
        <Ionicons name="person-circle-outline" size={25} color="#fff" style={styles.messageIcon} />
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.messageText}>{item.msg}</Text>
        <Text style={styles.messageTimestamp}>{calculateTimeAgo(item.timestamp)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>All Teachers</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 40, // Adjust for header
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 5,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%', 
  },  
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e1ffc7',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
  },
  messageIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  messageIcon: {
    color: '#fff',
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#212529',
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 5,
  },
});

export default ChatContent;