import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOutStore, refreshAccessToken } from "../redux/features/authSlice";

let navigate;
export const setNavigate = (nav) => {
  navigate = nav;
};

// const baseQuery = fetchBaseQuery({
//   baseUrl: "http://localhost:6006/api",
//   prepareHeaders: (headers, { getState }) => {
//     const token = getState().authLocal.token;
//     // console.log('window.electron', window.electron)
//     // const token = window.electron.store.get("token");
//     console.log("prepareHeaders token", token);
//     if (token) {
//       headers.set("authorization", `Bearer ${token}`);
//     }

//     return headers;
//   },
// });

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);
//   console.log("baseQueryWithReauth result", result);
//   // Check if the access token has expired (e.g., 401 Unauthorized response)
//   if (result.error && result.error.status === 401) {
//     // Try to refresh the token
//     const refreshResult = await baseQuery(
//       {
//         url: "/auth/store/refresh-token", // Your refresh token endpoint
//         method: "POST",
//         body: {
//           refreshToken: api.getState().authLocal.refreshToken, // Get refresh token from state
//           // refreshToken: window.electron.store.get("refreshToken"),
//         },
//       },
//       api,
//       extraOptions
//     );

//     if (refreshResult.data) {
//       // If refresh is successful, save the new token in the state
//       console.log("Dispatching refreshAccessToken with:", refreshResult.data);
//       await api.dispatch(
//         refreshAccessToken({ token: refreshResult.data.token })
//       );
//       //  window.electron.store.set("token", refreshResult.data.token);
//       //  await new Promise(resolve => setTimeout(resolve, 100));
//       const newToken = api.getState().authLocal.token;
//       // const newToken = window.electron.store.get("token");
//       console.log("Token after refreshAccessToken dispatch:", newToken);
//       // Retry the original request with the new token
//       result = await baseQuery(
//         {
//           ...args,
//           headers: {
//             ...args.headers,
//             authorization: `Bearer ${newToken}`,
//           },
//         },
//         api,
//         extraOptions
//       );
//     } else {
//       // If refresh fails, log the user out
//       api.dispatch(logOutStore());
//       if (navigate) {
//         navigate("/");
//         console.log("navigate /, refresh fails "); // Redirect to the login page
//       } else {
//         console.error("Navigate function not available");
//       }
//     }
//   }

//   return result;
// };
const baseQuery = async (args, api, extraOptions) => {
  // Get token from Electron's main process using ipcRenderer
  const token = await window.electron.ipcRenderer.invoke("get-token");
  // console.log("prepareHeaders token from ipcRenderer:", token);

  // Add token to headers if available
  const headers = args.headers || {};
  if (token) {
    headers["authorization"] = `Bearer ${token}`;
  }

  // Call fetchBaseQuery with updated headers
  return fetchBaseQuery({
    baseUrl: "http://localhost:6006/api",
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  })(args, api, extraOptions);
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Initial API call
  let result = await baseQuery(args, api, extraOptions);
  // console.log("baseQueryWithReauth result:", result);

  // Check if the access token has expired (e.g., 401 Unauthorized response)
  if (result.error && result.error.status === 401) {
    // Try to get the refresh token from Electron's store
    const refreshToken = await window.electron.ipcRenderer.invoke(
      "get-refresh-token"
    );
    // console.log("refreshToken from ipcRenderer", refreshToken);

    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQuery(
        {
          url: "/auth/store/refresh-token", // Your refresh token endpoint
          method: "POST",
          body: { refreshToken }, // Pass the refresh token to the backend
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // If refresh is successful, save the new token in the state and Electron's store
        const newToken = refreshResult.data.token;
        await api.dispatch(refreshAccessToken({ token: newToken }));
        await window.electron.ipcRenderer.invoke("set-token", newToken); // Save new token in Electron store

        // Retry the original request with the new token
        result = await baseQuery(
          {
            ...args,
            headers: {
              ...args.headers,
              authorization: `Bearer ${newToken}`,
            },
          },
          api,
          extraOptions
        );
      } else {
        // If refresh fails, log the user out
        api.dispatch(logOutStore());
        console.error("Refresh token failed, logging out.");
      }
    } else {
      console.error("No refresh token available, logging out.");
      api.dispatch(logOutStore());
    }
  }

  return result;
};

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Pruducts", "Cart"],
  endpoints: (build) => ({
    loginStore: build.mutation({
      query: (data) => ({
        url: `auth/store/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    logoutStore: build.query({
      query: (data) => ({
        url: `auth/store/logout`,
        method: "GET",
        body: data,
      }),
      providesTags: ["Auth"],
    }),
    getAllProducts: build.query({
      query: ({ page, size, filter, subcategory, division }) => {
        console.log("getAllProducts division", division);

        return {
          url: "/products",
          method: "GET",
          params: { page, size, filter, subcategory, division },
        };
      },
      providesTags: ["Products"],
    }),
    getSingleProduct: build.query({
      query: ({ barcode }) => ({
        url: "/products/single",
        method: "GET",
        params: { barcode },
      }),
      transformResponse: (response) => response, // Normal response
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return { error: "Product not found" }; // Custom error message
        }
        return response;
      },
      providesTags: ["Products"],
    }),
    getProductById: build.query({
      query: ({ comboId }) => ({
        url: "/products/product",
        method: "GET",
        params: { comboId },
      }),
      providesTags: ["Products"],
    }),
    getStoreSaleProducts: build.query({
      query: () => ({
        url: "/config/store-sale",
        method: "GET",
      }),
    }),
    buyProducts: build.mutation({
      query: (products) => ({
        url: `cart/buy`,
        method: "POST",
        body: products,
      }),
      invalidatesTags: ["Cart", "Products"],
    }),
    searchProducts: build.query({
      query: ({ searchQuery }) => {
        if (!searchQuery) return null;
        return {
          url: "/products/search",
          method: "GET",
          params: { searchQuery },
        };
      },
    }),
    cancelBuyProducts: build.mutation({
      query: (products) => ({
        url: `cart/cancel`,
        method: "POST",
        body: "",
      }),
      invalidatesTags: ["Cart"],
    }),
    getMerchantData: build.query({
      query: () => ({
        url: "/config/merchant",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginStoreMutation,
  useLogoutStoreQuery,
  useGetAllProductsQuery,
  useBuyProductsMutation,
  useSearchProductsQuery,
  useCancelBuyProductsMutation,
  useGetProductByIdQuery,
  useGetSingleProductQuery,
  useGetStoreSaleProductsQuery,
  useGetMerchantDataQuery
} = storeApi;
