import { auth } from "./firebase";
import { AuthError, AuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

type ErrorFunc = (error: AuthError) => void;

const authSignIn = async (provider: AuthProvider, callback?: () => void, errorCallback?: ErrorFunc) => {
  try {
    await signInWithPopup(auth, provider);
    if (callback) {
      callback();
    }
  } catch (error: unknown) {
    if (errorCallback) {
      errorCallback(error as AuthError);
    }
  }
};

export const googleSignin = (callback?: () => void, errorCallback?: ErrorFunc) => () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  authSignIn(provider, callback, errorCallback);
};
