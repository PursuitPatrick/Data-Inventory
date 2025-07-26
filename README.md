# AI Inventory Tracker

A modern, production-ready web application for manufacturing and warehouse companies to manage inventory, receiving, shipping, and tracking operations.

## Features

### 🏠 Dashboard
- **KPIs**: Total inventory, incoming items, outgoing items, items in transit
- **Activity Feed**: Real-time updates of recent actions (received, shipped, updated)
- **Quick Actions**: Easy access to common operations
- **Trends**: Placeholder for AI-powered analytics and charts

### 📦 Inventory Management
- **Comprehensive Table View**: Item ID, Name, SKU, Quantity, Location, Status, Last Updated
- **Advanced Filtering**: Filter by status, category, supplier
- **Search Functionality**: Find items quickly across all fields
- **CRUD Operations**: Add, edit, delete inventory items
- **Status Tracking**: In stock, Low stock, Reorder status with color-coded badges

### 📥 Receiving
- **Purchase Order Management**: Track incoming shipments with PO numbers
- **Multi-item Receipts**: Receive multiple items in a single transaction
- **File Upload**: Attach packing slips and documentation
- **Status Tracking**: Pending, Received, Overdue status with visual indicators
- **Receiver Tracking**: Record who received each shipment

### 📤 Shipping
- **Outgoing Shipment Management**: Create and track outgoing orders
- **Multi-carrier Support**: FedEx, UPS, DHL, USPS
- **Tracking Integration**: Generate and manage tracking numbers
- **Label Printing**: Print shipping labels (stub functionality)
- **Destination Management**: Complete shipping address handling

### 🔍 Item Detail View
- **Comprehensive Metrics**: Lifetime received/shipped quantities
- **Activity History**: Complete audit trail of all item movements
- **Location Tracking**: Full location history with user tracking
- **Stock Level Visualization**: Visual representation of current vs. min/max levels
- **Quick Actions**: Receive, ship, or adjust stock directly from detail view

## Technology Stack

- **Frontend**: React 18 with modern hooks
- **Styling**: TailwindCSS with custom design system
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router DOM for navigation
- **Date Handling**: date-fns for date formatting
- **Build Tool**: Vite for fast development and building
- **Charts**: Recharts (placeholder for future analytics)

## Design System

### Colors
- **Primary**: Blue (#3B82F6) - Main actions and branding
- **Success**: Green (#22C55E) - Positive states and received items
- **Warning**: Orange (#F59E0B) - Low stock and pending items
- **Danger**: Red (#EF4444) - Errors and reorder states

### Components
- **Cards**: Soft shadows with rounded corners for content sections
- **Buttons**: Consistent styling with hover states and loading indicators
- **Tables**: Sortable, searchable, and paginated data tables
- **Modals**: Reusable modal system for forms and dialogs
- **Status Badges**: Color-coded status indicators throughout the app

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-inventory-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with sidebar and top bar
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── TopBar.jsx      # Top navigation bar
│   ├── StatCard.jsx    # KPI metric cards
│   ├── DataTable.jsx   # Reusable data table component
│   └── Modal.jsx       # Modal dialog component
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Inventory.jsx   # Inventory management
│   ├── Receiving.jsx   # Receiving operations
│   ├── Shipping.jsx    # Shipping operations
│   └── ItemDetail.jsx  # Individual item details
├── App.jsx             # Main app component with routing
├── main.jsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Key Features

### Responsive Design
- Mobile-first approach with responsive breakpoints
- Collapsible sidebar for mobile devices
- Touch-friendly interface elements

### Performance Optimizations
- Lazy loading of components (ready for implementation)
- Efficient state management with React hooks
- Optimized re-renders with proper dependency arrays

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly components
- High contrast color scheme

### Future AI Integration Points
The application is designed with AI integration in mind:

1. **Dashboard Analytics**: Placeholder for AI-powered trend analysis
2. **Smart Reordering**: AI-driven reorder point calculations
3. **Demand Forecasting**: Predictive analytics for inventory planning
4. **Anomaly Detection**: AI-powered detection of unusual inventory patterns
5. **Automated Categorization**: AI classification of new items
6. **Optimization Suggestions**: AI recommendations for warehouse layout and stock levels

## Mock Data

The application currently uses mock data for demonstration purposes. In a production environment, replace the mock data with:

- **API Integration**: Connect to your backend services
- **Database**: PostgreSQL, MongoDB, or your preferred database
- **Authentication**: JWT, OAuth, or your authentication system
- **File Storage**: AWS S3, Google Cloud Storage for document uploads

## Customization

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the route to `src/App.jsx`
3. Add navigation link to `src/components/Sidebar.jsx`

### Styling Customization
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Use the existing design system classes for consistency

### Component Extension
- All components are designed to be reusable and extensible
- Use the existing prop patterns for consistency
- Follow the established naming conventions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Note**: This is a demonstration application with mock data. For production use, implement proper authentication, data validation, error handling, and connect to your backend services. 