import Chatlist from './chatlist/chatlist'
import './list.css'
import Userinfo from './userinfo/userinfo'

const List = () => {
  return (
    <div className='list'>
        <Userinfo/>
        <Chatlist/>
    </div>
  )
}

export default List