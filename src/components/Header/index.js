import React from 'react'
import "./index.css"
import logo from "../../assets/logo.png"
import { useNavigate } from 'react-router-dom'


const Header = () => {
  const navigate = useNavigate()
  return (
    <div className='header'>
        <div className='logo-con' style={{display:"flex",alignItems:"center"}} onClick={()=>navigate("/")}>
            <img src={logo} alt='logo' className='logo-img'/>
            <h2>CINEMA ELK</h2>
        </div>
        <button className='logout-btn' onClick={()=>{
            navigate('/login')
            localStorage.removeItem("username")
        }}>Logout</button>
    </div>
  )
}

export default Header