import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import About from './About'
import Contacts from './Contacts'
import Cart from './Cart'
import CheckOut from './CheckOut'
import SetupAccount from './SetupAccount'
import HomeAdmin from './HomeAdmin'
import ProductsAdmin from './ProductsAdmin'
import AccountDetails from './AccountDetails'
import InquiriesAdmin from './InquiriesAdmin'
import UpdatePassword from './UpdatePassword'
import UpdateCellphoneNumber from './UpdateCellphoneNumber'
import UpdateSelectedLocation from './UpdateSelectedLocation'
import UpdateMeetUpPlace from './UpdateMeetUpPlace'
import AccountOrders from './AccountOrders'
import AccountChangeDetails from './AccountChangeDetails'
import CancelOrder from './CancelOrder'
function App() {
  const UserLogin = window.localStorage.getItem("isLogin");
 
  
  return (
    
    <BrowserRouter>
    <Routes>

        <Route path='/' element={<Home />}></Route>
        <Route path='/Login' element={UserLogin?<Home /> :<Login />}></Route>
        <Route path='/Register' element={UserLogin?<Home /> :<Register />}></Route>
        <Route path='/About' element={<About />}></Route>
        <Route path='/Cart' element={<Cart />} ></Route>
        <Route path='/Contacts' element={<Contacts />}></Route>
        <Route path='/CheckOut' element={<CheckOut />}> </Route>
        <Route path='/SetupAccount' element={<SetupAccount />}> </Route>
        <Route path='/HomeAdmin' element={<HomeAdmin />}> </Route>
        <Route path='/ProductsAdmin' element={<ProductsAdmin />}> </Route>
        <Route path='/InquiriesAdmin' element={<InquiriesAdmin />}> </Route>
        <Route path='/AccountDetails' element={<AccountDetails/>}></Route>
        <Route path='/UpdatePassword' element={<UpdatePassword/>}></Route>
        <Route path='/UpdateSelectedLocation' element={<UpdateSelectedLocation/>}></Route>
        <Route path='/UpdateMeetUpPlace' element={<UpdateMeetUpPlace/>}></Route>
        <Route path='/UpdateCellphoneNumber' element={<UpdateCellphoneNumber/>}></Route>
        <Route path='/AccountOrders' element={<AccountOrders/>}></Route>
        <Route path='/AccountChangeDetails' element={<AccountChangeDetails/>}></Route>
        <Route path='/CancelOrder' element={<CancelOrder/>}></Route>
    </Routes>
    </BrowserRouter>
  )
  
}

export default App