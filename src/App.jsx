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
import CreateProductForm from './pages/CreateProductForm'
import FileUploadPage from './pages/FileUploadPage'
import WebFormPage from './pages/WebFormPage'
import CreateChildExpiration from './pages/CreateChildExpiration'
import CreateChildSerial from './pages/CreateChildSerial'
import ProductDetails from './pages/ProductDetails'
import ManageInventory from './pages/ManageInventory'
import InventoryByExpiration from './pages/InventoryByExpiration'
import InventoryBySerial from './pages/InventoryBySerial'
import InventoryBundles from './pages/InventoryBundles'
import InventoryKits from './pages/InventoryKits'
import InventorySnap from './pages/InventorySnap'
import InventoryLogValue from './pages/InventoryLogValue'
import ManageKits from './pages/ManageKits'
import ManageOrders from './pages/ManageOrders'
import CreateOrder from './pages/CreateOrder'
import OrderLookup from './pages/OrderLookup'
import RapidLookup from './pages/RapidLookup'
import AutomagicallyOrderSearch from './pages/AutomagicallyOrderSearch'
import RoutingRequests from './pages/RoutingRequests'
import ShippingLog from './pages/ShippingLog'
import CreateSalesOrderForm from './pages/CreateSalesOrderForm'
import OrderFileUploadPage from './pages/OrderFileUploadPage'
import ManagePOs from './pages/ManagePOs'
import CreatePO from './pages/CreatePO'
import POLookup from './pages/POLookup'
import ManageReturns from './pages/ManageReturns'
import CreateReturn from './pages/CreateReturn'
import ManageRework from './pages/ManageRework'
import ReceivingLog from './pages/ReceivingLog'
import StockActivity from './pages/StockActivity'
import MoveLog from './pages/MoveLog'
import AdHocReceiving from './pages/AdHocReceiving'
import CreateWorkOrders from './pages/CreateWorkOrders'
import ToolsLayout from './components/ToolsLayout'
import OrdersLayout from './components/OrdersLayout'
import ReturnsLayout from './components/ReturnsLayout'
import ReworkLayout from './components/ReworkLayout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/products" element={<InventoryLayout><ManageProducts /></InventoryLayout>} />
          <Route path="/create-products" element={<InventoryLayout><CreateProducts /></InventoryLayout>} />
          <Route path="/create-products/web-form" element={<InventoryLayout><CreateProductForm /></InventoryLayout>} />
          <Route path="/create-products/file-upload" element={<InventoryLayout><FileUploadPage /></InventoryLayout>} />
          <Route path="/create-child-expiration" element={<InventoryLayout><CreateChildExpiration /></InventoryLayout>} />
          <Route path="/create-child-serial" element={<InventoryLayout><CreateChildSerial /></InventoryLayout>} />
          <Route path="/products/details/:skuOrId" element={<ProductDetails />} />
          <Route path="/receiving" element={<Receiving />} />
          <Route path="/receiving/manage-pos" element={<ReceivingLayout><ManagePOs /></ReceivingLayout>} />
          <Route path="/receiving/create-po" element={<ReceivingLayout><CreatePO /></ReceivingLayout>} />
          <Route path="/receiving/po-lookup" element={<ReceivingLayout><POLookup /></ReceivingLayout>} />
          <Route path="/receiving/reports/log" element={<ReceivingLayout><ReceivingLog /></ReceivingLayout>} />
          <Route path="/create-po/web-form" element={<ReceivingLayout><WebFormPage /></ReceivingLayout>} />
          <Route path="/create-po/adhoc-receiving" element={<ReceivingLayout><AdHocReceiving /></ReceivingLayout>} />
          <Route path="/create-po/file-upload" element={<ReceivingLayout><FileUploadPage /></ReceivingLayout>} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<ManageReturns />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/receiving/log" element={<ReceivingLog />} />
          
          {/* Inventory Warehouse Routes - Each with distinct paths */}
          <Route path="/inventory/warehouse/manage-inventory" element={<ManageInventory />} />
          <Route path="/inventory/warehouse/inventory-bundles" element={<InventoryBundles />} />
          <Route path="/inventory/warehouse/inventory-kits" element={<InventoryKits />} />
          <Route path="/inventory/warehouse/inventory-by-expiration" element={<InventoryByExpiration />} />
          <Route path="/inventory/warehouse/inventory-by-serial" element={<InventoryBySerial />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/inventory/warehouse" element={<ManageInventory />} />
          <Route path="/inventory/bundles" element={<InventoryBundles />} />
          <Route path="/inventory/kits" element={<InventoryKits />} />
          <Route path="/inventory/expiration" element={<InventoryByExpiration />} />
          <Route path="/inventory/serial" element={<InventoryBySerial />} />
          
          {/* Stock Activity Route */}
          <Route path="/inventory/reports/stock-activity" element={<StockActivity />} />
          
          {/* Move Log Route */}
          <Route path="/inventory/reports/move-log" element={<MoveLog />} />
          
          {/* Inventory Log - Value Route */}
          <Route path="/inventory/reports/inventory-log-value" element={<InventoryLogValue />} />
          
          {/* Inventory Snap Route */}
          <Route path="/inventory/reports/inventory-snap" element={<InventorySnap />} />
          
          {/* Rework Route */}
          <Route path="/rework" element={<ManageRework />} />
          <Route path="/rework/create-work-orders" element={<CreateWorkOrders />} />
          <Route path="/rework/manage-kits" element={<ManageKits />} />
          
          {/* Orders Route */}
          <Route path="/orders" element={<ManageOrders />} />
          <Route path="/orders/create" element={<CreateOrder />} />
          <Route path="/orders/lookup" element={<OrderLookup />} />
          <Route path="/orders/rapid-lookup" element={<RapidLookup />} />
          <Route path="/orders/automagically-search" element={<AutomagicallyOrderSearch />} />
          <Route path="/orders/routing-requests" element={<RoutingRequests />} />
          <Route path="/orders/shipping-log" element={<ShippingLog />} />
          <Route path="/create-order/web-form" element={<CreateSalesOrderForm />} />
          <Route path="/create-order/file-upload" element={<OrderFileUploadPage />} />
          
          {/* Returns Route */}
          <Route path="/returns/create" element={<CreateReturn />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App 