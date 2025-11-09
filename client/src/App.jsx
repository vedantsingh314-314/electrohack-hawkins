import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Use correct casing as per the project file structure
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreatePool from './pages/CreatePool.jsx';
import Layout from './components/Layout.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

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