import { createSlice } from "@reduxjs/toolkit";

const terminalSlice = createSlice({
    name: 'terminalState',
    initialState: {status:"offline"},
    reducers: {
        setTerminalState: (state, action) => {
            state.status = action.payload
        }
    }
    
}) 
 


export const { setTerminalState } = terminalSlice.actions;

export default terminalSlice.reducer;