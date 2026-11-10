import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
    status:'',
    error:'',
    conversations:[],
    messages:[],
    activeConversation:{},
    notifications:[],
    files:[]
}

export const getConversationThunk = createAsyncThunk('conversation/all', async (values, {getState, rejectWithValues})=>{
    try {
        // const token = values.token
           
        // Access the entire Redux state
        const state = getState();

        // Get token from userReducer
        const token = await state.user.user.token;
        // API Call with token
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/conversations`,
            {  
                headers: {Authorization: `Bearer ${token}`},
            })
        // console.log("con thunk ----> ", response.data)    
        return response.data.conversations
    } catch (err) {
        console.log(err.response.data)
        return rejectWithValues(err.response.data)
    }
})

export const getActiveConversationThunk = createAsyncThunk('conversation/active', async (values, {getState, rejectWithValues})=>{
    try {
        // const token = values.token
         // Access the entire Redux state
        const state = getState();

        // Get token from userReducer
        const token = await state.user.user.token;
        console.log("values - ", values)
        // API Call with token
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/conversation`, values,     
            {  
                headers: {Authorization: `Bearer ${token}`},
            })
        console.log(response.data.data)    
        return response.data.data
    } catch (err) {
        console.log(err.response.data)
        return rejectWithValues(err.response.data)
    }
})

export const getConversationMessagesThunk = createAsyncThunk('conversation/messages', async (values, {rejectWithValues})=>{
    try {
        const token = values.token;
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/conversation/${values.id}`,     
            {  
                headers: {Authorization: `Bearer ${token}`},
            })
        return response.data.data
    } catch (err) {
        console.log(err.response.data)
        return rejectWithValues(err.response.data)
    }
})

export const sendMessageThunk = createAsyncThunk('message/send', async (values, {rejectWithValues})=>{
    try {
        // console.log('send msg values: ', values)
        const token = values.token;
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/send/message`, values,     
            {  
                headers: {Authorization: `Bearer ${token}`},
            })
        return response.data
    } catch (err) {
        console.log(err.response.data)
        return rejectWithValues(err.response.data)
    }
})

export const createGroupConversationThunk = createAsyncThunk('conversation/create_group', async (values, {getState, rejectWithValues})=>{
    try {
        // const token = values.token;
        // Access the entire Redux state
        const state = getState();

        // Get token from userReducer
        const token = await state.user.user.token;
        // API Call with token
        // console.log("group thunk val--> ", values)
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/group`, values,      
            {  
                headers: {Authorization: `Bearer ${token}`},
            })
        // console.log("group thunk res ---> ", response.data)    
        return response.data.data
    } catch (err) {
        console.log(err.response.data)
        return rejectWithValues(err.response.data)
    }
})

export const chatSlice = createSlice({
    name:'chat',
    initialState,
    reducers:{
        setActiveConversation: (state, action)=>{
            state.activeConversation = action.payload
        },
        updateMessagesAction:(state, action)=>{
            let msg = state.messages.find((msg)=>action.payload._id === msg._id)
            if(!msg){
                console.log('action :', action.payload)
                if(state.activeConversation._id === action.payload.conversation._id){
                    state.messages = [...state.messages, action.payload]
                    // // filtering conversations array for realtime
                    let conversation = action.payload.conversation
                    let filteredConversation = state.conversations.filter((c)=>{
                        if(c._id === conversation._id){
                            c.latestMessage = {...c.latestMessage, message: action.payload.message}
                            return c
                        }
                    })
                    let ConvosExcludingConversation = state.conversations.filter((c)=>(c._id !== conversation._id))
                    state.conversations = [...filteredConversation, ...ConvosExcludingConversation]
                }
            }
        },
        addFiles:(state, action)=>{
            state.files = [...state.files, action.payload]
            console.log('addFiles: ' ,state.files)
        },
        clearFiles:(state, action)=>{
            state.files = []
        },
        removeFileFromFiles:(state, action)=>{
            let index = action.payload;
            let files = [...state.files];
            let fileToRemove = [files[index]];
            state.files = files.filter((file) => !fileToRemove.includes(file));
        },
        resetChat:(state, action)=>{
            state.activeConversation = {}
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getConversationThunk.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(getConversationThunk.fulfilled, (state, action)=>{
            state.status = 'success'
            state.error = ''
            state.conversations = action.payload
        })
        .addCase(getConversationThunk.rejected, (state)=>{
            state.status = 'failed'
        })
        .addCase(getActiveConversationThunk.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(getActiveConversationThunk.fulfilled, (state, action)=>{
            state.status = 'success'
            state.error = ''
            state.activeConversation = {...action.payload}
            state.files = []
        })
        .addCase(getActiveConversationThunk.rejected, (state)=>{
            state.status = 'failed'
            console.log(state.status)
        })
        .addCase(getConversationMessagesThunk.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(getConversationMessagesThunk.fulfilled, (state, action)=>{
            state.status = 'success'
            state.error = ''
            state.messages= action.payload
        })
        .addCase(getConversationMessagesThunk.rejected, (state)=>{
            state.status = 'failed'
        })
        .addCase(sendMessageThunk.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(sendMessageThunk.fulfilled, (state, action)=>{
            state.status = 'success'
            state.error = ''
            state.messages= [...state.messages, action.payload.data]
            let conversation = action.payload.conversation
            // filtering conversations array which are not action.payload.conversation
            let ConvosExcludingConversation = state.conversations.filter((c)=>(c._id !== conversation._id))
            state.conversations = [conversation, ...ConvosExcludingConversation]
        })
        .addCase(sendMessageThunk.rejected, (state)=>{
            state.status = 'failed'
        })
        .addCase(createGroupConversationThunk.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(createGroupConversationThunk.fulfilled, (state, action)=>{
            state.status = 'success';
            state.error = '';

            const newConversation = action.payload;
            // console.log("conversation - ",newConversation)

            // Add new group to conversations list
            let ConvosExcludingNewConversation = state.conversations.filter((c)=>(newConversation._id !== c._id))
            let convos = [ newConversation, ...ConvosExcludingNewConversation]
            state.conversations = [...convos]
            // Clear previous messages and files
            state.messages = [];
            state.files = [];
        })
        .addCase(createGroupConversationThunk.rejected, (state, action)=>{
            state.status = 'failed';
            state.error = action.payload || action.error.message;
        })
    }    
})

export const { 
    setActiveConversation, 
    updateMessagesAction,
    addFiles,
    clearFiles,
    removeFileFromFiles,
    resetChat
 } = chatSlice.actions;

export default chatSlice.reducer














