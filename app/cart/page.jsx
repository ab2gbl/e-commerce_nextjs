'use client'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import Cart from '@/components/Cart';

export default function Product({ params }) {

    

  return (
    <Provider store={store}>

      <main >
        <Cart />
      </main>

    </Provider>
    
    
  );  
}
