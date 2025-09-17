import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id && item.type === action.payload.type
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id && item.type === action.payload.type
              ? {
                  ...item,
                  quantity: item.quantity + (action.payload.quantity || 1),
                }
              : item
          ),
        };
      } else {
        return {
          ...state,
          items: [
            ...state.items,
            { ...action.payload, quantity: action.payload.quantity || 1 },
          ],
        };
      }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.id === action.payload.id && item.type === action.payload.type
            )
        ),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id && item.type === action.payload.type
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case "SET_CART_OPEN":
      return {
        ...state,
        isOpen: action.payload,
      };

    case "CALCULATE_TOTAL":
      const total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      return {
        ...state,
        total,
        itemCount,
      };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Calculate total whenever items change
  useEffect(() => {
    dispatch({ type: "CALCULATE_TOTAL" });
  }, [state.items]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("wedding-commerce-cart");
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        cartData.items.forEach((item) => {
          dispatch({
            type: "ADD_ITEM",
            payload: item,
          });
        });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(
      "wedding-commerce-cart",
      JSON.stringify({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
      })
    );
  }, [state.items, state.total, state.itemCount]);

  const addItem = (item) => {
    dispatch({
      type: "ADD_ITEM",
      payload: item,
    });
  };

  const removeItem = (id, type) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: { id, type },
    });
  };

  const updateQuantity = (id, type, quantity) => {
    if (quantity <= 0) {
      removeItem(id, type);
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, type, quantity },
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const setCartOpen = (isOpen) => {
    dispatch({
      type: "SET_CART_OPEN",
      payload: isOpen,
    });
  };

  const getItemQuantity = (id, type) => {
    const item = state.items.find(
      (item) => item.id === id && item.type === type
    );
    return item ? item.quantity : 0;
  };

  const isInCart = (id, type) => {
    return state.items.some((item) => item.id === id && item.type === type);
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen,
    getItemQuantity,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

