import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AppRoute from './configs/router';
import React, { useEffect, useState } from 'react';
import Loading from './components/features/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { db } from "./utils/firebase";
import { useFirestore } from "./hooks/useFirestore";
import { deleteAllProducts, importProductByType } from './store/features/allProducts/allProductsSlice';

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const { getAllDocsWithSubcollections } = useFirestore(db, 'home');
  const dispatch = useDispatch();
  const allProductsState = useSelector((state) => state.allProducts);

  const collections = [
    "01-nhet-tai-cu",
    "02-chup-tai-cu",
    "03-di-dong-cu",
    "04-de-ban-cu",
    "05-loa-karaoke",
    "06-hang-newseal"
  ];


  useEffect(() => {
    const fetchData = async () => {
      const allProducts = await getAllDocsWithSubcollections(collections);
      dispatch(deleteAllProducts());
      allProducts.forEach((product) => {
        dispatch(importProductByType(product.collection, {...product}));
      });

    };
    fetchData();
    
  }, []);
 


  return (
    <>
      <Routes>
        {AppRoute.map((route, index) => {
          const Layout = route.layout || React.Fragment;
          const Page = route.page;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  {/* {loading ? <Loading /> : null} */}

                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </>

  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;