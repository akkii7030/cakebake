import { useEffect, useState } from 'react';
import { CartContext } from "pages/_app";
import { useContext } from "react";
import { useDispatch ,useSelector } from 'react-redux';
import Dropdown from "react-dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {usePlaceOrderMutation} from '../../../services/orderApi'
import { setOrder } from '../../../features/orderSlice';
import { getToken } from '../../../services/LocalStorageService';
const countries = [
  { label: "Virar", value: "Virar" },
  { label: "Nallasopara", value: "Nallasopara" },
  { label: "Vasai Road", value: "Vasai Road" },
  { label: "Naigaon", value: "Naigaon" },
  { label: "Bhayander", value: "Bhayander" },
  { label: "Mira Road", value: "Mira Road" },
  { label: "Dahisar", value: "Dahisar" },
  { label: "Borivali", value: "Borivali" },
  { label: "Kandivali", value: "Kandivali" },
  { label: "Malad", value: "Malad" },
  { label: "Goregaon", value: "Goregaon" },
  { label: "Ram Mandir", value: "Ram Mandir" },
  { label: "Jogeshwari", value: "Jogeshwari" },
  { label: "Andheri", value: "Andheri" },
  { label: "Vile Parle", value: "Vile Parle" },
  { label: "Santacruz", value: "Santacruz" },
  { label: "Khar Road", value: "Khar Road" },
  { label: "Bandra", value: "Bandra" },
  { label: "Mahim", value: "Mahim" },
  { label: "Matunga Road", value: "Matunga Road" },
  { label: "Dadar", value: "Dadar" },
  { label: "Prabhadevi", value: "Prabhadevi" },
  { label: "Lower Parel", value: "Lower Parel" },
  { label: "Mahalaxmi", value: "Mahalaxmi" },
  { label: "Mumbai Central", value: "Mumbai Central" },
  { label: "Grant Road", value: "Grant Road" },
  { label: "Charni Road", value: "Charni Road" },
  { label: "Marine Lines", value: "Marine Lines" },
  { label: "Churchgate", value: "Churchgate" },
];
const timezone = [
  { label: "10AM - 12PM", value: "10AM - 12PM" },
  { label: "12PM - 2PM", value: "12PM - 2PM" },
  { label: "2PM - 4PM", value: "2PM - 4PM" },
  { label: "4PM - 6PM", value: "4PM - 6PM" },
  { label: "6PM - 8PM", value: "6PM - 8PM" },
  { label: "8PM - 10PM", value: "8PM - 10PM" },
];



export const CheckoutStep1 = ({ onNext }) => {
  const dispatch = useDispatch()
  const { cart } = useContext(CartContext);
  const total = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );
  const [userData , setUserData]= useState({}) 
  const data = useSelector(state => state.user)
  const [PlaceOrder] = usePlaceOrderMutation()
  const  [city, setCity]= useState({}) 
  const  [time, setTime]= useState({}) 
  const [startDate, setStartDate] = useState(new Date());
  const [server_error, setServerError] = useState({});
  
  // Get user data from token
  const { access_token } = getToken();
  
  // Decode JWT token to get user ID
  const getUserIdFromToken = (token) => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (error) {
      return null;
    }
  };


  useEffect(() => {
      setUserData({
        id: data?.id || '',
        phone_Number: data?.phone_Number || '',
        first_Name: data?.first_Name || '',
        last_Name: data?.last_Name || '',
        street_Number: "",
        house_Number:"",
        city: "",
        area: "",
        note:" "
      })
  }, [data])

  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setUserData(values => ({ ...values, [name]: value }));
  };

  const handelSubmit = async (e) =>{ 
    e.preventDefault();
    
    // Prevent checkout with empty cart
    if (!cart || cart.length === 0) {
      alert('Your cart is empty. Please add items to cart before checkout.');
      return;
    }
    
    // Check if user is authenticated
    if (!access_token) {
      alert('User authentication required. Please login again.');
      return;
    }
    
    // Get user ID from token
    const userId = getUserIdFromToken(access_token);
    if (!userId) {
      alert('Invalid authentication. Please login again.');
      return;
    }
    
    if (!city || !time) {
      alert('Please select delivery city and time.');
      return;
    }
    
    // Validate numeric fields
    const streetNum = parseInt(userData.street_Number);
    const houseNum = parseInt(userData.house_Number);
    
    if (isNaN(streetNum) || streetNum <= 0) {
      alert('Please enter a valid street number.');
      return;
    }
    
    if (isNaN(houseNum) || houseNum <= 0) {
      alert('Please enter a valid house number.');
      return;
    }
    
    // Validate phone number (Indian format)
    const phoneRegex = /^((\+91)?(0091)?(91)?(0)?)?[6-9][0-9]{9}$/;
    if (userData.phone_Number && !phoneRegex.test(userData.phone_Number)) {
      alert('Please enter a valid Indian phone number (e.g., 9876543210)');
      return;
    }
    
    const actualData = {
      customer: userId,
      phone_Number: userData.phone_Number || '',
      address:{
        street_Number: streetNum,
        house_Number: houseNum,
        city: city,
        area: userData.area || '',
      },
      payment:{
        payment_Status: 'Pending',
        payment_Type:'Cash on Delivery',
        amount_Paid: 0
      },
      order_Status:'Order Pending',
      delivery_Charges: 50,
      total_Amount:total,
      note:userData.note || '',
      order_Delivery_Date : startDate,
      order_Delivery_Time : time,
      products: cart
    }

    console.log('Order data being sent:', actualData)
    console.log('User ID:', userData.id)
    const res = await PlaceOrder(actualData)

    if (res.error) {
      console.log(res.error)
      setServerError(res.error?.data?.errors || {})
    }
    if (res.data) {
      console.log(res.data)
      // Store Order Data in Redux Store
        dispatch(
          setOrder({
            id: res.data.order_Id ,
            order_Status: res.data.order_Status,
            order_Delivery_Date: res.data.order_Delivery_Date,
            order_Delivery_Time: res.data.order_Delivery_Time,
            total_Amount: res.data.total_Amount,
          })
        );
      onNext();
    } 
  }
  
  return (
    <>
      {/* <!-- BEING CHECKOUT STEP ONE -->  */}
      <div className="checkout-form">
        <form onSubmit={handelSubmit}>
          <div className="checkout-form__item">
            <h4>Info about you</h4>
            <div style={{display:'grid' , gridTemplateColumns:'repeat(2, 1fr)' , marginBottom:'1rem'}}>
              <div> 
                <h6>Name:</h6>
                <h6>Phone Number:</h6>
              </div>
              <div> 
                <h6>{userData.first_Name} {" "} {userData.last_Name}</h6>
                <h6>{userData.phone_Number}</h6>
              </div>
            </div>
            <div className="box-field">
              <input
                type="tel"
                className="form-control"
                placeholder="Enter your Phone Number (e.g., 9876543210)"
                name="phone_Number"
                onChange={handleChange}
                pattern="^((\+91)?(0091)?(91)?(0)?)?[6-9][0-9]{9}$"
              />
            </div>
           {server_error.phone_Number ? (
              <lable style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                {server_error.phone_Number[0]} </lable>) : ("")} 
          </div>
          <div className="checkout-form__item">
            <h4>Delivery Info</h4>
            <div className="box-field__row">
              <div className="box-field">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter the House Number"
                  name="house_Number"
                  onChange={handleChange}
                  required
                  min="1"
                />
                {server_error.house_Number ? (
              <lable style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                {server_error.house_Number[0]} </lable>) : ("")}
              </div>
              
              <div className="box-field">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter the Street Number"
                  name="street_Number"
                  onChange={handleChange}
                  required
                  min="1"
                />
                {server_error.street_Number ? (
              <lable style={{ fontSize: 16, color: "red"}}>
                {server_error.street_Number[0]} </lable>) : ("")} 
              </div> 
    
            </div>
            <div className="box-field__row">
              <div className="box-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter the Area (phase or Lane)"
                  name="area"
                  onChange={handleChange}
                  required
                />
                {server_error.area ? (
              <lable style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                {server_error.area[0]} </lable>) : ("")}
              </div>
              <div className="box-field">
              <Dropdown 
               options={countries}
               className="react-dropdown"
               onChange={(option)=> setCity(option.value)}
               placeholder="Select a City"
               required
               />
              </div>  
            </div>
            <h4>Delivery Date / Time </h4>
            <div className="box-field__row" style={{marginTop: "20px"}}>
              <div className="box-field">
              <span style={{paddingBottom: "20px"}}> Select Date</span>    
              <DatePicker className="box-field" selected={startDate} onChange={(date) => setStartDate(date)} />
              </div>
            <div className="box-field">
              <Dropdown 
              options={timezone}
              className="react-dropdown"
              onChange={(option)=> setTime(option.value)}
              placeholder="Delivery Time" 
              required 
            />
            </div>
            </div>
          </div>
          <div className="checkout-form__item">
            <h4>Note</h4>
            <div className="box-field box-field__textarea">
              <textarea
                className="form-control"
                placeholder="Order note"
                name='note'
                onChange={handleChange}
              ></textarea>
              {server_error.note ? (
              <lable style={{ fontSize: 16, color: "red"}}>
                {server_error.note[0]} </lable>) : ("")}
            </div>
            {/* <label className="checkbox-box checkbox-box__sm">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Create an account
            </label> */}
          </div>
          <div className="checkout-buttons">
            {/* <button className='btn btn-grey btn-icon'>
              {' '}
              <i className='icon-arrow'></i> back
            </button> */}
            <button type="submit" className="btn btn-icon btn-next">
              next <i className="icon-arrow"></i>
            </button>
          </div>
        </form>
      </div>
      {/* <!-- CHECKOUT STEP ONE EOF -->  */}
    </>
  );
};
