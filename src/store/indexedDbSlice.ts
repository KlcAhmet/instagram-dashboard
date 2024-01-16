import { createSlice } from "@reduxjs/toolkit"

export type TIndexedDb = {
  connected: boolean
  loading: boolean
  error: any
}

const indexedDbSlice = createSlice({
  name: "indexedDb",
  initialState: <TIndexedDb>{
    connected: false,
    loading: false,
    error: null
  },
  reducers: {
    setConnected: (state, action) => {
      console.log("setConnected action.payload", action.payload)
      return {
        ...state,
        connected: action.payload
      }
    },
    setLoading: (state, action) => {
      console.log("setLoading action.payload", action.payload)
      return {
        ...state,
        loading: action.payload
      }
    },
    setError: (state, action) => {
      console.log("setError action.payload", action.payload)
      return {
        ...state,
        setError: action.payload
      }
    }
  }
})
export const { setConnected, setLoading, setError } = indexedDbSlice.actions

export default indexedDbSlice.reducer
