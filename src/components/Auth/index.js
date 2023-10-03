import React from 'react'
import authImg from "../../assets/auth.png"
import "./index.css"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {auth} from "../../firebase"
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth'

const Auth = () => {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [fullname,setFullname] = useState('')
  const [authStatus,setAuthStatus] = useState(true)
  const [errMsg,setErrMsg] = useState("")

  const navigate = useNavigate()

  const onFormSubmit=(e)=>{
    e.preventDefault()
    if(!authStatus){
        createUserWithEmailAndPassword(auth,username,password)
        .then(userCredentials=>{navigate("/login");setAuthStatus(!authStatus);setPassword('');localStorage.setItem('fullname',fullname)})
        .catch(err=>{
            console.log(err)
            const msg = (err.message.split(":"))[1]
            setErrMsg(msg)
        })
    }else{
        signInWithEmailAndPassword(auth,username,password)
        .then(userCred=>{
            navigate("/")
            localStorage.setItem('username',username)
        })
        .catch(err=>{
            console.log(err)
            const msg = (err.message.split(":"))[1]
            setErrMsg(msg)
        })
    }
    
  }

  const handleClickHere=()=>{
    if(authStatus){
        navigate("/register")
    }else{
        navigate("/login")
    }
    setUsername('')
    setPassword('')
    setAuthStatus(!authStatus)
  }

  return (
    <div className='auth-page'>
        <div className='left-section'>
            <img src={authImg} alt="auth-img" className='auth-img'/>
        </div>
        <div className='right-section'>
            <h1>CINEMA ELK</h1>
            <form className='form-con' onSubmit={onFormSubmit}>
                <div style={{height:"80px"}}>
                    <input type='email' placeholder='Enter Username or Email' className='input-field' value={username} onChange={(e)=>setUsername(e.target.value)} required/>
                </div>
                <div style={{height:"80px"}}>
                    <input type='password' placeholder='Enter Password' className='input-field' value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                </div>
                {
                    (!authStatus) && <div style={{height:"80px"}}>
                    <input type='text' placeholder='Enter Full Name' className='input-field' value={fullname} onChange={(e)=>setFullname(e.target.value)} required/>
                </div>
                }
                <div className='form-controls-con'>
                    <button type='submit' className='login-button'>{authStatus ? 'Login Now' : 'Join the club'}</button>
                    {authStatus && <button type='button' className='login-button' onClick={()=>{
                            navigate("/")
                            localStorage.setItem('username','guest@gmail.com')
                        
                    }}>Guest Login</button>}
                </div>
                <p>{authStatus ? "Join the club," : "Already a member?"} <span onClick={handleClickHere}>Click here!</span></p>
                <p style={{color:"black"}}>{errMsg}</p>
            </form>
        </div>
    </div>
  )
}

export default Auth