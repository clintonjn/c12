import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useUser } from '../context/UserContext';
import MessagesService, { Message } from '../services/MessagesService';

interface Friend {
  id: string;
  name: string;
}

interface ChatScreenProps {
  route: {
    params: {
      friend: Friend;
    };
  };
  navigation: {
    goBack: () => void;
  };
}

export default function IndividualChatScreen({
  route,
  navigation,
}: ChatScreenProps) {
  const { friend } = route.params;
  const { currentUser } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!friend.id) return;

    const unsubscribe = MessagesService.getMessagesListener(
      friend.id,
      currentUser?.uid || '',
      messagesList => {
        setMessages(messagesList);
        setLoading(false);

        // Auto scroll to bottom when new messages arrive
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
      _error => {
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [friend.id, currentUser?.uid]);

  const sendMessage = async () => {
    if (!inputText.trim() || !currentUser?.uid) return;

    const messageText = inputText.trim();
    setInputText(''); // Clear input immediately

    const result = await MessagesService.sendMessage(
      friend.id,
      currentUser.uid,
      messageText
    );

    if (!result.success) {
      // Restore text if sending failed
      setInputText(messageText);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.type === 'sent' ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.type === 'sent' ? styles.sentText : styles.receivedText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{friend.name}</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          loading ? (
            <Text style={styles.loadingText}>Loading messages...</Text>
          ) : (
            <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
          )
        }
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Ubuntu Mono',
    fontWeight: 'bold',
    color: '#333',
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 12,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
  },
  messageText: {
    fontFamily: 'Ubuntu Mono',
    fontSize: 14,
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontFamily: 'Ubuntu Mono',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendText: {
    color: '#fff',
    fontFamily: 'Ubuntu Mono',
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontFamily: 'Ubuntu Mono',
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontFamily: 'Ubuntu Mono',
    color: '#666',
  },
});
