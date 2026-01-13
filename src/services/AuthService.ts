import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

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
  ): Promise<{ success: boolean; user?: UserData; error?: string }> {
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
    } catch (error: any) {
      return { success: false, error: this.getAuthErrorMessage(error.code) };
    }
  }

  // Login user with email and password
  async loginUser(
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: UserData; error?: string }> {
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
    } catch (error: any) {
      return { success: false, error: this.getAuthErrorMessage(error.code) };
    }
  }

  private getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please use a different email or try logging in.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      default:
        return 'Authentication failed. Please try again.';
    }
  }

  // Logout user
  async logoutUser() {
    try {
      await auth().signOut();

      // Also sign out from Google to allow account selection next time
      try {
        await GoogleSignin.signOut();
      } catch {
        // User may not be signed in with Google
      }

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
  onAuthStateChanged(callback: (user: unknown) => void) {
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
