# Power House
Powerful housing system for small organization. Features below:
- Realtime score update — no manual reload needed.
- Configurable houses, students, and awards system.

## Project setup
1. [Installation](#installation)
2. [Setup Firebase](#setup-firebase)
3. [Project configuration](#project-configuration)
4. [Deploy](#deploy)

### Installation
First clone the repo. Then install the required node modules. 
```
npm install
```

### Setup Firebase
The database for this project is Firebase Realtime Database. Follow [official guide](#https://firebase.google.com/docs/database/web/start#create_a_database) to create one.

Here's the Firebase rules for this project:
```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

After setting up the database, head to the **Authentication** page. Enable *Email/Password* as the sign-in method.

You will need to create a Admin. Click *Add User* and enter your desired email and password. Take note of the *User UID* of your newly created admin.

Let's log the admin in the database. Head to **Database** and create a new node "admins", under "admins" create a new node with your *User UID*. Under the *User UID* create two node: "name", which you enter your username, and perm, which must be set to "Admin". Sample node structure below:
```
|- admins
    |- JnHPC1JIeBCtK3gy7a5P4JsK3Xu1
        |- "Steven Wang"
        |- "Admin"
```

> Note the letter case of keywords.

Finally, in your project setting, find and copy your Firebase SDK config for later use. Sample below:
```javascript
const firebaseConfig = {
  apiKey: "YPHIsS3GL5I9BIUlK0kZPM_AIzaSyB2gTGUGrHX",
  authDomain: "power-house-60f86.firebaseapp.com",
  databaseURL: "https://power-house-12345.firebaseio.com",
  projectId: "power-house-12345",
  storageBucket: "power-house-12345.appspot.com",
  messagingSenderId: "734834083290",
  appId: "1:734834083290:web:fb73e7fba8922164826cdc",
  measurementId: "F-SRPMTDFSLB"
};
```

### Project Configuration
In your project folder, navigate to `src/`. In there create a new file `secret.js`. Paste the previously found Firebase config like the below template:
```javascript
export default {
  // paste Firebase config here
  apiKey: "YPHIsS3GL5I9BIUlK0kZPM_AIzaSyB2gTGUGrHX",
  authDomain: "power-house-60f86.firebaseapp.com",
  databaseURL: "https://power-house-12345.firebaseio.com",
  projectId: "power-house-12345",
  storageBucket: "power-house-12345.appspot.com",
  messagingSenderId: "734834083290",
  appId: "1:734834083290:web:fb73e7fba8922164826cdc",
  measurementId: "F-SRPMTDFSLB"
}
```

Optionally, you can change the site title and many other features by changing the values in `.env`.

### Deploy
Finally, to deploy the application, run:
```
npm run build
```
After build finish, run the `dist/index.html` on a HTTP server like `nginx` or `apache2`. Power house should then be ready to use.
On the webapp login as admin with the admin account you created on Firebase. From then on everything could be managed from the webapp. Follow the instructions in the **Admin** tab to setup houses, students. and awards.