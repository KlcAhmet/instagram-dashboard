import { combineReducers, configureStore } from "@reduxjs/toolkit"
import type { TypedUseSelectorHook } from "react-redux"
import { useDispatch, useSelector } from "react-redux"

import indexedDbSlice from "./indexedDbSlice"
import userSlice from "./userSlice"


// Here you can add all your reducers
const combinedReducers = combineReducers({
  user: userSlice,
  indexedDb: indexedDbSlice
})

// Until persistReducer is fixed, we need to use this mock store to get the types
export const store = configureStore({
  reducer: combinedReducers
})

// Get the types from the mock store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Export the hooks with the types from the mock store
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
