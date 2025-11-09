import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import CreatePool from './pages/createpool';
import Layout from './components/layout'; // <-- 1. Import Layout

function App() {
  return (
    <Routes>
      {/* 1. The Login route has NO layout */}
      <Route path="/login" element={<Login />} />

      {/* 2. The Dashboard route is WRAPPED in the Layout */}
      <Route
        path="/"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />

      {/* 3. The Create Pool route is ALSO wrapped in the Layout */}
      <Route
        path="/create"
        element={
          <Layout>
            <CreatePool />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;