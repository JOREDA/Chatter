import React, { useEffect } from 'react';
import Chat from "./components/chat/chat";
import Detail from "./components/detail/detail";
import List from "./components/list/list";
import Login from "./components/login/login";
import Notification from "./components/notification/notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './components/lib/firebase';
import { useUserStore } from './components/lib/userStore';
import { useChatStore } from './components/lib/chatstore';

const App = () => {
  const { currentUser, isLoading, fetchUserInfo, set } = useUserStore(); 
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        fetchUserInfo(user.uid); 
      } else {
        set({ currentUser: null, isLoading: false }); 
      }
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo, set]); 

  if (isLoading){
    return <div className='loading'>Loading...</div>;
  } else {
    return (
      <div className='container'>
        {currentUser ? (
          <>
            <List />
            {chatId && <Chat />}
            {chatId && <Detail />}
          </>
        ) : <Login />}
        <Notification />
      </div>
    );
  }
}
export default App;