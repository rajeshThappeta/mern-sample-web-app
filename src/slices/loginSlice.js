import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";


//make HTTP post req for user login
export const loginPromiseStages=createAsyncThunk('loginReq',async(userCredObj,thunkApi)=>{
    console.log(userCredObj)
    let res=await axios.post('http://localhost:4000/user-api/user-login',userCredObj)
    if(res.data.message==='login success'){

      //save token in local/session storage
      localStorage.setItem('token',res.data.token)
        return res.data;
    }else{
        return thunkApi.rejectWithValue(res.data)
    }
})

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    currentUser: null,
    userLoginStatus: false,
    loginErrorMsg: "",
    isPending: false,
  },
  reducers: {
    clearState:(state,action)=>{
        state.currentUser=null;
        state.userLoginStatus=false;
        state.loginErrorMsg='';
        state.isPending=false
    },

  },

  extraReducers:(builder)=>{
    builder.addCase(loginPromiseStages.pending,(state,action)=>{
            console.log('action in pending',action)
            state.isPending=true;
    }).addCase(loginPromiseStages.fulfilled,(state,action)=>{
        console.log('action in fulfilled',action)
        state.currentUser=action.payload.currentUser;
        state.isPending=false;
        state.loginErrorMsg=''
        state.userLoginStatus=true

    }).addCase(loginPromiseStages.rejected,(state,action)=>{
        console.log('action in rejected',action)
        state.loginErrorMsg=action.payload.message;
        state.isPending=false;
        state.userLoginStatus=false;
        state.currentUser=null
    })

  }
});

//export reducer of the slice
export default loginSlice.reducer;
//export action creator functions
export const {clearState} = loginSlice.actions;


