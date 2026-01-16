import firestore from '@react-native-firebase/firestore';
import FriendsService from './FriendsService';

export interface Message {
  id: string;
  friendId: string;
  userId: string;
  text: string;
  timestamp: Date;
  type: 'sent' | 'received';
}

class MessagesService {
  // Get messages for a friend with real-time updates
  getMessagesListener(
    friendId: string,
    currentUserId: string,
    callback: (messages: Message[]) => void,
    onError: (error: Error) => void
  ) {
    return firestore()
      .collection('messages')
      .where('friendId', '==', friendId)
      .onSnapshot(snapshot => {
        const messagesList = snapshot.docs.map(doc => {
          const data = doc.data() as Omit<Message, 'id' | 'type'>;
          return {
            id: doc.id,
            ...data,
            type: data.userId === currentUserId ? 'sent' : 'received',
          } as Message;
        });

        // Sort by timestamp on client side
        messagesList.sort((a, b) => {
          const aTime = a.timestamp?.seconds || 0;
          const bTime = b.timestamp?.seconds || 0;
          return aTime - bTime;
        });

        callback(messagesList);
      }, onError);
  }

  // Send a message
  async sendMessage(friendId: string, userId: string, text: string) {
    try {
      await firestore().collection('messages').add({
        friendId,
        userId,
        text: text.trim(),
        timestamp: new Date(),
      });

      // Update friend's last message time to move to top of list
      await FriendsService.updateLastMessageTime(friendId);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new MessagesService();
