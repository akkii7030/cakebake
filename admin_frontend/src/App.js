import React, { useEffect } from 'react'
import { BrowserRouter, Route, Navigate,Routes } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getToken } from './services/LocalStorageService';
import { setUserToken } from './features/authSlice';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './responsive.css';
import './enhanced-ux.css';
import './mobile-ux.css';
import './error-handling.css';
import './admin-responsive.css';
import {UserLogin,Logout, Question, CustomerEdit,AppLayout,AdminDashboard, Orders,OrderDetails,Customers,
  Designtool,CustomOrderDetails ,Sales,Notifications,Feedbacks,Staff,NewStaff, Products,ProductEdit
  ,NewProduct ,Profile } from "./adminExportFiles";


const theme = createTheme({
  palette: {
    primary: {
      main: '#DA627D',
      dark: '#A53860',
      light: '#E8899E'
    },
    secondary: {
      main: '#A53860',
      dark: '#8B2F56',
      light: '#C56B8A'
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff'
    },
    text: {
      primary: '#2c3e50',
      secondary: '#6c757d'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem'
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem'
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem'
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: '0 2px 10px rgba(218, 98, 125, 0.3)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 15px rgba(218, 98, 125, 0.4)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: 'none'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8
          }
        }
      }
    }
  }
});

function App() {
  const {access_token} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  // Initialize auth state from localStorage immediately
  const { access_token: storedToken } = getToken();
  const isAuthenticated = access_token || storedToken;
  
  useEffect(() => {
    if (storedToken && !access_token) {
      dispatch(setUserToken({ access_token: storedToken }));
    }
  }, [storedToken, access_token, dispatch]);
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="logout" element={<Logout /> } />
          <Route  path="login" element={ <UserLogin /> } />
          {/* admin routes */}
          <Route path="admin" element={isAuthenticated ? < AppLayout/>  : <Navigate to="/login" />} >
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={ <AdminDashboard />}/>
            <Route path="customers" element={<Customers />} />
            <Route path="customer/edit/:id" element={<CustomerEdit />} />
            <Route path="orders" element={<Orders />} />
            <Route path="order/details/:id" element={<OrderDetails/>} />
            <Route path="designtool" element={<Designtool />} />
            <Route path="customorder/details/:id" element={<CustomOrderDetails />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="question" element={<Question />} />
            <Route path="feedbacks" element={<Feedbacks />} />
            <Route path="products" element={<Products />} />
            <Route path="product/new" element={<NewProduct />} />
            <Route path="product/edit/:id" element={<ProductEdit />} />
            <Route path="profile" element={<Profile />} />
            <Route path="sales" element={<Sales />} />
            <Route path="staff" element={<Staff/>} />
            <Route path="staff/edit/:id" element={<CustomerEdit />} />
            <Route path="newstaff" element={<NewStaff/>} />
          </Route>
          <Route path="/" element={<h1> Please type /admin in URL email: "akhilesh@gmail.com" Password "Akhilesh" </h1>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
      </ThemeProvider>
  );
}
    
export default App;
