import React, { useState } from 'react'
import "./index.css"
import Header from '../Header'
import Navbar from '../Navbar'
import { useEffect,useRef } from 'react'
import { collection,addDoc,getDocs,doc,getDoc,updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import {BiSolidUser} from "react-icons/bi"
import {AiFillEdit, AiFillStar,AiOutlineDelete} from "react-icons/ai"
import { useLocation, useNavigate } from 'react-router-dom'
import {FiEdit} from "react-icons/fi"
import {MdDeleteOutline} from "react-icons/md"


const UserReviews = () => {
  const [reviewCardId,setReviewCardId] = useState()
  const [reviewMovieId,setReviewMovieId] = useState()
  const [postReviewOpen,setIsPostReviewOpen] = useState(false)
  const [userReview,setUserReview] = useState()
  const [selectedOption,setSelectedOption] = useState()
  const boxRef = useRef(null)
  const reviewTextRef = useRef(null)
  const reviewCardRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  let user = ''
  let text = ''
  const isMyviews = location.pathname === '/my-reviews' ? true :false
  if(isMyviews){
    user = ((localStorage.getItem('username')).split("@"))[0]
    text = 'My Reviews'
  }else{
    user = location.state
    text = `Reviews Given By ${user}`
  }

  const [reviewsData,setReviewsData] = useState([])
  const image_url = 'https://image.tmdb.org/t/p/w500'
  const getReviewData = async ()=>{
        
    await getDocs(collection(db,'reviews'))
    .then(res=>{
        const data = []
        res.forEach(eachRes=>data.push(eachRes.data()))
        return (data)
    })
    .then(resData=>setReviewsData(resData))
}
  useEffect(()=>{
    window.addEventListener("keydown",(e)=>{
        if(e.key === 'Escape'){
            setIsPostReviewOpen(false)
        }
      })
    
    getReviewData()
    
  },[])

  useEffect(()=>{
    
    if(reviewTextRef.current !== null){
       reviewTextRef.current.focus()
       // Move the cursor to the end of the text
       const textElement = reviewTextRef.current;
       const textLength = textElement.value.length;

        // Set the selection range to the end of the text
        textElement.setSelectionRange(textLength, textLength);
    }
  },[postReviewOpen])

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
  
  const upDateFirebase = (reviewId,updatedData)=>{
    const docRef = doc(db, "reviews", reviewId);

        // Fetch the document using getDoc
        getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
            // Document exists, you can update it
            

            // Use updateDoc to update the document
            return updateDoc(docRef, updatedData);
            } else {
            console.log("Document does not exist");
            // Handle the case when the document does not exist
            }
        })
        .then(() => {
            console.log('Document successfully updated!');
            getReviewData()
        })
        .catch((error) => {
            console.error('Error updating document: ', error);
        });
  }

  const onEditReview = (id,content,rating,cardId)=>{
    setReviewCardId(cardId)
    setReviewMovieId(id) 
    setUserReview(content)
    setSelectedOption(rating/2)
    setIsPostReviewOpen(true)
    
  }

  const onDeleteReview = (movieId,cardId)=>{ 
    const getData = async ()=>{
        const data = []
        let reviewId = ''
        let ids = []
        const res = await getDocs(collection(db,'reviews'))
        res.forEach(eachRes=>{ids.push(eachRes.id);data.push(eachRes.data())})
        let idIndex = null
        const matchedReview = data.filter((eachItem,index)=>{if(eachItem.id === movieId){
            idIndex = index;
            return true
        }return false})
        
        matchedReview[0].results = matchedReview[0].results.filter(eachItem=>eachItem.id !== cardId)
        reviewId = ids[idIndex]
        //setMovieReview(matchedReview[0])
        upDateFirebase(reviewId,matchedReview[0])
    }
    getData()
  }

  const handleReviewSubmit = ()=>{
    const getData = async ()=>{
        const data = []
        let reviewId = ''
        let ids = []
        const res = await getDocs(collection(db,'reviews'))
        res.forEach(eachRes=>{ids.push(eachRes.id);data.push(eachRes.data())})
        let idIndex = null
        const matchedReview = data.filter((eachItem,index)=>{if(eachItem.id === reviewMovieId){
            idIndex = index;
            return true
        }return false})
        const newReview = {
            author_details : {
                rating : selectedOption * 2
            },
            content : userReview,
            created_at : new Date(Date.now()).toISOString()
        }
        matchedReview[0].results = matchedReview[0].results.map(eachItem=>{
           
            if(eachItem.id === reviewCardId){
                console.log("matched")
                return {...eachItem,...newReview}
            }
            return eachItem
        })
        reviewId = ids[idIndex]
        //setMovieReview(matchedReview[0])

        upDateFirebase(reviewId,matchedReview[0])
    }
    getData()
    setIsPostReviewOpen(false)
  }

  return (
    <div className='home-page'>
      <Header/>
      <div className='content-section'>
        <Navbar/>
        <div className='review-content'>
        <h3>{text}</h3>
          <div className='review-cards-wrapper'>
            
            {
                reviewsData.map((review,index)=>{
                    return (review.results).map((eachResult,index)=>{
                        if(eachResult.author === user){
                            let avatar = ''
                            let rating = null
                            if(eachResult.author_details){
                                if(eachResult.author_details.avatar_path){
                                    avatar = eachResult.author_details.avatar_path
                                }
                                if(eachResult.author_details.rating){
                                    rating = eachResult.author_details.rating
                                }
                            }
                            return(
                                <div ref={reviewCardRef} key={index} className='review-card' id={eachResult.id}>
                                    <div className='movie-review-content'>
                                        <div style={{display:"flex",alignItems:"center"}} className='author-profile' onClick={()=>navigate("/user-reviews")}>
                                            {avatar ? <img src={image_url+avatar} alt='userAvatar' className='avatar-img'/> 
                                            : 
                                            <BiSolidUser className="review-user"/>
                                            }
                                            
                                            <h4>{eachResult.author}</h4>
                                            <p style={{marginLeft:"1rem"}}>Created At: {eachResult.created_at.substring(0,((eachResult.created_at).length)-5)}</p>
                                        </div>
                                        
                                        <hr/>
                                        <div style={{display:"flex"}}> 
                                            {getStars(rating)}
                                        </div>
                                        <p>{(eachResult.content).substring(0,150)} ...</p>
                                        <div style={{display:"flex",justifyContent:"flex-start"}}>
                                        <button className='read-more-btn' onClick={()=>navigate("/full-review",{state:{review}})}>Read More</button>
                                        {isMyviews && 
                                        <div>
                                            <FiEdit className='review-control-icon' style={{backgroundColor:"gold"}} onClick={()=>onEditReview(review.id,eachResult.content,rating,eachResult.id)}/>
                                            <AiOutlineDelete className='review-control-icon' style={{backgroundColor:"#F15A24"}} onClick={()=>onDeleteReview(review.id,eachResult.id)}/>
                                        </div>
                                        }
                                        </div>
                                        
                                    </div>
                                    <div className='review-moview-img-con'>
                                        <img className='review-moview-img' src={image_url + review.poster_path} alt={review.title} onClick={()=>navigate("/full-review",{state:{review}})}/>
                                    </div>
                                </div>
                            )
                        }

                    })
                    
                })
            }
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
                <textarea ref={reviewTextRef} value={userReview} onChange={(e)=>setUserReview(e.target.value)} placeholder='Enter Your Review Here' rows='5' cols='10' className='review-text-area'></textarea>
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

export default UserReviews