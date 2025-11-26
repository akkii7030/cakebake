import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from './LocalStorageService'

// Define a service using a base URL and expected endpoints
export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://127.0.0.1:8000/',
    prepareHeaders: (headers) => {
      const { access_token } = getToken()
      if (access_token) {
        headers.set('authorization', `Bearer ${access_token}`)
      }
      return headers
    }
  }),
  endpoints: (builder) => ({
    orderedProducts: builder.query({
      query: (id) => {
        return {
          url: `order/orderdProducts/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }}
    }),
    placeOrder: builder.mutation({
      query:(order) => {
        return {
          url: 'order/placeOrder',
          method: 'POST',
          body: order,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    updateOrder: builder.mutation({
      query:(order) => {
        const {id, ...rest} = order
        return {
          url: `order/update/${id}`,
          method: 'PUT',
          body: rest,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getOrders: builder.query({
      query: (id) => {
        return {
          url: `/order/user/orders/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
  }),
})

export const { useGetOrdersQuery, useOrderedProductsQuery,usePlaceOrderMutation, useUpdateOrderMutation } = orderApi