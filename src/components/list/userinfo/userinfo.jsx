import './userinfo.css'
import { useUserStore } from '../../lib/userStore'
import { useChatStore } from "../../lib/chatstore"

const Userinfo = () => {
  const { currentUser } = useUserStore();
  const { user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore()

  return (
    <div className='userinfo'>
        <div className="user">
            <img src={currentUser.avatar || "./avatar.png"} alt=""/>
            <h4>{currentUser.username}</h4>
        </div>
        <div className="icons">
            <img src="./more.png" alt=""/>
            <img src="./video.png" alt=""/>
            <img src="./edit.png" alt=""/>
        </div>
    </div>
  )
}

export default Userinfo