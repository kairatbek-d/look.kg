import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/userActions';
import Axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_DETAILS_RESET, USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

export default function ProfileScreen(props) {
  const dispatch = useDispatch();
  const sellerMode = props.match.path.indexOf('/registerCompany') >= 0;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerLogo, setSellerLogo] = useState('');
  const [sellerDescription, setSellerDescription] = useState('');

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const {
    success: successUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
  } = userUpdateProfile;

  useEffect(() => {
    if(successUpdate) {
      sellerMode ?
      alert("You have successfully registered. You need to wait for your store to approve.")
        : alert("Profile Updated Successfully")
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch({ type: USER_DETAILS_RESET });
    }
    if (!user) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(detailsUser(userInfo._id));
    } else {
      setName(user.name);
      setEmail(user.email);
      if (user.seller) {
        setSellerName(user.seller.name);
        setSellerLogo(user.seller.logo);
        setSellerDescription(user.seller.description);
      }
    }
  }, [dispatch, props.history, userInfo._id, user, successUpdate, sellerMode]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Password and Confirm Password Are Not Matched');
    } else {
      dispatch(
        updateUserProfile({
          userId: user._id,
          name,
          email,
          password,
          sellerName,
          sellerLogo,
          sellerDescription,
        })
      );
    }
  };

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setLoadingUpload(true);
    try {
      const { data } = 
      await Axios.post('/api/uploads/delete', {sellerLogo}).then( res => {
        return Axios.post('/api/uploads/brand', bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`
          }
        })
      });
      setSellerLogo(data);
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            {loadingUpdate && <LoadingBox></LoadingBox>}
            {errorUpdate && (
              <MessageBox variant="danger">{errorUpdate}</MessageBox>
            )}
            {((user && user.isSeller) || !sellerMode) && (
              <>
                <div>
                  <h1>User Profile</h1>
                </div>
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  ></input>
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  ></input>
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  ></input>
                </div>
                <div>
                  <label htmlFor="confirmPassword">confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Enter confirm password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  ></input>
                </div>
              </>)}
            {((user && user.isSeller) || sellerMode) && (
              <>
                <h2>Seller Profile</h2>
                <div>
                  <label htmlFor="sellerName">Seller Name</label>
                  <input
                    id="sellerName"
                    type="text"
                    placeholder="Enter Seller Name"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="sellerLogo">Seller Logo</label>
                  <input
                    id="sellerLogo"
                    type="text"
                    placeholder="Choose seller logo"
                    value={sellerLogo}
                    onChange={(e) => setSellerLogo(e.target.value)}
                    disabled
                  ></input>
                </div>
                <div>
                  <label htmlFor="imageFile">Image File</label>
                  <input
                    type="file"
                    id="imageFile"
                    label="Choose Image"
                    onChange={uploadFileHandler}
                  ></input>
                  {loadingUpload && <LoadingBox></LoadingBox>}
                  {errorUpload && (
                    <MessageBox variant="danger">{errorUpload}</MessageBox>
                  )}
                </div>
                <div>
                  <label htmlFor="sellerDescription">Seller Description</label>
                  <input
                    id="sellerDescription"
                    type="text"
                    placeholder="Enter Seller Description"
                    value={sellerDescription}
                    onChange={(e) => setSellerDescription(e.target.value)}
                  ></input>
                </div>
              </>
            )}
            <div>
              {sellerMode ?
                <>
                  <label />
                  <button className="primary" type="submit">
                    Register
                  </button>
                </> :
                <>
                  <label />
                  <button className="primary" type="submit">
                    Update
                  </button>
                </>
              }
            </div>
          </>
        )}
      </form>
    </div>
  );
}
