import React, { useState,useEffect,useRef } from 'react'
import "./index.css"
import Header from '../Header'
import Navbar from '../Navbar'
import { useLocation, useNavigate } from 'react-router-dom'
import tom from "../../assets/tom.png"
import chris from "../../assets/chris.png"
import johnny from "../../assets/johnny.png"
import kate from "../../assets/kate.png"
import emma from "../../assets/emma.png"
import axios from 'axios'
import {AiFillStar} from "react-icons/ai"
import {BiSolidUser} from "react-icons/bi"
import { collection,getDocs,doc,getDoc,updateDoc  } from 'firebase/firestore'
import { db } from '../../firebase'
import {v4} from "uuid"

const FullReview = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {review} = location.state
  const image_url = 'https://image.tmdb.org/t/p/w500'
  const [popular,setPopular] = useState([])
  const [postReviewOpen,setIsPostReviewOpen] = useState(false)
  const boxRef = useRef(null)
  const [selectedOption,setSelectedOption] = useState('4')
  const [userReview,setUserReview] = useState('')
  const [movieReview,setMovieReview] = useState(review)

  useEffect(()=>{
    
    window.addEventListener("keydown",(e)=>{
        if(e.key === 'Escape'){
            setIsPostReviewOpen(false)
        }
      })
    
    const popular_url = 'https://api.themoviedb.org/3/movie/popular?api_key=335914e07c0d26bd15668ad334889c0e&language=en-US&page=1';
    axios.get(popular_url).then(res=>setPopular((res.data.results).slice(0,15)))
  },[])

  const getStars=(rating)=>{
    if(rating === null){
        return <p style={{fontSize:"12px" ,color:"gray",margin:"0"}}>NA</p>
    }
    const rating5 = Math.ceil(rating/2)
    console.log(rating5)
    const rating_list = [1,2,3,4,5]
    return rating_list.map((eachItem,index)=>{
        if(index < rating5){
            return <AiFillStar key={index} style={{color:"gold"}}/>
        }
        return(
            <AiFillStar key={index}/>
        )
    })
  }

  const handleReviewSubmit = ()=>{
    const getData = async ()=>{
        const data = []
        let reviewId = ''
        let ids = []
        const res = await getDocs(collection(db,'reviews'))
        res.forEach(eachRes=>{ids.push(eachRes.id);data.push(eachRes.data())})
        let idIndex = null
        const matchedReview = data.filter((eachItem,index)=>{if(eachItem.id === movieReview.id){
            idIndex = index;
            return true
        }return false})
        const newReview = {
            id:v4(),
            author : ((localStorage.getItem('username')).split("@"))[0],
            author_details : {
                rating : selectedOption * 2
            },
            content : userReview,
            created_at : new Date(Date.now()).toISOString()
        }
        matchedReview[0].results.push(newReview)
        reviewId = ids[idIndex]
        setMovieReview(matchedReview[0])
        const docRef = doc(db, "reviews", reviewId);

        // Fetch the document using getDoc
        getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
            // Document exists, you can update it
            

            // Use updateDoc to update the document
            return updateDoc(docRef, matchedReview[0]);
            } else {
            console.log("Document does not exist");
            // Handle the case when the document does not exist
            }
        })
        .then(() => {
            console.log('Document successfully updated!');
        })
        .catch((error) => {
            console.error('Error updating document: ', error);
        });
    }
    getData()
    setIsPostReviewOpen(false)
  }

  return (
    <div className='home-page'>
      <Header/>
      <div className='content-section'>
        <Navbar/>
        <div className='full-review-content'>
            <div className='full-review-content-left'>
                <img src={image_url+movieReview.poster_path} alt={movieReview.title} className='full-review-img'/>
                <h3>{movieReview.title}</h3>
                <p>Movie Overview:</p>
                <p style={{color:"gray",fontWeight:"400"}}>{movieReview.overview}</p>
                <button className='logout-btn post-review-button' onClick={()=>{
                        setIsPostReviewOpen(true)
                    }}>Post review</button>
                <h4>Cast & Crew</h4>
                <div className='cast-con'>
                    <div>
                        <img src={johnny} alt='johnny' className='crew-img'/>
                        <p>Johnny Depp</p>
                    </div>
                    <div>
                        <img src={tom} alt='tom' className='crew-img'/>
                        <p>Tom Cruise</p>
                    </div>
                    <div>
                        <img src={chris} alt='chris' className='crew-img'/>
                        <p>Chris Evans</p>
                    </div>
                    <div>
                        <img src={kate} alt='kate' className='crew-img'/>
                        <p>Kate Winslet</p>
                    </div>
                    <div>
                        <img src={emma} alt='emma' className='crew-img'/>
                        <p>Emma Watson</p>
                    </div>
                </div>
                <h4>Similar Movies</h4>
                <div className='similar-movies-list'>
                    {
                        popular.map((movie,index)=>{
                            return(<div key={index} className='movie'>
                            <div style={{position:"relative",height:"145px",width:"100px"}}>
                                <img src={image_url + movie.poster_path} alt={movie.title} className='movie-poster' style={{width:"90px"}}/>
                            </div>
                            
                            <p style={{fontSize:"10px"}}>{movie.title}</p>
                            </div>)
                        })
                    }
                </div>
            </div>
            <div className='ful-review-content-right'>  
                <h3>Reviews By Cineme Elk Users</h3>
                <div className='reviews-wrapper'>
                {
                    (movieReview.results).map((eachReview,index)=>{
                        let avatar = ''
                        let rating = null
                        if(eachReview.author_details){
                            if(eachReview.author_details.avatar_path){
                                avatar = eachReview.author_details.avatar_path
                            }
                            if(eachReview.author_details.rating){
                                rating = eachReview.author_details.rating
                            }
                        }
                        return(
                            <div key={index} className='review-con'>
                                <p>{(eachReview.content).substring(0,200)} ...</p>
                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                    <div className='full-review-profile-con' style={{display:"flex",alignItems:"center"}} onClick={()=>navigate("/user-reviews",{state:eachReview.author})}>
                                        {avatar ? <img src={image_url+avatar} alt='userAvatar' className='avatar-img'/> 
                                        : 
                                        <BiSolidUser className="review-user"/>
                                        }
                                        
                                        <h4>{eachReview.author}</h4>
                                    </div>
                                    <div style={{display:"flex"}}> 
                                        {getStars(rating)}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                </div>
            </div>
        </div>
      </div>
      {postReviewOpen && <div 
        onKeyDown={(e)=>{
            if(e.key === 'Escape'){
                setIsPostReviewOpen(false)
            }
            
        }} 
        onClick={(e)=>{
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setIsPostReviewOpen(false)
            }
            }}
        className='post-review-con-bg'
        >
            <div ref={boxRef} className='post-review-con'>
                <textarea value={userReview} onChange={(e)=>setUserReview(e.target.value)} placeholder='Enter Your Review Here' rows='5' cols='10' className='review-text-area'></textarea>
                <div style={{display:"flex"}}>
                    Rating <select value={selectedOption} className='select-con' onChange={(e)=>setSelectedOption(e.target.value)}>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                        </select> out of 5
                </div>
                <button className='logout-btn' onClick={handleReviewSubmit}>submit</button>
            </div>
      </div>
    }
    </div>
  )
}

export default FullReview