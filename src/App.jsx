import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Receiving from './pages/Receiving'
import Shipping from './pages/Shipping'
import ItemDetail from './pages/ItemDetail'
import ManageProducts from './pages/ManageProducts'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/products" element={<ManageProducts />} />
          <Route path="/receiving" element={<Receiving />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/item/:id" element={<ItemDetail />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App 