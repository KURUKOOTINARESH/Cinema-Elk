import React, { useEffect, useState } from 'react'
import Header from '../Header'
import Navbar from '../Navbar'
import "./index.css"
import axios from "axios"

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useNavigate } from 'react-router-dom'
import { OriginalData } from '../../reviewsData'
import { collection,addDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 8,
    slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 5,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
    slidesToSlide: 1 // optional, default to 1.
  }
};

const Home = () => {
  const [nowPlaying,setNowPlaying] = useState([])
  const [popular,setPopular] = useState([])
  const [topRated,setTopRated] = useState([])
  const [upComing,setUpComing] = useState([])

  const image_url = 'https://image.tmdb.org/t/p/w500'
  const navigate = useNavigate()

  useEffect(()=>{
    const isUserLoggedin = localStorage.getItem('username')
    if(!isUserLoggedin){
      navigate("/login")
    }
    const now_playing_url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=335914e07c0d26bd15668ad334889c0e&language=en-US&page=1';
    axios.get(now_playing_url).then(res=>setNowPlaying(res.data.results))
    const popular_url = 'https://api.themoviedb.org/3/movie/popular?api_key=335914e07c0d26bd15668ad334889c0e&language=en-US&page=1';
    axios.get(popular_url).then(res=>setPopular(res.data.results))
    const top_rated_url = 'https://api.themoviedb.org/3/movie/top_rated?api_key=335914e07c0d26bd15668ad334889c0e&language=en-US&page=1';
    axios.get(top_rated_url).then(res=>setTopRated(res.data.results))
    const upcoming_url = 'https://api.themoviedb.org/3/movie/upcoming?api_key=335914e07c0d26bd15668ad334889c0e&language=en-US&page=1';
    axios.get(upcoming_url).then(res=>setUpComing(res.data.results))
  },[])

  return (
    <div className='home-page'>
      <Header/>
      <div className='content-section'>
        <Navbar/>
        <div className='movies-content'>
          {
            //add data to firestore
            //<button onClick={async()=>OriginalData.map(async eachItem=>await addDoc(collection(db,'reviews'),eachItem))}>add</button>
          }
          
          <h3>Now Playing</h3>
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
          >
            {
              nowPlaying.map((movie,index)=>{
                return(<div key={index} className='movie'>
                  <div style={{position:"relative",height:"210px",width:"140px"}}>
                    <div className='shadow-bg'></div>
                    <img src={image_url + movie.poster_path} alt={movie.title} className='movie-poster'/>
                  </div>
                  
                  <p>{movie.title}</p>
                </div>)
              })
            }
          </Carousel>
          <h3>Top Rated</h3>
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
          >
            {
              topRated.map((movie,index)=>{
                return(<div key={index} className='movie'>
                  <div style={{position:"relative",height:"210px",width:"140px"}}>
                    <div className='shadow-bg'></div>
                    <img src={image_url + movie.poster_path} alt={movie.title} className='movie-poster'/>
                  </div>
                  
                  <p>{movie.title}</p>
                </div>)
              })
            }
          </Carousel>
          <h3>Popular</h3>
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
          >
            {
              popular.map((movie,index)=>{
                return(<div key={index} className='movie'>
                  <div style={{position:"relative",height:"210px",width:"140px"}}>
                    <div className='shadow-bg'></div>
                    <img src={image_url + movie.poster_path} alt={movie.title} className='movie-poster'/>
                  </div>
                  
                  <p>{movie.title}</p>
                </div>)
              })
            }
          </Carousel>
          <h3>Upcoming</h3>
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
          >
            {
              upComing.map((movie,index)=>{
                return(<div key={index} className='movie'>
                  <div style={{position:"relative",height:"210px",width:"140px"}}>
                    <div className='shadow-bg'></div>
                    <img src={image_url + movie.poster_path} alt={movie.title} className='movie-poster'/>
                  </div>
                  
                  <p>{movie.title}</p>
                </div>)
              })
            }
          </Carousel>
        </div>
        
      </div>
    </div>
  )
}

export default Home