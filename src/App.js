import './App.css';

import { Routes,Route } from 'react-router-dom';
import Auth from './components/Auth';
import Home from './components/Home';
import Review from './components/Review';
import User from './components/User';
import { createContext, useState } from 'react';
import FullReview from './components/FullReview';
import UserReviews from './components/UserReviews';

export const AppContext = createContext()

function App() {
  const [activeBar,setActiveBar] = useState('home')
  return (
    <AppContext.Provider value={[activeBar,setActiveBar]}>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Auth/>}></Route>
          <Route path='/register' element={<Auth/>}></Route>
          <Route path='/reviews' element={<Review/>}></Route>
          <Route path='/user' element={<User/>}></Route>
          <Route path='/full-review' element={<FullReview/>}></Route>
          <Route path='/user-reviews' element={<UserReviews/>}></Route>
          <Route path='/my-reviews' element={<UserReviews/>}></Route>
        </Routes>
      </div>
    </AppContext.Provider>
    
  );
}

export default App;
