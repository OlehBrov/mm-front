import { createSlice } from "@reduxjs/toolkit";


const detailedProductSlice = createSlice({
    name: "detailedProduct",
    initialState: {},
    reducers:{ 
        addDetailedProduct: (state, action) => {
          
            return action.payload;
        },
        clearDetailedProduct: () => {
           return {}
        }
    
    }
})

export const {
 addDetailedProduct,clearDetailedProduct
} = detailedProductSlice.actions;

export default detailedProductSlice.reducer;