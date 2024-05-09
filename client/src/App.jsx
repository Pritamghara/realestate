import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header'; // Corrected import statement
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import Updatelisting from './pages/Updatelisting';
import Listing from './pages/Listing';
import Search from './pages/Search';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />

        <Route path='listings/:listingId' element={<Listing/>}  />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:listingId' element={<Updatelisting />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
