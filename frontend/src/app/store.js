import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import storage from "redux-persist/lib/storage";
import userSlice from "../controller/UserReducer";
import chatSlice from "../controller/ChatReducer";

const savefilter = createFilter('user', ['user'])

const persistConfig = {
    key: "user",
    storage,
    whitelist:['user'],
    transforms: [savefilter]
}

const rootReducer = combineReducers({
    user:userSlice,
    chat:chatSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({  serializableCheck:false }),
    // reducer: rootReducer,
    devTools:true  // to see every thing in development
})

export const persistor = persistStore(store)



