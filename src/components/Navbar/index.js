import React from 'react'
import "./index.css"
import {AiFillHome} from "react-icons/ai"
import {BiSolidMoviePlay,BiSolidUser} from "react-icons/bi"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../App'

const Navbar = () => {
  const [activeBar,setActiveBar] = useContext(AppContext)
  const navigate = useNavigate()
  return (
    <div className='navbar'>
        <AiFillHome className={activeBar === "home" ? "nav-icon active" : "nav-icon"} onClick={()=>{setActiveBar('home');navigate("/")}}/>
        <BiSolidMoviePlay className={activeBar === "review" ? "nav-icon active" : "nav-icon"} onClick={()=>{setActiveBar('review');navigate("/reviews")}}/>
        <BiSolidUser className={activeBar === "user" ? "nav-icon active" : "nav-icon"} onClick={()=>{setActiveBar('user');navigate("/my-reviews")}}/>
    </div>
  )
}

export default Navbar