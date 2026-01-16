import firestore from '@react-native-firebase/firestore';

export interface Friend {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  lastMessageTime?: Date;
}

class FriendsService {
  // Get friends for a user with real-time updates
  getFriendsListener(
    userId: string,
    callback: (friends: Friend[]) => void,
    onError: (error: Error) => void
  ) {
    return firestore()
      .collection('friends')
      .where('createdBy', '==', userId)
      .onSnapshot(snapshot => {
        const friendsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Friend[];

        // Sort by lastMessageTime first, then by createdAt (newest first)
        friendsList.sort((a, b) => {
          const aLastMsg = a.lastMessageTime?.seconds || 0;
          const bLastMsg = b.lastMessageTime?.seconds || 0;

          // If both have messages, sort by last message time
          if (aLastMsg && bLastMsg) {
            return bLastMsg - aLastMsg;
          }

          // If only one has messages, prioritize it
          if (aLastMsg && !bLastMsg) return -1;
          if (!aLastMsg && bLastMsg) return 1;

          // If neither has messages, sort by creation time
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });

        callback(friendsList);
      }, onError);
  }

  // Add a new friend
  async addFriend(name: string, userId: string) {
    try {
      await firestore().collection('friends').add({
        name: name.trim(),
        createdBy: userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get friends list (one-time fetch)
  async getFriends(userId: string) {
    try {
      const snapshot = await firestore()
        .collection('friends')
        .where('createdBy', '==', userId)
        .get();

      const friendsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Friend[];

      // Sort by lastMessageTime first, then by createdAt (newest first)
      friendsList.sort((a, b) => {
        const aLastMsg = a.lastMessageTime?.seconds || 0;
        const bLastMsg = b.lastMessageTime?.seconds || 0;

        // If both have messages, sort by last message time
        if (aLastMsg && bLastMsg) {
          return bLastMsg - aLastMsg;
        }

        // If only one has messages, prioritize it
        if (aLastMsg && !bLastMsg) return -1;
        if (!aLastMsg && bLastMsg) return 1;

        // If neither has messages, sort by creation time
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });

      return { success: true, friends: friendsList };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update friend's last message time
  async updateLastMessageTime(friendId: string) {
    try {
      await firestore().collection('friends').doc(friendId).update({
        lastMessageTime: new Date(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new FriendsService();
