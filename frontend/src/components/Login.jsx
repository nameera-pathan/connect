import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { loginUserThunk, getRequestsThunk, getNotificationsThunk  } from "../controller/UserReducer"

import { PulseLoader } from "react-spinners"
import { resetChat } from '../controller/ChatReducer'

// import validator from 'validator'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {status, error, user} = useSelector((state)=>state.user)
    const [data, setData] = useState({
        email: '',
        password:'',
        username:'',
        text:''
    })
      const [passwordEye, setPasswordEye] = useState({
        type: "password",
        btnText: "show"
    })

    const handleSubmit = async () =>{
        const values = {
          email: data.email, password: data.password
        }
        dispatch(loginUserThunk(values))
        // dispatch(getRequestsThunk())
        // dispatch(getNotificationsThunk())
        setData({
            email:'',
            password:'',
            username:'',
            text:''
        })
    }
    

    const handleSubmitFromKey = async (e) =>{
      if(e.key === 'Enter'){
        const values = {
            email: data.email, password: data.password
        }
        dispatch(loginUserThunk(values))
        // dispatch(getRequestsThunk())
        // dispatch(getNotificationsThunk())
        setData({
            email:'',
            password:'',
            username:'',
            text:''
        })
      }
  }

    const handleChange = (e) =>{setData({...data, [e.target.name]:e.target.value}) }
    const handleChangeText = (e) =>{setData({...data, [e.target.name]:e.target.value, email:e.target.value, username:e.target.value }) }

    const togglePassword = (e) =>{
        if(passwordEye.btnText === "show"){
            setPasswordEye({...passwordEye, btnText:"hide", type:"text"})
        }
        else{
            setPasswordEye({...passwordEye, btnText:"show", type:"password"})
        }
    }

  // clearing old user's active conversation when new user logs in
    useEffect(()=>{
      dispatch(resetChat())
    },[])


    return (
          <section className="flex items-center justify-center min-h-screen dark:bg-dark_bg_1 dark">
            <div className="card w-full max-w-sm shadow-lg bg-dark_bg_2 rounded-lg focus:none">
              <div className="card-body">
                  <h2 className="text-xl font-bold text-slate-200 text-center tracking-wide mb-4">Login to PingMe</h2>

                  <div>

                    {/*  email */}
                    <div className="mb-4 ">
                    <input
                        autoComplete="off"
                        onChange={(e)=>{handleChangeText(e)}}
                        value={data.email}
                        name="email"
                        type="email"
                        placeholder="Email or Username"
                        className="input input-bordered w-full"
                        required
                        onKeyDown={handleSubmitFromKey}
                    />
                    </div>

                    {/* password */}
                    <div className="mb-4 relative">
                        <div className="flex justify-between">
                        <input
                            autoComplete="off"
                            onChange={(e)=>{handleChange(e)}}
                            value={data.password}
                            name='password'
                            type={passwordEye.type}
                            placeholder="Password"
                            id="password"
                            className="input input-bordered w-[80%]"
                            required
                            onKeyDown={handleSubmitFromKey}
                        />
                        <button type="button" className="border-2 border-gray-700 rounded-lg button w-[15%]"
                         onClick={togglePassword} id="pswEyeBtn">{passwordEye.btnText}</button>
                    </div>
                </div>


                <button className="btn btn-success tracking-wide text-white w-full transition ease-in duration-200" onClick={handleSubmit} >
                  {status === 'loading' ? <PulseLoader color='#fff' size={9} /> : 'Login' }
                </button>

                <p className="mt-4 text-center text-sm text-gray-500">Don't have an account ?
                <a className=" btn btn-xs btn-primary text-center text-sm text-white mb-2 ml-2"
                onClick={()=>{navigate('/register')}}
                >register</a>
                </p>
                {error ?  <p className="mt-4 text-center text-sm text-red-400">{error}</p> : null }

              </div>
            </div>
          </div>
        </section>
  )
}

export default Login




