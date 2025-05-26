// src/contexts/NavigateContext.js
import React, { createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

// Create Context for navigate
const NavigateContext = createContext()

export const useNavigateContext = () => {
  return useContext(NavigateContext)
}

export const NavigateProvider = ({ children }) => {
  const navigate = useNavigate()
  return <NavigateContext.Provider value={navigate}>{children}</NavigateContext.Provider>
}
