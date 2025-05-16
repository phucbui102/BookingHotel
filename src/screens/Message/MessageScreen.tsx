import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Giả lập dữ liệu tin nhắn
const sampleMessages = [
  {id: '1', user: 'User 1', message: 'Chào bạn!', timestamp: '12:00 PM'},
  {
    id: '2',
    user: 'User 2',
    message: 'Chào bạn, mình có thể giúp gì?',
    timestamp: '12:01 PM',
  },
  {
    id: '3',
    user: 'User 1',
    message: 'Mình cần hỗ trợ về dự án.',
    timestamp: '12:02 PM',
  },
  {
    id: '4',
    user: 'User 2',
    message: 'Được rồi, bạn có thể giải thích rõ hơn không?',
    timestamp: '12:03 PM',
  },
];

const MessageScreen: React.FC = () => {
  const [messages, setMessages] = useState(sampleMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageData = {
        id: (messages.length + 1).toString(),
        user: 'User 1', // Có thể thay bằng tên người dùng thực tế
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages(prevMessages => [...prevMessages, newMessageData]);
      setNewMessage('');
    }
  };

  const renderItem = ({item}) => {
    const isUser = item.user === 'User 1';

    return (
      <View
        style={[
          styles.messageWrapper,
          isUser ? styles.rightAlign : styles.leftAlign,
        ]}>
        <View
          style={[
            styles.messageContainer,
            isUser ? styles.userMessage : styles.otherMessage,
          ]}>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        inverted
        contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
      />

      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Nhập tin nhắn..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  messageWrapper: {
    marginVertical: 6,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  leftAlign: {
    justifyContent: 'flex-start',
  },
  rightAlign: {
    justifyContent: 'flex-end',
  },
  messageContainer: {
    maxWidth: '75%',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  userMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  message: {
    color: '#000',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default MessageScreen;
