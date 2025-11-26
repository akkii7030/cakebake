import { useState, useEffect } from 'react';
import { ProfileAside } from './ProfileAside/ProfileAside';
import { ProfileOrders } from './ProfileOrders/ProfileOrders';
import { ProfileDesignOrders} from './ProfileDesignOrders/ProfileDesignOrders';
import { useSelector, useDispatch } from "react-redux";
import { getToken } from '../../services/LocalStorageService';
import { useGetLoggedUserQuery } from '../../services/userAuthApi';
import { setUserInfo } from '../../features/userSlice';

export const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const { access_token } = getToken();
  const { data: userData, isSuccess, isLoading } = useGetLoggedUserQuery();
  
  // Load user data into Redux store
  useEffect(() => {
    if (userData && isSuccess) {
      dispatch(setUserInfo({
        id: userData.id,
        first_Name: userData.first_Name,
        last_Name: userData.last_Name,
        email: userData.email,
        phone_Number: userData.phone_Number,
        type: userData.type,
      }));
    }
  }, [userData, isSuccess, dispatch]);

  const [activeTab, setActiveTab] = useState('orders');
  
  if (isLoading) {
    return <div>Loading user data...</div>;
  }
  
  return (
    <>
      {/* <!-- BEGIN PROFILE --> */}
      <div className='profile'>
        <div className='wrapper'>
          <div className='profile-content'>
            <ProfileAside />
            <div className='profile-main'>
              <div className='tab-wrap'>
                <ul className='nav-tab-list tabs'>
                  <li
                    onClick={() => setActiveTab('myInfo')}
                    className={activeTab === 'myInfo' ? 'active' : ''}
                  >
                    My info
                  </li>
                  <li
                    onClick={() => setActiveTab('orders')}
                    className={activeTab === 'orders' ? 'active' : ''}
                  >
                    My orders
                  </li>
                   <li
                    onClick={() => setActiveTab('wishList')}
                    className={activeTab === 'wishList' ? 'active' : ''}
                  >
                    Cake Design Order
                  </li> 
                </ul>

                <div className='box-tab-cont'>
                  {activeTab === 'myInfo' && (
                    <div className='tab-cont' id='profile-tab_1'>
                      <div style={{display:'flex'}} > 
                        <div style={{flex:"1.5"}}> 
                         <h5> First Name</h5>
                         <h5> Last Name</h5>
                         <h5> Email</h5>
                         <h5> Phone Number</h5>
                        </div>
                        <div style={{flex:"1.5"}}> 
                        <h5> {user.first_Name}</h5>
                         <h5> {user.last_Name}</h5>
                         <h5> {user.email}</h5>
                         <h5>{user.phone_Number}</h5>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'orders' && <ProfileOrders />}

                  {activeTab === 'wishList' && <ProfileDesignOrders />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          className='promo-video__decor js-img'
          src='/assets/img/promo-video__decor.jpg'
          alt=''
        />
      </div>
      {/* <!-- PROFILE EOF   --> */}
    </>
  );
};
