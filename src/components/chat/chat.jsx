import { useEffect, useState , useRef} from 'react'
import './chat.css'
import { db } from '../lib/firebase'
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useChatStore } from '../lib/chatstore'
import { useUserStore } from '../lib/userStore'
import upload from '../lib/upload'

function Chat(){
  const [open, setOpen] = useState(false)
  const [chat, setChat] = useState({ messages: [] })
  const [text, setText] = useState("")
  const [img, setImg] = useState({
    file: null,
    url: "",
  })
  
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { currentUser } = useUserStore();

  const  endRef = useRef(null)
  
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), 
    (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleImg = e => {
    const file = e.target.files[0];
    if (file) {
        setImg({
            file: file,
            url: URL.createObjectURL(file)
        });
    }
  };

  const handleEmoji = () => {
    setOpen(prev => !prev);
  }

  const handleSend = async () => {
    try {
      let imgURL = null;
      if (img.file) {
        imgURL = await upload(img.file);
      }
  
      if (text.trim() !== "") {
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            text,
            createdAt: new Date(),
          }),
        });
      }
  
      if (imgURL) {
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            img: imgURL,
            createdAt: new Date(),
          }),
        });
      }
  
      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchat", id);
        const userChatsSnapshot = await getDoc(userChatsRef);
  
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
  
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
  
          userChatsData.chats[chatIndex].lastMessage = text || "Image";
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
  
          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  
    setImg({
      file: null,
      url: "",
    });
    setText("");
  };
  

  return (
    <div className='chat'>
      <div className='top'>
        <div className='user'>
          {isCurrentUserBlocked || isReceiverBlocked ? 
            (<img src='./avatar.png' alt=''/>)
            :(<img src={user?.avatar || "./avatar.png"} alt=''/>)}
          <div className='texts'>
            <span>{user?.username || "Invalid User"}</span>
            <p>This is description</p> 
          </div>
        </div>
        <div className='icon'>
          <img src='./phone.png' alt=''/>
          <img src='./video.png' alt=''/>
          <img src='./info.png' alt=''/>
        </div>
      </div>
      
      <div className='centre'>
        {chat?.messages?.map((message) =>(
          <div 
            className={
              message.senderId === currentUser.id 
              ? 'message own' 
              : 'message'
            } 
            key= {message?.createdAt
            }
          >
              <div className='texts'>
                {message.img && <img src={message.img} alt=''/>}
                {message.text && <p>{message.text}</p>}
                <span>{message.updatedAt || '1 min ago'}</span>
              </div> 
          </div>
        ))}
        {img.url && <div className='message own'>
          <div className='texts'>
             <img src={img.url} alt=''/>
          </div>
        </div>}
        <div ref={endRef}></div>
      </div>
      
      <div className='bottom'>
        <div className='icons'>
          <label htmlFor='file'>
            <img src='./img.png' alt=''/>
          </label>
          <input 
            type='file' 
            id='file' 
            style={{display: 'none'}}
            onChange={handleImg}
            disabled= {isCurrentUserBlocked || isReceiverBlocked}
           />
          <img src='./camera.png' alt=''/>
          <img src='./mic.png' alt=''/>
        </div>
        <input 
          type='text' 
          placeholder={
            (isCurrentUserBlocked || isReceiverBlocked) 
            ? 'Cannot Send Message ' 
            : 'Type a Message...'
          } 
          value={text}
          onChange={e => setText(e.target.value)}
          disabled= {isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className='emoji'>
          <img src='./emoji.png' alt='' onClick={handleEmoji}/> 
          {open && (
            <div className='picker'>
              <EmojiPicker 
                onEmojiClick={(e) => {
                  setText(prev => prev + e.emoji);
                  setOpen(false);
                }}
              /> 
            </div>
          )}
        </div> 
        <button 
          className='sendButton' 
          onClick={handleSend} 
          disabled= {isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat
