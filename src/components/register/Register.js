import { useState } from "react";
import "./Register.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  let [registrationError, setRegistrationError] = useState("");
  let navigate = useNavigate();
  let [selectedImage,setSelectedImage]=useState()

  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const createUser = async (newUser) => {

    //create an object of FormData
    let formData=new FormData()
    //add image
    formData.append('photo',selectedImage)
    //add newUser
    formData.append('newUser', JSON.stringify(newUser))

    //make HTTP post req
    let res = await axios.post("http://localhost:4000/user-api/user", formData);

    if (res.status === 201) {
      //clear registration err msg
      setRegistrationError("");
      //naviagte to login component
      navigate("/login");
    } else {
      setRegistrationError(res.data.message);
    }
  };



  //this function will be executed after image selection
  const onImageSelection=(event)=>{
    setSelectedImage(event.target.files[0])
  }




  return (
    <div>
      <p className="display-3 text-center text-secondary">User Registration</p>

      {/* registration error msg */}
      {registrationError !== "" && (
        <p className="text-danger fw-bold text-center display-6">
          {registrationError}
        </p>
      )}
      {/* form */}
      <form onSubmit={handleSubmit(createUser)} className="w-50 mx-auto mt-3">
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

        <input
          type="email"
          {...register("email")}
          placeholder="Email"
          className="form-control mb-3"
        />
        <input
          type="date"
          {...register("dob")}
          placeholder="Date of birth"
          className="form-control mb-3"
        />

        <input
          type="file"
          {...register("photo")}
          className="form-control mb-3"
          onChange={onImageSelection}
        />

        <button className="btn btn-success" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
