import axios from "axios";

const initialState = [];
const GET_ALL_PRODUCTS = "GET_ALL_PRODUCTS";
const DELETE_PRODUCT = "DELETE_PRODUCT";
const EDIT_PRODUCT = "EDIT_PRODUCT";

export const _getAllProducts = (allProducts) => ({
  type: GET_ALL_PRODUCTS,
  allProducts,
});

export const _deleteProduct = (product) => ({
  type: DELETE_PRODUCT,
  product,
});

export const _editProduct = (product) => ({
  type: EDIT_PRODUCT,
  product,
});

export const getAllProducts = () => {
  return async (dispatch) => {
    try {
      const { data: products } = await axios.get("/api/products");
      dispatch(_getAllProducts(products));
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteProduct = (id, history) => {
  return async (dispatch) => {
    try {
      console.log("history", history);
      const { data: product } = await axios.delete(`/api/products/${id}`);
      dispatch(_deleteProduct(product));
      history.goBack();
    } catch (error) {
      console.log(error);
    }
  };
};

export const editProduct = (product, history) => {
  return async (dispatch) => {
    const { data: updated } = await axios.put(
      `/api/products/${product.id}`,
      product
    );
    dispatch(_editProduct(updated));
    history.push(`/products/${product.id}`);
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
      return action.allProducts;
    case DELETE_PRODUCT:
      return state.filter((product) => product.id !== action.product.id);
    case EDIT_PRODUCT:
      return state.map((product) =>
        product.id === action.product.id ? action.product : product
      );
    default:
      return state;
  }
};
