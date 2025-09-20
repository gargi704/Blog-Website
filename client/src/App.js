import { useState } from 'react';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataProvider from './context/DataProvider';
import Login from './component/account/login';
import Home from './components/home';
import Header from './com/header/Header';
import CreatePost from './com/create/CreatePost';
import DetailView from './com/details/DetailView';
import Update from './com/create/Update';
import About from './com/about/About';
import Contact from './com/contact/Contact';

const PrivateRoute = ({ isAuthenticated }) => {
    const token = sessionStorage.getItem('accessToken');
    return isAuthenticated && token ? (
        <>
            <Header />
            <Outlet />
        </>
    ) : <Navigate replace to='/account' />;
};

function App() {
  const [isAuthenticated, isUserAuthenticated] = useState(false);

  return (
    <DataProvider>
      <BrowserRouter>
       <ToastContainer position="top-center" autoClose={3000} />
        <Box style={{ marginTop: 64 }}>
          <Routes>
            <Route path='/account' element={<Login isUserAuthenticated={isUserAuthenticated} />} />

            <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
              <Route path='/' element={<Home />} />
              <Route path='/create' element={<CreatePost />} />
              <Route path='/details/:id' element={<DetailView />} />
              <Route path='/update/:id' element={<Update />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact />} />
            </Route>
          </Routes>
        </Box>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
