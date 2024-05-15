import React, { useState, useEffect } from 'react';
import './chatlist.css';
import AddUser from '../addUser/addUser';
import { useUserStore } from '../../lib/userStore';
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatstore';

const Chatlist = () => {
    const [addMode, setAddMode] = useState(false);
    const [chats, setChats] = useState([]);
    const [input, setInput] = useState("")

    const [loadingChats, setLoadingChats] = useState(true);
    const [error, setError] = useState(null);

    const { currentUser, isLoading: userLoading } = useUserStore();
    const { isCurrentUserBlocked, isReceiverBlocked, changeChat } = useChatStore();

    useEffect(() => {
        if (currentUser) {
            const unsub = onSnapshot(doc(db, "userchat", currentUser.id), async (res) => {
                const items = res.data().chats;

                const promises = items.map( async(item) =>{
                    const userDocRef = doc(db, "users", item.receiverId);
                    const userDocSnap = await getDoc(userDocRef);

                    const user = userDocSnap.data();

                    return{...item, user};
                }
            );
            const chatData = await Promise.all(promises)

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        }
    ); 
            return () => {
                unsub();
            };
        }
    }, [currentUser.id]);

    const handleSelect = async (chat)=>{

        const userChats = chats.map(item =>{
            const {user, ...rest} = item;
            return rest;
        });

        const chatIndex = userChats.findIndex(
            item => item.chatId === chat.chatId
        );

        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchat", currentUser.id);

        try {
            await updateDoc(userChatsRef, {
                chats: userChats,
            });
            changeChat(chat.chatId, chat.user)
        } catch (error) {
            console.log(error)
        }
    };

    const filteredChats = chats.filter((c) =>
        c.user.username.toLowerCase().includes(input.toLowerCase())
    )

    return (
        <div className='chatlist'>
            <div className="search">
                <div className="searchbar">
                    <input 
                        type='text' 
                        placeholder='Search'
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <img src="./search.png" alt=""></img>
                </div>
                <img
                    src={addMode ? "./minus.png" : "./plus.png"}
                    alt=""
                    className='add'
                    onClick={() => setAddMode(prev => !prev)}
                />
            </div>
            {error && <div className='error'>Error fetching chats: {error.message}</div>}
            
            {filteredChats.map((chat) => (
                <div 
                    className='item' 
                    key={chat.chatId} 
                    onClick={() => handleSelect(chat)}
                    style={{
                        backgroundColor: chat?.isSeen ? "transparent" : "black"
                    }}>
                        {isCurrentUserBlocked || isReceiverBlocked ? 
                            (<img src='./avatar.png' alt=''/>)
                            :(<img src={
                                chat.user.blocked.includes(currentUser.id) 
                                ? './avatar.png' 
                                : chat.user.avatar || './avatar.png'
                            } alt=''/>
                            )
                        }
                        <div className='texts'>
                            <span>{
                                chat.user.blocked.includes(currentUser.id)
                                ? "Invalid User"
                                : chat.user.username
                            }</span>
                            <p></p>
                        </div> 
                </div>
            ))}
            {addMode && <AddUser />}
        </div>
    );
};

export default Chatlist;
