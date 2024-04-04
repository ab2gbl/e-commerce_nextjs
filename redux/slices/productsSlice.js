import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

	export const getProducts = createAsyncThunk('getProducts',async ()=>{
		const data = await fetch('http://127.0.0.1:8000/product/products/')
		return await data.json()
	})
    export const getProduct = createAsyncThunk('getProduct',async (param)=>{
        
        const data = await fetch('http://127.0.0.1:8000/product/product/'+param.id)
        return await data.json()
	})
	export const productsSlice = createSlice({
	  name: 'products',
	  initialState:{
		isProductsLoading: true,
	    products: [],
		erro: false,
        product: {},
        isProductLoading: true
	  },
	  extraReducers: (builder) =>{
        // Products
		builder.addCase(getProducts.pending,(state, action)=>{
			state.isProductsLoading = true
		})
		builder.addCase(getProducts.fulfilled,(state, action)=>{
			state.isProductsLoading = false ;
			state.products = action.payload
		})
		builder.addCase(getProducts.rejected,(state, action)=>{
			state.error = true
		})
        // Product
        builder.addCase(getProduct.pending,(state, action)=>{
			state.isProductLoading = true
		})
		builder.addCase(getProduct.fulfilled,(state, action)=>{
			state.isProductLoading = false ;
			state.product = action.payload
		})
		builder.addCase(getProduct.rejected,(state, action)=>{
			state.error = true
		})


	  }
	    
	  },
	)
	

	export const { increment } = productsSlice.actions

	export default productsSlice.reducer