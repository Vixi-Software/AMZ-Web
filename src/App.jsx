import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AppRoute from './configs/router';
import React, { useEffect, useState } from 'react';
import Loading from './components/features/Loading';
import { useSelector } from 'react-redux';

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const isLoading = useSelector((state) => state.loading.isLoading);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname, isLoading]);


  return (
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
                {loading ? <Loading /> : null}
                <Page />
              </Layout>
            }
          />
        );
      })}
    </Routes>
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