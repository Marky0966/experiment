# G11 STEM ITIS A1 — setup
Open login.html to try it in demo mode (data stays in your own browser).
## Turn on live shared chat + Google login (Firebase, free)
1. console.firebase.google.com → create project → add a Web app → copy the config.
2. Paste it into `const CFG={...}` at the top of app.js.
3. Authentication → enable Google and Anonymous. Add your site's domain under Authorized domains.
4. Firestore Database → create → Rules → paste:
```
rules_version='2';service cloud.firestore{match /databases/{d}/documents{
 function owner(){return request.auth!=null&&request.auth.token.email=='dapidran9@gmail.com'}
 match /lessons/{id}{allow read:if request.auth!=null;allow create:if request.auth!=null&&(request.resource.data.ok==false||owner());allow update:if owner();allow delete:if owner()||resource.data.uid==request.auth.uid}
 match /chat/{id}{allow read,create:if request.auth!=null}
 match /logins/{id}{allow create:if request.auth!=null;allow read:if owner()}
 match /alerts/{id}{allow read:if request.auth!=null;allow write:if owner()}
}}
```
5. Host the folder (Firebase Hosting, GitHub Pages or Netlify) so classmates can open the same link.
