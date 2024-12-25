"use client";
import React from 'react'
import { Provider } from 'react-redux'
import { ReduxStore } from './stores'
 

type ReduxProviderProps = {
    children: React.ReactNode
}
export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={ReduxStore}>
        {children}
    </Provider>
  )
}
