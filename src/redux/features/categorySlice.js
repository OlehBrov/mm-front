import { createSlice, nanoid } from "@reduxjs/toolkit";

export const categoriesSlice = createSlice({
  name: "categories",
  initialState: [],
  reducers: {
    // setCategories: (state, action) => {
    //   const allCategories = new Set(); // Use a Set to automatically handle unique values

    //   action.payload.forEach((item) => {
    //     const categories = item.Products.ProductCategories.map((cat) => cat.Categories.category_name); // Split categories and trim whitespace
    //     categories.forEach((category) => allCategories.add(category)); // Add each category to the Set
    //   });

    //   const uniqueCategories = Array.from(allCategories);
    //   return uniqueCategories.map((el) => ({
    //     name: el,
    //     id: nanoid(),
    //   }));
    // },
    setCategories: (state, action) => {
      const categoryMap = new Map(); // Use a Map to handle unique categories by id

     const categories = action.payload.map((item) => {
        // item.Products.ProductCategories.forEach((cat) => {
        //   const { category_name, category_id } = cat.Categories;
        //   // Add to Map with category_id as the key to ensure uniqueness
        //   categoryMap.set(category_id, {
        //     name: category_name,
        //     id: category_id,
        //   });
        // });
        return {
          categoryId: item.Categories.category_id,
          categoryName: item.Categories.category_name,
        }
      });

      return categories
    },
  },
});

export const { setCategories } = categoriesSlice.actions;

export default categoriesSlice.reducer;
