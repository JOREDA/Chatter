import { create } from 'zustand'
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,
    fetchUserInfo: async (ID) => {
        if (!ID) return set({ currentUser: false, isLoading: false });

        try {
            const docRef = doc(db, "users", ID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                set({ currentUser: docSnap.data(), isLoading: false });
            } else {
                set({ currentUser: null, isLoading: false });
            }
        } catch (error) {
            console.log(error);
            set({ currentUser: null, isLoading: false });
        }
    },
    set: (newState) => set(newState) 
}));
