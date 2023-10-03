import React, { useState } from 'react'
import "./index.css"
import Header from '../Header'
import Navbar from '../Navbar'
import { useEffect } from 'react'
import { collection,addDoc,getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { OriginalData } from '../../reviewsData'
import {BiSolidUser} from "react-icons/bi"
import {AiFillStar} from "react-icons/ai"
import { useNavigate } from 'react-router-dom'

const Review = () => {
  
  const navigate = useNavigate()
  const [reviewsData,setReviewsData] = useState([])
  const image_url = 'https://image.tmdb.org/t/p/w500'
  
  useEffect(()=>{
    const getData = async ()=>{
        //add data to firebase
        //OriginalData.map(async eachItem=>await addDoc(collection(db,'reviews'),eachItem))
        getDocs(collection(db,'reviews'))
        .then(res=>{
            const data = []
            res.forEach(eachRes=>data.push(eachRes.data()))
            console.log(data)
            return (data)
        })
        .then(resData=>setReviewsData(resData))
        .catch(err=>console.log(err))
    }
    getData()
  },[])

  const getStars=(rating)=>{
    if(rating === null){
        return <p style={{fontSize:"12px" ,color:"gray",margin:"0"}}>NA</p>
    }
    const rating5 = Math.ceil(rating/2)
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

  return (
    <div className='home-page'>
      <Header/>
      <div className='content-section'>
        <Navbar/>
        <div className='review-content'>
          <div className='review-cards-wrapper'>
          {
            reviewsData.map((review,index)=>{
                let avatar = ''
                let rating = null
                if(review.results[0].author_details){
                    if(review.results[0].author_details.avatar_path){
                        avatar = review.results[0].author_details.avatar_path
                    }
                    if(review.results[0].author_details.rating){
                        rating = review.results[0].author_details.rating
                    }
                }
                
                return(
                    <div key={index} className='review-card'>
                        <div className='movie-review-content'>
                            <div style={{display:"flex",alignItems:"center"}} className='author-profile' onClick={()=>navigate("/user-reviews",{state:review.results[0].author})}>
                                {avatar ? <img src={image_url+avatar} alt='userAvatar' className='avatar-img'/> 
                                : 
                                <BiSolidUser className="review-user"/>
                                }
                                
                                <h4>{review.results[0].author}</h4>
                                <p style={{marginLeft:"1rem"}}>Created At: {review.results[0].created_at.substring(0,((review.results[0].created_at).length)-5)}</p>
                            </div>
                            
                            <hr/>
                            <div style={{display:"flex"}}> 
                                {getStars(rating)}
                            </div>
                            <p>{(review.results[0].content).substring(0,150)} ...</p>
                            <div style={{display:"flex",justifyContent:"flex-start"}}>
                            <button className='read-more-btn' onClick={()=>navigate("/full-review",{state:{review}})}>Read More</button>
                            </div>
                            
                        </div>
                        <div className='review-moview-img-con'>
                            <img className='review-moview-img' src={image_url + review.poster_path} alt={review.title} onClick={()=>navigate("/full-review",{state:{review}})}/>
                        </div>
                    </div>
                )
            })
          }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Review