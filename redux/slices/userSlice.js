
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
export const getInfo = createAsyncThunk('getInfo',async (param)=>{
    console.log("get info",param)
    const data = await fetch('http://127.0.0.1:8000/users/myinfo/',{
        headers: {
            "Authorization":"token "+ param
        }})
    return await data.json()
})
export const cartSlice = createSlice({
  name: 'user',
  initialState: {
    token: '',
    username: '',
    email: '',
    role: '',

    error: false,
    loaded: false,
  },
  reducers: {
    login: (state, action) => {
        let data = action.payload
        state.token = data.token
        state.username = data.username
        //state.email = data.email
      },
  },
  extraReducers: (builder) =>{
    builder.addCase(getInfo.fulfilled,(state, action)=>{
        state.loaded = true ;
        state.email = action.payload.email
        state.username = action.payload.username
        state.role = action.payload.role
    })
    builder.addCase(getInfo.rejected,(state, action)=>{
        state.error = true
    })


  }
});

export const { login } = cartSlice.actions;

export default cartSlice.reducer;
