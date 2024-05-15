import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure you import the CSS file for toast notifications

const Notification = () => {
  return (
    <div className='notification'>
        <ToastContainer position='bottom-right'/>
    </div>
  );
}

export default Notification;
