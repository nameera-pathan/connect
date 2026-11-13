import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import {io} from 'socket.io-client'
import Home from "./components/Home"
import Register from "./components/Register"
import Login from "./components/Login"
import EditPicAndStats from "./components/EditPicAndStats"
import { useSelector } from "react-redux"
import SocketContext from "./context"

const socket = io(process.env.REACT_APP_BACKEND_URL.split('/api/v1')[0])
function App() {
    // console.log(process.env.REACT_APP_BACKEND_URL)
    const {user} = useSelector((state) => state.user)
    const{ token } = user
    return (
      <div className="dark">
        <SocketContext.Provider value={socket} >
        <Router>
          <Routes>
            <Route exact path='/' element={ token ? <Home/> : <Navigate to='/login'/> } />
            <Route exact path='/register' element={ !token ? <Register/> : <Navigate to='/edit'/> } />
            <Route exact path='/login' element={ !token ? <Login/> : <Navigate to='/'/> } />
            <Route exact path='/edit' element={ token ? <EditPicAndStats/> : <Navigate to='/login'/>  } />
          </Routes>
        </Router>
        </SocketContext.Provider>
      </div>
    )
}

export default App
