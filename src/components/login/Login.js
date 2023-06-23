import {useState,useEffect} from "react";
import "./Login.css";
import {useForm} from 'react-hook-form'
import { loginPromiseStages } from "../../slices/loginSlice";
import {useDispatch,useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'


function Login() {
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let dispath=useDispatch()
  let {userLoginStatus,loginErrorMsg}=useSelector(state=>state.login)
  let navigate=useNavigate()
  let [loginError,setLoginError]=useState('')

  const onUserLogin=(userCredObj)=>{
      dispath(loginPromiseStages(userCredObj))
  }

  useEffect(()=>{
    if(userLoginStatus===true){
      navigate('/user-profile')
    }else{
      setLoginError(loginErrorMsg)
    }
  },[userLoginStatus,loginErrorMsg])

  return (
    <div>
      <p className="display-3 text-center text-secondary">User login</p>

      {/* registration error msg */}
      {loginErrorMsg !== "" && (
        <p className="text-danger fw-bold text-center display-6">
          {loginErrorMsg}
        </p>
      )}
      {/* form */}
      <form onSubmit={handleSubmit(onUserLogin)} className="w-50 mx-auto mt-3">
        <input
          type="text"
          {...register("username")}
          placeholder="Usernamer"
          className="form-control mb-3"
        />

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="form-control mb-3"
        />

        <button className="btn btn-success" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
