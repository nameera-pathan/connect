import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    loginError:'',
    status:'',
    error:'',
    user:{},
    requests:[],
    notifications:null
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

export const logoutUserThunk = createAsyncThunk('auth/logout', async ( {rejectWithValue})=>{
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/logout`, ) 
        return response.data
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
})

export const getRequestsThunk = createAsyncThunk('profile/requests', async (_, {getState, rejectWithValue})=>{
    try {
        let state = getState()
        let token = state.user.user.token
        // console.log('requests reducer ')
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/requests`, 
            { headers: {Authorization: `Bearer ${token}`} } 
        )
        const data = response.data.data
        // console.log('requests reducer - ', response.data)
        return data
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
})

export const getNotificationsThunk = createAsyncThunk('profile/notifications', async (_, {getState, rejectWithValue})=>{
    try {
        let state = getState()
        let token = state.user.user.token
        console.log('notify reducer ')
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/notifications`, 
            { headers: {Authorization: `Bearer ${token}`} } 
        )
        const data = response.data.data
        console.log('notify reducer - ', response.data)
        return data
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
})

export const sendRequestThunk = createAsyncThunk('send/request', async (values, {getState, rejectWithValue})=>{
    try {
        let state = getState()
        let token = state.user.user.token
        console.log('send request reducer -', values)
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/send/request`, values,
            { headers: {Authorization: `Bearer ${token}`} } 
        )
        const data = response.data.data
        console.log('send request reducer - ', response.data)
        return data
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
        .addCase(getRequestsThunk.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(getRequestsThunk.fulfilled, (state, action)=>{
            state.status = 'success'
            if(!action.payload) return 
            // console.log(action.payload)
            state.requests = action.payload
            state.error = ''
        })
        .addCase(getRequestsThunk.rejected, (state, action)=>{
            state.status = 'failed'
            state.error = action.payload
        })
        .addCase(getNotificationsThunk.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(getNotificationsThunk.fulfilled, (state, action)=>{
            state.status = 'success'
            if(!action.payload) return 
            state.notifications = action.payload
            state.error = ''
        })
        .addCase(getNotificationsThunk.rejected, (state, action)=>{
            state.status = 'failed'
            state.error = action.payload
        })
    }
})

export const {logoutAction, changeIsNew} = userSlice.actions;

export default userSlice.reducer;



  


