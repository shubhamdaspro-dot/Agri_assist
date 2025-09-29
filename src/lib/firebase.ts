import {initializeApp, getApp, getApps} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: 'studio-1541943016-6eb69',
  appId: '1:543612941756:web:8985642fa9ed5cdedfa7b9',
  storageBucket: 'studio-1541943016-6eb69.appspot.com',
  apiKey: 'AIzaSyBxzZkMyGPzaSq55X76r4xMHDnfbQC6wlI',
  authDomain: 'studio-1541943016-6eb69.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '543612941756',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = (typeof window !== 'undefined') ? getMessaging(app) : null;

if (typeof window !== 'undefined') {
    try {
        enableIndexedDbPersistence(db)
            .catch((err) => {
                if (err.code == 'failed-precondition') {
                    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
                } else if (err.code == 'unimplemented') {
                    console.warn('The current browser does not support all of the features required to enable persistence.');
                }
            });
    } catch(e) {
        console.error("Error enabling firestore persistence", e);
    }
}


export {app, auth, db, storage, messaging, getToken, onMessage };
