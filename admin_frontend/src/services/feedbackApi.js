import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints

export const feedbackApi = createApi({
  reducerPath: 'feedbackApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://127.0.0.1:8000/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllReview: builder.query({
      query: () => {
        return {
          url: 'feedback/all',
          method: 'GET', 
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getAllQuestion: builder.query({
      query: () => {
        return {
          url: `feedback/questions/`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }}
    }),
    postReview: builder.mutation({
      query: (review) => {
        return {
          url: `feedback/add`,
          method: 'POST',
          body: review,
          headers: {
            'Content-type': 'application/json',
          }
        }}
    }),
    postQusetion: builder.mutation({
      query: (Qusetion) => {
        return {
          url: `feedback/question/add`,
          method: 'POST',
          body: Qusetion,
          headers: {
            'Content-type': 'application/json',
          }
        }}
    }),
    deleteReview: builder.mutation({
      query: (id) => {
        return {
          url: `feedback/delete/${id}`,
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
          }
        }}
    }),
    deleteQuestion: builder.mutation({
      query: (id) => {
        return {
          url: `feedback/question/delete/${id}`,
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
          }
        }}
    }),
    
  }),
})

export const {useDeleteReviewMutation , useGetAllReviewQuery, usePostReviewMutation,usePostQusetionMutation,
  useGetAllQuestionQuery ,useDeleteQuestionMutation } = feedbackApi