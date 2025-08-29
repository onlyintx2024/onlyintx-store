import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Check for existing item with same variantId (more precise than id + size)
      const existingItem = state.items.find(
        item => item.variantId === action.payload.variantId || 
                (item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color)
      )
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            (item.variantId === action.payload.variantId || 
             (item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color))
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          )
        }
      }
      
      return {
        ...state,
        items: [...state.items, action.payload]
      }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.variantId === action.payload.variantId || 
            (item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color))
        )
      }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          (item.variantId === action.payload.variantId || 
           (item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color))
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }
    
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  
  // Add convenience method for adding items to cart
  const addToCart = (item) => {
    context.dispatch({
      type: 'ADD_TO_CART',
      payload: item
    })
  }
  
  return {
    ...context,
    addToCart
  }
}