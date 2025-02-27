import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import { getAllCategories, getAllProducts } from "../services/services";
import { dataReducer, initialState } from "../reducer/dataReducer";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setError(null);
      setProductsLoading(true);
      const response = await getAllProducts();
      if (response.status === 200 && response.data?.products) {
        dispatch({
          type: "GET_ALL_PRODUCTS_FROM_API",
          payload: response.data.products,
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setError(null);
      setCategoriesLoading(true);
      const response = await getAllCategories();
      if (response.status === 200 && response.data?.categories) {
        dispatch({
          type: "GET_ALL_CATEGORIES",
          payload: response.data.categories,
        });
      } else {
        throw new Error("Invalid categories response");
      }
    } catch (error) {
      setError("Failed to fetch categories");
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const value = {
    state,
    dispatch,
    productsLoading,
    categoriesLoading,
    error,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
