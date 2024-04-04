'use client'
import { Provider } from 'react-redux'
import store from '@/redux/store'

import ProductsHome from '@/components/ProductsHome';
export default function Home() {


  return (
    <Provider store={store}>

      <main >
        <ProductsHome/>
      </main>

    </Provider>
    
  );  
}
