# 🔥 Firebase Setup Guide (Hindi & English)

FitLiving website ko "Dynamic" banane ke liye ye steps follow karein. Isse aap bina code change kiye products add/remove kar payenge.

---

### Step 1: Create Project (Project Banao)
1. Go to **[Firebase Console](https://console.firebase.google.com/)** (Google account se login karein).
2. Click on **"Create a project"** (ya "Add project").
3. Project Name: `FitLiving` daalein.
4. **Google Analytics**: "Disable" kar dein (abhi zaroorat nahi hai).
5. Click **"Create Project"**.

---

### Step 2: Get Config Keys (Keys Copy Karo)
1. Project banne ke baad, "Project Overview" page pe **web icon (`</>`)** pe click karein (ye iOS aur Android icons ke bagal me hoga).
2. **App Nickname**: `FitLiving Website` likhein aur **Register app** click karein.
3. Ab aapko ek code block dikhega jisme `const firebaseConfig = { ... }` hoga.
4. Sirf **firebaseConfig** ke andar wala data copy karein.
   
   *Aisa dikhega:*
   ```javascript
   apiKey: "AIzaSyD...",
   authDomain: "fitliving-....firebaseapp.com",
   projectId: "fitliving-...",
   storageBucket: "...",
   messagingSenderId: "...",
   appId: "..."
   ```

---

### Step 3: Paste in File (File me Paste Karo)
1. Apne computer pe is file ko open karein:
   `public/js/firebase-config.js`
2. Wahan pe `firebaseConfig` variable dhoondhein aur placeholder data hata kar apna **copied data paste** kar dein.

---

### Step 4: Setup Database (Database On Karo)
**Ye step zaroori hai products save karne ke liye!**

1. Firebase Console me wapis jayein.
2. Left Menu se **"Build"** -> **"Firestore Database"** pe click karein.
3. **"Create Database"** pe click karein.
4. **Database ID**: `(default)` rehne dein.
5. **Location**: `asia-south1` (Mumbai) ya `asia-southeast1` (Singapore) select karein (jo paas ho).
6. **Security Rules**:
   * **Start in Test mode** select karein (Easy setup).
   * Click **Enable**.

---

### Step 5: Setup Storage (Image Upload ke liye)
**Ye step zaroori hai product images upload karne ke liye!**

1. Firebase Console me left menu se **"Build"** -> **"Storage"** pe click karein.
2. **"Get Started"** button pe click karein.
3. **Security Rules** dialog me:
   * **Start in Test mode** select karein.
   * Click **Next**.
4. **Location**: Wahi select karein jo Firestore me select kiya tha (e.g., `asia-south1`).
5. **Done** click karein.

**Important**: Test mode 30 days ke liye hai. Baad me production rules lagana padega.

---

### 🎉 Done!
Ab aap `admin.html` khol ke passcode `fitliving123` daal ke products add kar sakte hain. Wo turant website pe dikhenge!
