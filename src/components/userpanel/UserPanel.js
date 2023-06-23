import {useState} from 'react'
import './UserPanel.css'
import {useSelector} from 'react-redux'
import axios from 'axios'

function UserPanel() {

  let {currentUser}=useSelector(state=>state.login)
  let [text,setText]=useState('')

  const getDataFromProtectedRoute=async()=>{
    //get token from local/session storage
    let token=localStorage.getItem('token');

    let res=await axios.get('http://localhost:4000/user-api/test-private',{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    setText(res.data.message)
  }

  return (
    <div className='text-center mt-5 border p-5'>
      <img src={currentUser.profileImage} width='200px' style={{borderRadius:'50%'}} alt="" />
      <p className="display-4">{currentUser.username}</p>
      <p className="display-4">{currentUser.email}</p>
      <p className="display-4">{currentUser.dob}</p>
      <button className="btn btn-success" onClick={getDataFromProtectedRoute}>Get Private Info</button>
      <h1>{text}</h1>
    </div>
  )
}

export default UserPanel