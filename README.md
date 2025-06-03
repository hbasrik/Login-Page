# Configuration Management Panel

This project is a **Vue 3 + Firebase Auth + Express (Node.js)** based configuration management panel for managing application parameters.

## Features

- User authentication (via Firebase Authentication)
- Add, edit, and delete configuration parameters
- Conflict prevention using `updatedAt` timestamps
- Secure RESTful API using Firebase ID tokens
- Responsive design with Tailwind CSS
- In-app alert notifications for user feedback

---

## Demo Credentials

You can test the project using the following demo account:

-**Email:** basri@gmail.com

-**Password:** 666666

This user has been created in Firebase by the admin. You can use this login to access the app **without setting up your own Firebase project**.

---

## Project Structure

root/

├── backend/ →

└── frontend/ →

# Requirements

- Node.js >= 18
- Git

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/hbasrik/Login-Page.git
cd Login-Page
```

```bash
cd backend
npm install
npm run dev

```

```bash
cd frontend
npm install
npm run dev

```

Once both the **frontend** and **backend** are running:

- Log in using the provided credentials
- Start managing your configuration parameters
- Any edits will be validated and conflict-checked
- Enjoy a clean, responsive, and secure experience

---

## Firebase Configuration

### Step 1: Get Firebase Admin Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to Project Settings > **"Service accounts"** tab
3. Click **"Generate new private key"** to download `serviceAccountKey.json`

### Step 2: Add Configuration to Project

#### Method A (Recommended): Environment Variable

1. Open the downloaded `serviceAccountKey.json` in a text editor
2. Copy **ALL content** (Ctrl+A/Cmd+A)
3. Paste into your `.env` file. Your `.env` file should look like below. (be careful with the format FIREBASE_CONFIG='You need to paste it here between '' '):

```
PORT=3000
FIREBASE_CONFIG='{
  "type": "service_account",
  "project_id": "YOUR-PROJECT-ID",
  "private_key_id": "123abc456def",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqh...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "12345678901234567890",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxx%40your-project-id.iam.gserviceaccount.com"
}'

```



#### Also your  `/frontend/.env` file should look like this:

```
VITE_API_BASE_URL=http://localhost:3000 // for the axios in api folder, you can change it during production process

VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abc123def456

```


---

### Important

**Firestore Collection Naming**
This project expects your Firestore database to use a collection named config. This name is hardcoded in the backend and is used to store and retrieve parameter records.

If you use a different collection name, you must manually update all occurrences of "config" in the backend code (e.g., db.collection("config")) to match your new collection name.

**Recommendation**

When setting up your Firestore database, create a collection named "config" to avoid any issues and ensure compatibility with the existing backend.
