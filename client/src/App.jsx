import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreatePool from './pages/CreatePool.jsx';

// Layout
import Layout from './components/Layout.jsx';

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Layout Routes */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/create-pool/:type"
        element={
          <Layout>
            <CreatePool />
          </Layout>
        }
      />
      <Route
        path="/join-pools/:type"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
