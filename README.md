
# 💊 Medicine Reminder - Smart Healthcare Assistant

A comprehensive web application that helps users manage their medicines with timely notifications and emergency support. Built with Next.js, TypeScript, and Firebase.

## 🌟 Features

### 📅 Medicine Expiry Tracker
- Automatic expiry date monitoring
- Advance warnings for medicine replacement
- Batch tracking for multiple medicine packages
- Safety notifications to prevent expired medicine consumption

### 🆘 Emergency SOS Button
- One-click emergency assistance
- Instant contact to pre-specified emergency contacts
- Location sharing with emergency alerts
- Medical history access for first responders

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Firebase (Firestore, Authentication, Cloud Messaging)
- **Notifications**: Web Push API, Service Workers
- **PWA**: Progressive Web App capabilities
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medicine-reminder-app.git
   cd medicine-reminder-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your configuration:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Twilio Configuration (for SMS)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

4. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication (Email/Password, Google)
   - Enable Cloud Messaging
   - Add your domain to authorized domains
   - Generate a private key for admin SDK

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Firebase Setup

1. **Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only access their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /medicines/{medicineId} {
         allow read, write: if request.auth != null && 
           request.auth.uid == resource.data.userId;
       }
       match /reminders/{reminderId} {
         allow read, write: if request.auth != null && 
           request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

2. **Cloud Messaging Setup**
   - Generate VAPID keys in Firebase Console
   - Add VAPID keys to environment variables
   - Configure service worker for background notifications

### PWA Configuration

The app is configured as a Progressive Web App with:
- Service worker for offline functionality
- Web app manifest for installation
- Push notifications support
- Background sync capabilities

## 📱 Usage

### Adding Medicines
1. Use the dashboard
2. Provide medicine name, dosage, frequency, and expiry date
3. Set up reminder times
4. Configure notification preferences

### Setting Reminders
- Automatic reminders based on medicine schedule
- 15-minute advance notifications
- Multiple notification methods
- Snooze and skip options

### Emergency SOS
1. Add emergency contacts in settings
2. Use the red SOS button for emergencies
3. Location and medical info shared automatically
4. Contacts notified via SMS/call

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── dashboard/         # Dashboard pages
├── components/            # React components
│   └── EmergencySOSButton.tsx  # Emergency SOS
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Firebase configuration
│   └── notifications.ts   # Notification service
├── types/                 # TypeScript type definitions
├── styles/                # Global styles
└── hooks/                # Custom React hooks

public/
├── sw.js                 # Service worker
├── manifest.json         # PWA manifest
└── icons/               # App icons
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
npm run build
firebase deploy
```

### Docker
```bash
docker build -t medicine-reminder .
docker run -p 3000:3000 medicine-reminder
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help or have questions:

- 📧 Email: support@mediremind.app
- 💬 Discord: [Join our community](https://discord.gg/mediremind)
- 📖 Documentation: [docs.mediremind.app](https://docs.mediremind.app)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/medicine-reminder-app/issues)

## 🏥 Medical Disclaimer

This application is for informational purposes only and is not intended to replace professional medical advice. Always consult with healthcare professionals for medical decisions.

## 🎯 Roadmap

- [ ] Voice reminders and commands
- [ ] Integration with pharmacy APIs
- [ ] Family member access and monitoring
- [ ] Advanced analytics and insights
- [ ] Wearable device integration
- [ ] Multi-language support
- [ ] Offline-first capabilities
- [ ] Insurance integration

---

**Made with ❤️ for better health outcomes**
