import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { ModulAjar, TeacherProfile } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function validateConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// User Profile
export async function saveProfile(profile: TeacherProfile) {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const path = `users/${userId}`;
  try {
    await setDoc(doc(db, path), {
      ...profile,
      userId,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getProfile() {
  const userId = auth.currentUser?.uid;
  if (!userId) return null;

  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, path));
    return snap.exists() ? snap.data() as TeacherProfile : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

// Documents
export async function saveDocument(docData: ModulAjar) {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Auth required");

  const path = `documents/${docData.id}`;
  try {
    await setDoc(doc(db, path), {
      ...docData,
      userId,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchDocuments() {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];

  const path = 'documents';
  try {
    const q = query(
      collection(db, path), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id })) as ModulAjar[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function removeDocument(id: string) {
  const path = `documents/${id}`;
  try {
    await deleteDoc(doc(db, path));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
