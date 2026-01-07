import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export interface UserData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  uid: string;
  createdAt: Date;
}

class AuthService {
  // Register user with email and password
  async registerUser(
    email: string,
    password: string,
    userData: Omit<UserData, 'uid' | 'createdAt'>
  ) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      // Store additional user data in Firestore
      const userDoc: UserData = {
        ...userData,
        uid: user.uid,
        createdAt: new Date(),
      };

      await firestore().collection('users').doc(user.uid).set(userDoc);

      return { success: true, user: userDoc };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Login user with email and password
  async loginUser(email: string, password: string) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      const userData = userDoc.data() as UserData;

      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Logout user
  async logoutUser() {
    try {
      await auth().signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get current user
  getCurrentUser() {
    return auth().currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: any) => void) {
    return auth().onAuthStateChanged(callback);
  }

  // Get user data from Firestore
  async getUserData(uid: string) {
    try {
      const userDoc = await firestore().collection('users').doc(uid).get();
      if (userDoc.exists) {
        return { success: true, userData: userDoc.data() as UserData };
      } else {
        return { success: false, error: 'User data not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new AuthService();
