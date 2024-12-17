import { createSlice, nanoid } from "@reduxjs/toolkit";

export const categoriesSlice = createSlice({
  name: "categories",
  initialState: [],
  reducers: {
    setCategories: (state, action) => {
      const categories = action.payload.map((item) => {
        return {
          categoryId: item.Categories.cat_1C_id,
          categoryName: item.Categories.category_name,
          categoryImage: item.Categories.category_image
        };
      });
console.log('categories', categories)
      return categories;
    },
  },
});

export const { setCategories } = categoriesSlice.actions;

export default categoriesSlice.reducer;
