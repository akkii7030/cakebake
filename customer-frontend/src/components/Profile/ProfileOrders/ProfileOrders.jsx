import orderData from 'data/orders/orders';
import { useState } from 'react';
import { Card } from './Card/Card';
import { useSelector } from "react-redux";
import {useGetOrdersQuery} from '../../../services/orderApi'

export const ProfileOrders = () => {
  const user = useSelector(state => state.user)
  const [active, setActive] = useState(-1);
  const response = useGetOrdersQuery(user.id, { skip: !user.id });
  
  if (!user.id) return <div>Loading user data...</div>;
  if (response.isLoading) return <div>Loading orders...</div>;
  if (response.isError) return <h6>An error occurred: {response.error?.data?.message || 'Failed to load orders'}</h6>;
  
  const orders = response.data ? response.data.slice().reverse() : [];

  const handleCollapse = (indx) => {
    if (active === indx) {
      setActive(-1);
    } else {
      setActive(indx);
    }
  };
  return (
    <>
      <div className='profile-orders'>
        <div className='profile-orders__row profile-orders__row-head'>
          <div className='profile-orders__col'>date</div>
          <div className='profile-orders__col'>Delivery address</div>
          <div className='profile-orders__col'>amount</div>
          <div className='profile-orders__col'>Status</div>
        </div>
        {orders.map((order, index) => (
          <Card
            key={index}
            index={index}
            onCollapse={handleCollapse}
            order={order}
            active={active}
          />
        ))}
      </div>
    </>
  );
};
