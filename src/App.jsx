import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import InventoryLayout from './components/InventoryLayout'
import ReceivingLayout from './components/ReceivingLayout'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Receiving from './pages/Receiving'
import Shipping from './pages/Shipping'
import ItemDetail from './pages/ItemDetail'
import ManageProducts from './pages/ManageProducts'
import CreateProducts from './pages/CreateProducts'
import FileUploadPage from './pages/FileUploadPage'
import WebFormPage from './pages/WebFormPage'
import CreateChildExpiration from './pages/CreateChildExpiration'
import CreateChildSerial from './pages/CreateChildSerial'
import ProductDetails from './pages/ProductDetails'
import ManagePOs from './pages/ManagePOs'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/products" element={<InventoryLayout><ManageProducts /></InventoryLayout>} />
          <Route path="/create-products" element={<InventoryLayout><CreateProducts /></InventoryLayout>} />
          <Route path="/create-products/web-form" element={<InventoryLayout><WebFormPage /></InventoryLayout>} />
          <Route path="/create-products/file-upload" element={<InventoryLayout><FileUploadPage /></InventoryLayout>} />
          <Route path="/create-child-expiration" element={<InventoryLayout><CreateChildExpiration /></InventoryLayout>} />
          <Route path="/create-child-serial" element={<InventoryLayout><CreateChildSerial /></InventoryLayout>} />
          <Route path="/products/details/:skuOrId" element={<ProductDetails />} />
          <Route path="/receiving" element={<Receiving />} />
          <Route path="/receiving/manage-pos" element={<ReceivingLayout><ManagePOs /></ReceivingLayout>} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/item/:id" element={<ItemDetail />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App 