import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ConversionRecord {
  id?: string;
  userId: string;
  toolId: string;
  toolName: string;
  fileName: string;
  fileSize: number;
  outputName: string;
  category: string;
  createdAt?: any;
}

export const logUserConversion = async (record: Omit<ConversionRecord, 'createdAt'>) => {
  if (!record.userId) return;
  try {
    const collRef = collection(db, 'users', record.userId, 'conversions');
    await addDoc(collRef, {
      ...record,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Could not record conversion history:', err);
  }
};

export const fetchRecentConversions = async (userId: string, count: number = 10): Promise<ConversionRecord[]> => {
  if (!userId) return [];
  try {
    const collRef = collection(db, 'users', userId, 'conversions');
    const q = query(collRef, orderBy('createdAt', 'desc'), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<ConversionRecord, 'id'>)
    }));
  } catch (err) {
    console.warn('Failed to fetch user conversions:', err);
    return [];
  }
};
