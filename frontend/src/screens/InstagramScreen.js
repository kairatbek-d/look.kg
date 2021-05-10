import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { listInstagramProducts } from '../actions/productActions';
import InstagramProduct from '../components/InstagramProduct';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function InstagramScreen() {
  const { pageNumber = 1, endCursor = '' } = useParams();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const productList = useSelector((state) => state.instagramProducts);
  const { loading, error, products, pages, end_cursor } = productList;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      listInstagramProducts({ seller: userInfo._id, endCursor })
    );
  }, [dispatch, pageNumber, userInfo._id, endCursor]);

  return (
    <div>
      <h2>Өзгөчөлөнгөн продукталар</h2>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {products.length === 0 && <MessageBox>Эч кандай товар табылган жок</MessageBox>}
          <div className="row center">
            {products.map((product) => (
              <InstagramProduct key={product.id} product={product}></InstagramProduct>
            ))}
          </div>
          <div className="row center pagination">
          {[...Array(pages).keys()].map((x) => (
            <Link
              className={x + 1 === pageNumber ? 'active' : ''}
              key={x + 1}
              to={`/instagram/pageNumber/${x + 1 ? x + 1: pageNumber}/endCursor/${end_cursor ? end_cursor : ''}`}
            >
              {x + 1}
            </Link>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
