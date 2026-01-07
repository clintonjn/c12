import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { UserData } from './AuthService';

class GoogleAuthService {
  constructor() {
    this.configure();
  }

  configure() {
    GoogleSignin.configure({
      webClientId:
        '427346001158-6n5mbq24cq2kacur16b08rsqjebq1fbh.apps.googleusercontent.com', // Replace with your actual Web Client ID
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
    });
  }

  async signIn() {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken || userInfo.idToken;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const firebaseUserCredential =
        await auth().signInWithCredential(googleCredential);
      const firebaseUser = firebaseUserCredential.user;

      const userData: UserData = {
        firstName:
          userInfo.data?.user?.givenName || userInfo.user?.givenName || '',
        lastName:
          userInfo.data?.user?.familyName || userInfo.user?.familyName || '',
        email: userInfo.data?.user?.email || userInfo.user?.email || '',
        phoneNumber: '',
        uid: firebaseUser.uid,
        createdAt: new Date(),
      };

      await firestore()
        .collection('users')
        .doc(firebaseUser.uid)
        .set(userData, { merge: true });

      return {
        success: true,
        user: userData,
        accessToken: userInfo.data?.idToken || userInfo.idToken,
        userId: firebaseUser.uid,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async signOut() {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCurrentUser() {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      return { success: true, user: currentUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private handleError(error: unknown) {
    if (!error || Object.keys(error as object).length === 0) {
      return { success: false, cancelled: true };
    }

    const errorMessage = (error as Error)?.message || 'Google Sign-In failed';
    return { success: false, error: errorMessage };
  }
}

export default new GoogleAuthService();
