import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useUser } from '../context/UserContext';
import FriendsService, { Friend } from '../services/FriendsService';

interface ChatScreenProps {
  navigation: {
    navigate: (screen: string, params: unknown) => void;
  };
}

export default function ChatScreen({ navigation }: ChatScreenProps) {
  const { currentUser } = useUser();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [addingFriend, setAddingFriend] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!currentUser?.uid || showAddModal || showSuccessModal) return;

    const unsubscribe = FriendsService.getFriendsListener(
      currentUser.uid,
      friendsList => {
        setFriends(friendsList);
        setLoading(false);
      },
      _error => {
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser?.uid, showAddModal, showSuccessModal]);

  const handleAddFriend = () => {
    setShowAddModal(true);
  };

  const addFriend = async () => {
    if (!friendName.trim() || !currentUser?.uid || addingFriend) return;

    setAddingFriend(true);
    const result = await FriendsService.addFriend(
      friendName.trim(),
      currentUser.uid
    );

    if (result.success) {
      const addedFriendName = friendName.trim();
      setFriendName('');
      setShowAddModal(false);
      setAddingFriend(false);

      // Show success message with custom modal
      setSuccessMessage(
        `Befriending in progress, wait for sometime for ${addedFriendName} to appear in your friends list.`
      );
      setShowSuccessModal(true);
    } else {
      setAddingFriend(false);
      Alert.alert('Error', result.error || 'Failed to add friend');
    }
  };

  const handleSuccessOK = () => {
    setShowSuccessModal(false);
    // Refresh friends list after 2 seconds
    setTimeout(async () => {
      if (currentUser?.uid) {
        const result = await FriendsService.getFriends(currentUser.uid);
        if (result.success) {
          setFriends(result.friends);
        }
      }
    }, 2000);
  };

  const handleFriendPress = (friend: Friend) => {
    navigation.navigate('IndividualChat', { friend });
  };

  const renderFriend = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => handleFriendPress(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.friendName}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading friends...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
          <Text style={styles.addButtonText}>+ Add Friend</Text>
        </TouchableOpacity>
      </View>

      {friends.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No Chats yet</Text>
          <Text style={styles.emptySubtext}>
            Tap "Add Friend" to chat with friends
          </Text>
        </View>
      ) : (
        <FlatList
          data={friends}
          renderItem={renderFriend}
          keyExtractor={item => item.id}
          style={styles.friendsList}
        />
      )}

      {/* Add Friend Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Friend</Text>
            <TextInput
              style={styles.modalInput}
              value={friendName}
              onChangeText={setFriendName}
              placeholder="Enter friend name"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setFriendName('');
                  setShowAddModal(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addModalButton]}
                onPress={addFriend}
                disabled={addingFriend}
              >
                <Text style={styles.addModalButtonText}>
                  {addingFriend ? 'Adding...' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Friend Added</Text>
            <Text style={styles.successText}>{successMessage}</Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleSuccessOK}
            >
              <Text style={styles.successButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Ubuntu Mono',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontFamily: 'Ubuntu Mono',
    fontWeight: 'bold',
  },
  friendsList: {
    flex: 1,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontFamily: 'Ubuntu Mono',
    fontWeight: 'bold',
    fontSize: 16,
  },
  friendName: {
    fontSize: 16,
    fontFamily: 'Ubuntu Mono',
    color: '#333',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Ubuntu Mono',
    color: '#666',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Ubuntu Mono',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Ubuntu Mono',
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Ubuntu Mono',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Ubuntu Mono',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    textAlign: 'center',
    fontFamily: 'Ubuntu Mono',
    color: '#666',
  },
  addModalButton: {
    backgroundColor: '#333',
  },
  addModalButtonText: {
    textAlign: 'center',
    fontFamily: 'Ubuntu Mono',
    color: '#fff',
    fontWeight: 'bold',
  },
  successButton: {
    backgroundColor: '#333',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
    minWidth: 100,
    borderWidth: 2,
    borderColor: '#666',
  },
  successButtonText: {
    color: '#fff',
    fontFamily: 'Ubuntu Mono',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
