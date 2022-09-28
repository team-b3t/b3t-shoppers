import axios from "axios";
import { token } from "morgan";

const initialState = [];
const GET_ALL_PRODUCTS = "GET_ALL_PRODUCTS";
const DELETE_PRODUCT = "DELETE_PRODUCT";
const EDIT_PRODUCT = "EDIT_PRODUCT";
const CREATE_PRODUCT = "CREATE_PRODUCT";
const TOKEN = "token";

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

export const _createProduct = (product) => ({
  type: CREATE_PRODUCT,
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
      const token = window.localStorage.getItem(TOKEN);
      if (token) {
        const { data: product } = await axios.delete(`/api/products/${id}`, {
          headers: {
            authorization: token,
          },
        });
        dispatch(_deleteProduct(product));
        history.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const editProduct = (product, history) => {
  return async (dispatch) => {
    try {
      const token = window.localStorage.getItem(TOKEN);
      if (token) {
        const { data: updated } = await axios.put(
          `/api/products/${product.id}`,
          product,
          {
            headers: {
              authorization: token,
            },
          }
        );
        dispatch(_editProduct(updated));
        history.push(`/products/${product.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const newProduct = (product, history) => {
  return async (dispatch) => {
    try {
      const token = window.localStorage.getItem(TOKEN);
      if (token) {
        const { data: created } = await axios.post(
          `/api/products/new`,
          product,
          {
            headers: {
              authorization: token,
            },
          }
        );
        dispatch(_createProduct(created));
      }
      history.push(`/products/${created.id}`);
    } catch (error) {
      console.log(error);
    }
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
    case CREATE_PRODUCT:
      return [...state, action.product];
    default:
      return state;
  }
};
