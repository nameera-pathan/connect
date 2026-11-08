import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    loginError:'',
    status:'',
    error:'',
    user:{}
}

export const registerUserThunk = createAsyncThunk('auth/register', async (values, {rejectWithValue})=>{
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`,values, { withCredentials: true })
            const data = {...response.data.data}
            return data
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
})

export const loginUserThunk = createAsyncThunk('auth/login', async (values, {rejectWithValue})=>{
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`,values, { withCredentials: true })
        const data = {...response.data.data}
        // console.log('login reducer - ', data)
        return data
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
})

export const updateUserInfoThunk = createAsyncThunk('info/edit', async (values, {rejectWithValue})=>{
    try {
        const token = values.token
        const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/edit`, values, { headers: {Authorization: `Bearer ${token}`} })
        const data = {...response.data.data}
        return data
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
})

export const logoutUserThunk = createAsyncThunk('auth/logout', async ( {getState, rejectWithValue})=>{
    try {

         // Access the entire Redux state
        // const state = getState();

        // // Get token from userReducer
        // const chat = await state.chat.chat;

        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/logout`, ) 
        return response.data
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        changeIsNew: (state)=>{
            if(state.user.isNew){
                state.user.isNew = false
            }
        },
        logoutAction: (state)=>{
            state.status = ''
            state.error = ''
            state.user = {}
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(registerUserThunk.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(registerUserThunk.fulfilled, (state, action)=>{
            state.status = 'success'
            state.user = {...action.payload}
            state.error = ''
        })
        .addCase(registerUserThunk.rejected, (state, action)=>{
            state.status = 'failed'
            state.error = action.payload
        })
        .addCase(loginUserThunk.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(loginUserThunk.fulfilled, (state, action)=>{
            state.status = 'success'
            state.user = {...action.payload}
            state.error = ''
        })
        .addCase(loginUserThunk.rejected, (state, action)=>{
            state.status = 'failed'
            state.error = action.payload
        })
        .addCase(updateUserInfoThunk.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(updateUserInfoThunk.fulfilled, (state, action)=>{
            state.status = 'success'
            state.user = {...state.user, picture:action.payload.picture, status:action.payload.status}
            state.error = ''
        })
        .addCase(updateUserInfoThunk.rejected, (state, action)=>{
            state.status = 'failed'
            state.error = action.payload
        })
        .addCase(logoutUserThunk.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(logoutUserThunk.fulfilled, (state)=>{
            state.status = ''
            state.user = {}
            state.error = ''
        })
        .addCase(logoutUserThunk.rejected, (state, action)=>{
            state.status = 'failed'
            state.error = action.payload
        })
    }
})

export const {logoutAction, changeIsNew} = userSlice.actions;

export default userSlice.reducer;
