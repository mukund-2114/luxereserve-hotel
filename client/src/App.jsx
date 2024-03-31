import "./App.css";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from "./Components/Home";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextProvider } from "./UserContext";
import AccountPage from "./Pages/AccountPage";
import SinglePlace from "./Pages/SinglePlace";
import Footer from "./Components/Footer";

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.withCredentials = true;


function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
    
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/account/:subpage?" element={<AccountPage/>}/>
          <Route path="/account/:subpage/:action" element={<AccountPage/>}/>
          <Route path="/account/:subpage/:action/:id" element={<AccountPage/>}/>
          <Route path="/singlePlace/:id" element={<SinglePlace/>}/>
        </Routes>
        <Footer/>
        
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
