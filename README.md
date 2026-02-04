# 🛒 Groceries Delivery App

A comprehensive React Native (Expo) application for managing a groceries delivery business. Built for sellers to manage products, orders, inventory, analytics, and more.

![Expo](https://img.shields.io/badge/Expo-52.0.28-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.76.7-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6.svg)

## 📱 Features

### Dashboard & Home
- 📊 Real-time sales analytics and charts
- 📈 Order statistics (new, preparing, delivered)
- 🔔 Push notifications center
- 🔍 Search orders and customers
- 📱 QR code scanner for order tracking

### Product Management
- ➕ Create, edit, and delete products
- 📁 Category and subcategory management
- 💰 Dynamic pricing with profit calculations
- 📸 Image upload and management
- 📦 Inventory tracking with low stock alerts
- 🏷️ SKU and barcode support

### Order Management
- 📋 View all orders with filtering
- 🔄 Track order status (new → accepted → preparing → ready → assigned → out for delivery → delivered)
- 💬 Customer communication
- 📄 Invoice generation and sharing
- 🔐 OTP verification for delivery

### Analytics
- 👥 Customer behavior analysis
- 📊 Sales reports and trends
- 🎯 Customer segmentation
- 📈 Product performance metrics
- 💵 Revenue tracking

### Wallet & Finances
- 💰 Balance tracking
- 💳 Payout requests
- 📜 Transaction history
- 📑 Tax reports

### Delivery Management
- 🚚 Delivery boy assignment
- 📍 Route optimization
- 📦 Delivery tracking
- ✅ Delivery confirmation with OTP

### Store Settings
- 🏪 Store profile management
- ⏰ Working hours configuration
- 🔔 Notification preferences
- 📋 Return policies

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS only) or Android Emulator

### Installation

1. Clone the repository
```bash
git clone https://github.com/ay-lynkd/groceries-casestudy.git
cd groceries-casestudy
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npx expo start
```

4. Run on your preferred platform
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for Web
- Scan QR code with Expo Go app on physical device

## 📁 Project Structure

```
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation screens
│   ├── analytics/           # Analytics screens
│   ├── auth/                # Authentication screens
│   ├── orders/              # Order management
│   ├── products/            # Product management
│   ├── store/               # Store settings
│   └── wallet/              # Wallet and finances
├── components/
│   ├── primitives/          # Reusable UI components (Button, Input, Card)
│   ├── features/            # Feature-specific components
│   ├── common/              # Shared components (Header, Loading, etc.)
│   └── modals/              # Modal dialogs
├── contexts/                # React Context providers
│   ├── AuthContext.tsx
│   ├── OrderContext.tsx
│   ├── ProductContext.tsx
│   └── WalletContext.tsx
├── hooks/                   # Custom React hooks
├── mocks/                   # Mock data for development
├── theme/                   # Theme configuration
├── types/                   # TypeScript type definitions
└── utils/                   # Utility functions
```

## 🛠️ Tech Stack

- **Framework:** React Native with Expo
- **Navigation:** Expo Router (file-based routing)
- **State Management:** React Context API
- **Styling:** StyleSheet with custom theme system
- **Icons:** Ionicons (@expo/vector-icons)
- **Charts:** Custom chart components
- **Storage:** AsyncStorage for local data
- **Notifications:** Expo Notifications

## 📱 Screenshots

| Home | Products | Orders | Analytics |
|------|----------|--------|-----------|
| Dashboard with stats | Product listing | Order management | Sales charts |

## 🔧 Key Features Implemented

### 1. Folder Structure Reorganization
- `components/primitives/` - Atomic UI components
- `components/features/` - Feature-specific components
- `mocks/` - Mock data separated from code

### 2. ScrollView & FlatList Optimization
- Fixed ScrollView + FlatList conflicts
- Proper keyboard handling
- Optimized list performance

### 3. Product Creation Wizard
- Multi-step form with validation
- TextInput fields for all product data
- Category selection
- Image upload simulation

### 4. Order Tracking
- Real-time status updates
- Timeline visualization
- OTP verification for delivery

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
API_URL=https://your-api-url.com

# Firebase (if using)
FIREBASE_API_KEY=your_key
FIREBASE_PROJECT_ID=your_project

# Other services
STRIPE_PUBLIC_KEY=your_key
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 📦 Building for Production

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
```bash
cd ios
xcodebuild -workspace GroceriesDeliveryApp.xcworkspace -scheme GroceriesDeliveryApp -configuration Release
```

### Expo EAS Build
```bash
# Configure EAS
npx eas-cli@latest configure

# Build for Android
npx eas build --platform android

# Build for iOS
npx eas build --platform ios
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Expo](https://expo.dev) for the amazing React Native framework
- [React Native](https://reactnative.dev) community
- [Ionicons](https://ionicons.com) for beautiful icons

## 📞 Support

For support, email support@example.com or join our Slack channel.

---

Built with ❤️ using React Native and Expo
