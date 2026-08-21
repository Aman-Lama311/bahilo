import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import { logout } from '@/features/auth/authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include', // sends the httpOnly cookie with every request
});

const baseQueryWithAuthHandling = async (
  args: Parameters<typeof rawBaseQuery>[0],
  api: Parameters<typeof rawBaseQuery>[1],
  extraOptions: Parameters<typeof rawBaseQuery>[2]
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // Cookie expired / invalid / user no longer authenticated
  if (result.error?.status === 401) {
    api.dispatch(logout());

    // Avoid redirecting if already on login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',

  baseQuery: baseQueryWithAuthHandling,

  tagTypes: [
    'PrintLog',
    'Stock',
    'Student',
    'NotebookIssue',
    'Class',
    'Section',
    'Teacher',
    'Department',
    'NotebookType',
    'NotebookReason',
    'NotebookStock',
    'User',
  ],

  endpoints: () => ({}),
});