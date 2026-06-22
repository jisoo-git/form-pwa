import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDDhhH_m7c0d4ZBwb18_fjQzBwFqQOb7N4',
  authDomain: 'form-pwa-academy.firebaseapp.com',
  projectId: 'form-pwa-academy',
  storageBucket: 'form-pwa-academy.firebasestorage.app',
  messagingSenderId: '892820925937',
  appId: '1:892820925937:web:3d5320b8b19e75159e6850',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
