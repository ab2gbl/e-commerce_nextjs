'use client'
import React from 'react';
import { Provider } from 'react-redux'
import store from '@/redux/store'
import NewProduct from '@/components/NewProduct';
export default function NewProductPage() {
    return (
        <Provider store={store}>

        <main >
            <NewProduct/>
        </main>

        </Provider>
    
    
  );
}