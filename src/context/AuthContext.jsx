import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { auth, db } from '../firebase/config';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

// context/AuthContext.js
import { getFunctions, httpsCallable } from 'firebase/functions';
import toast from 'react-hot-toast';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getUserData = useCallback(async (uid) => {
    const roles = ['students', 'teachers', 'admins'];
    for (const role of roles) {
      const userRef = doc(db, role, uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          ...data,
          role: role.slice(0, -1),
          id: uid,
          emailVerified: data.emailVerified || false,
        };
      }
    }
    return null;
  }, []);

  // Register function
  const register = async (email, password, role, additionalData = {}) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await sendEmailVerification(userCredential.user, {
        url: `${window.location.origin}/login?email=${encodeURIComponent(email)}`,
        handleCodeInApp: true
      });

      const userRef = doc(db, `students`, userCredential.user.uid);
      await setDoc(userRef, {
        ...additionalData,
        email,
        role: role.toLowerCase(),
        createdAt: new Date(),
        isActive: true,
        status: 'pending', // Default status for new users
        emailVerified: false,
        verificationEmailSentAt: new Date(),
      });

      await signOut(auth);

      return {
        success: true,
        email,
        uid: userCredential.user.uid,
      };
    } catch (error) {
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      }
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };



// admin registration function
const registerAdmin = async (email, password, additionalData, adminKey) => {
    try {
    
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user, {
        url: `${window.location.origin}/login?email=${encodeURIComponent(email)}`,
        handleCodeInApp: true,
      });

      const userRef = doc(db, 'admins', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        firstName: additionalData.firstName,
        lastName: additionalData.lastName,
        role: 'admin',
        adminKey: adminKey,
        isActive: true,
        createdAt: serverTimestamp(),
        emailVerified: false,
        verificationEmailSentAt: new Date(),
      });

      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };




// Teacher registration function - UPDATED VERSION
const registerTeacher = async (email, password, additionalData) => {
  try {
    // First check if email already exists using the imported function
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods && methods.length > 0) {
      throw new Error('auth/email-already-in-use');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user, {
      url: `${window.location.origin}/login?email=${encodeURIComponent(email)}`,
      handleCodeInApp: true,
    });

    const userRef = doc(db, 'teachers', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      fullName: additionalData.fullName,
      mobileNo: additionalData.mobileNo,
      department: additionalData.department,
      subjects: additionalData.subjects,
      teacherId: additionalData.teacherId, // Assuming this is a unique identifier for the teacher
      loginPassword: additionalData.loginPassword, // Store the login password securely
      role: 'teacher',
      isActive: true,
      createdAt: serverTimestamp(),
      emailVerified: false,
      verificationEmailSentAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    // Re-throw the error with proper message
    if (error.message === 'auth/email-already-in-use') {
      throw new Error('This email is already registered');
      toast.error('This email is already registered. Please login instead.');
    } else {
      throw new Error(error.message || 'Registration failed');
    }
  }
};



// login function 
const login = async (email, password, userRole) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let role = userRole.toLowerCase();
    console.log('Role from login:', role);
    
    let collectionName;
    if(role === 'admin' ){
       collectionName = 'admins'; // "admin"
    }else if(role === 'teacher'){
       collectionName = 'teachers'; // "teacher", 
    }else if(role === 'student'){
       collectionName = 'students'; // "student"
    }else{
      throw new Error('Invalid role specified');    
    }


    console.log('User logged in:', user ,role);
    // const collectionName = 'users'; // Default collection for all roles
    console.log('Using collection:', collectionName, user.uid , role);

    // Fetch user data from the specified collection
    const userRef = doc(db, collectionName, user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error(`No user data found in ${collectionName} collection`);
    }

    const fetchedUserData = {
      ...userSnap.data(),
      id: user.uid,
      role: role,
      emailVerified: user.emailVerified,
    };
    console.log('Fetched user data:', fetchedUserData);

    setCurrentUser(user);
    setUserData(fetchedUserData);
    return { user, userData: fetchedUserData };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};


  //logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserData(null);
    } catch (error) {
      setError(error.message || 'Logout failed');
      throw error;
    }
  };

  // Reset password function
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const fetchedUserData = await getUserData(user.uid);
        setCurrentUser(user);
        setUserData(fetchedUserData);
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setInitialCheckComplete(true);
      setLoading(false);
    });

    return unsubscribe;
  }, [getUserData]);


  // console.log('AuthContext initialized with user:', currentUser, userData); 
  const value = {
    currentUser,
    userData,
    register, //signup,
    registerAdmin, // Added admin registration function   
    registerTeacher, // Added teacher registration function
    login,
    logout,
    loading,
    error,
    setError,
    initialCheckComplete,
    setUserData,
    // collectionName: 'users', // Default collection for all roles
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
