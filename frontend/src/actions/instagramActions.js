export const listInstagramFeeds = () => async (dispatch) => {
    dispatch({
      type: PRODUCT_CATEGORY_LIST_REQUEST,
    });
    try {
      const { data } = await Axios.get(`/api/products/categories`);
      dispatch({ type: PRODUCT_CATEGORY_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: PRODUCT_CATEGORY_LIST_FAIL, payload: error.message });
    }
  };