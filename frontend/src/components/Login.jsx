import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { loginUserThunk } from "../controller/UserReducer"
import { PulseLoader } from "react-spinners"

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {status, error, user} = useSelector((state)=>state.user)
    const [data, setData] = useState({
        email: '',
        password:'',
    }) 
    const handleSubmit = () =>{
        dispatch(loginUserThunk(data))
        setData({
            email:'',
            password:'',
        })
    }

    const handleSubmitFromKey = (e) =>{
      if(e.key === 'Enter'){
        dispatch(loginUserThunk(data))
        setData({
            email:'',
            password:'',
        })
      }
  }

    const handleChange = (e) =>{setData({...data, [e.target.name]:e.target.value}) }
  
    return (
          <section className="flex items-center justify-center min-h-screen dark:bg-dark_bg_1 dark">
            <div className="card w-full max-w-sm shadow-lg bg-dark_bg_2 rounded-lg focus:none">
              <div className="card-body">
                  <h2 className="text-xl font-bold text-slate-200 text-center tracking-wide">Login to PingMe</h2>

                  <div>

                    {/*  email */}
                    <div className="mb-4">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        autoComplete="off"
                        onChange={(e)=>{handleChange(e)}}
                        value={data.email}
                        name='email'
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                        required
                    />
                    </div>

                    {/* password */}
                    <div className="mb-4">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input
                        autoComplete="off"
                        onChange={(e)=>{handleChange(e)}}
                        value={data.password}
                        name='password'
                        type="password"
                        placeholder="Password"
                        className="input input-bordered w-full"
                        required
                        onKeyDown={(e)=>{ handleSubmitFromKey(e) }}
                    />
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



