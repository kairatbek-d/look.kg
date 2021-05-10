import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { createProduct } from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';

export default function InstagramProduct({product}) {
  const history = useHistory()
  const dispatch = useDispatch();
  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const createHandler = () => {
    dispatch(createProduct({
      image: product.imageLink,
      description: product.text
    }));
  };

  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      history.push(`/product/${createdProduct._id}/edit`);
    }
  }, [createdProduct, dispatch, history, successCreate]);

  return (
    <div key={product.id} className="card">
      {loadingCreate && <LoadingBox></LoadingBox>}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
      <img className="medium" src={product.imageLink} alt={product.id} />
      <div className="card-body">
        <div>
            {product.text}
        </div>
        <div>{product.likes}</div>
        <button type="button" className="primary" onClick={createHandler}>
          Choose product
        </button>
      </div>
    </div>
  );
}
