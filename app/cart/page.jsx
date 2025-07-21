'use client'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import Cart from '@/components/Cart';
import withRole from "@/utils/withRole";


function Product({ params }) {

    

  return (
    <Provider store={store}>

      <main >
        <Cart />
      </main>

    </Provider>
    
    
  );  
}

export default withRole(Product, ["ADMIN", "CLIENT"]);

