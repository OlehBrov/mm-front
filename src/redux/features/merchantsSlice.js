import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  merchantsData: {
    defaultMerchant: "",
    isSingleMerchant: false,
    status: "",
    useVATbyDefault: false,
    vatExciseMerchant: "",
    noVATTaxGroup: 0,
    VATTaxGroup: 0,
    VATExciseTaxGroup: 0
  },
};

const merchantsSlice = createSlice({
  name: "merchant",
  initialState,
  reducers: {
    setMerchantsData: (state, action) => {
      return (state = action.payload);
    },
    clearMerchantsData: (state) => {
      return (state = {
        defaultMerchantId: 0,
        VATMerchantId: 0,
        useVATOnly: false,
        useSingleMerchant: false,
      });
    },
  },
});

export const { setMerchantsData, clearMerchantsData } = merchantsSlice.actions;

export default merchantsSlice.reducer;
