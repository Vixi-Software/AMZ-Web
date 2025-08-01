import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppRoute from './configs/router';
import React, { useEffect } from 'react';
import Loading from './components/features/Loading';
import ScrollToTop from './components/features/ScrollToTop';
import { useDispatch } from 'react-redux';
import { db } from "./utils/firebase";
import { useFirestore } from "./hooks/useFirestore";
import { deleteAllProducts, importProductByType } from './store/features/allProducts/allProductsSlice';

function AppContent() {
  const { getAllDocsWithSubcollections } = useFirestore(db);
  const dispatch = useDispatch();

  useEffect(() => {
    const collections = [
      "01-nhet-tai-cu",
      "02-chup-tai-cu",
      "03-di-dong-cu",
      "04-de-ban-cu",
      "05-loa-karaoke",
      "06-hang-newseal"
    ];

    const fetchData = async () => {
      const allProducts = await getAllDocsWithSubcollections(collections);
      dispatch(deleteAllProducts());
      allProducts.forEach((product) => {
        dispatch(importProductByType(product.collection, {...product}));
      });
      // console.log("all", allProducts)
    };
    fetchData();
    
  }, [dispatch, getAllDocsWithSubcollections]);
 


  return (
    <>
      <ScrollToTop />
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