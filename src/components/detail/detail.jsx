import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useChatStore } from '../lib/chatstore'
import { auth, db } from '../lib/firebase'
import { useUserStore } from '../lib/userStore';
import './detail.css'

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () =>{
    if (!user) return;

    const userDocRef = doc(db, 'users', currentUser.id)

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      })
      changeBlock()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='detail'>
      <div className='user'>
      {isCurrentUserBlocked || isReceiverBlocked ? 
        (<img src='./avatar.png' alt=''/>)
        :(<img src={user?.avatar || "./avatar.png"} alt=''/>)}
      <h2>{user?.username || "Invalid User"}</h2>
      <p>This is description</p> 
      </div>
      <div className='info'>
        <div className='option'>
          <div className='title'>
            <span>Chat Settings</span>
            <img src='./arrowUp.png' alt=''/>
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Privacy & help</span>
            <img src='./arrowUp.png' alt=''/>
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Shared Photos</span>
            <img src='./arrowDown.png' alt=''/>
          </div>
        </div>
        <div className='photos'>
          <div className='photoItem'>
            <div className='photoDetail'>
              <img src='https://th.bing.com/th/id/OIP.vX9qebn5tBohAcujh6dUHwHaFj?w=247&h=185&c=7&r=0&o=5&dpr=2&pid=1.7' alt=''/>
              <span>photo_2024_1</span>
            </div>
            <img src='./download.png' alt='' className='icon'/>
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Shared Files</span>
            <img src='./arrowUp.png' alt=''/>
          </div>
        </div>
        <button onClick={handleBlock}>
        {isCurrentUserBlocked 
        ? "You are blocked" 
        : isReceiverBlocked 
        ? "Unblock User" 
        : "Block User"}</button>
        <button className='logout' onClick={() => auth.signOut}>Log Out</button>      
      </div>
    </div>
  )
}

export default Detail