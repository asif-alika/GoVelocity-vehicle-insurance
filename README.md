# GoVelocity Insurance 🚀

An end-to-end, highly scalable **Direct-to-Consumer (D2C) InsurTech Platform** designed to revolutionize the vehicle insurance lifecycle. Built on the modern MERN stack, GoVelocity bridges the heavy delays found in traditional insurance by offering users instantaneous policy coverage comparisons and hyper-fast digitized claim processing workflows managed by real-time agent adjudicators.

---

## 📖 Project Description

Traditional auto-insurance ecosystems rely on slow paperwork, physical damage surveyors, and confusing policy deductibles. GoVelocity Insurance solves this by moving exactly three critical components securely into a web interface:
1. **Clear Policy Offerings**: Transparent coverage arrays allowing users to evaluate exactly what is included.
2. **Instant Asset Registration**: Binding an active policy directly to a cataloged vehicle make/model instantly.
3. **Hyper-Speed Adjudication**: Enabling a 20-image "Damage Photo" upload capability allowing Agents to examine severe crash scenarios from a digital dashboard without ever leaving the office.

---

## ✨ Features & Functions

### 👤 Customer Portal
- **Secure Authentication:** JWT & BCrypt protected sessions.
- **Dynamic Plan Tiers:** Real-time browsing of `Basic`, `Standard`, `Premium`, and `Ultimate` policies with dynamically parsed coverage limits.
- **Garaging (Vehicle Management):** Securely register your car's plate and model.
- **Claim Workflow Engine:** Instantly file an Incident Report (Accident, Theft, Fire, etc.) combined safely with multiple high-resolution damage photos.

### 🛡️ Agent Review Dashboard
- **Policy Management Mapping:** Dynamic queries binding individual customers and policies directly to the Agent overseeing them.
- **Claim Processing Pipeline:** Visually inspect Customer-uploaded damage grid galleries.
- **State Manipulation:** Agents control the flow safely (`Under Review` → `Inspection` → `Settled`/`Rejected`).

---

## 🛠️ Tech Stack

**GoVelocity operates exclusively on a decoupled MERN Stack architecture.**

- **Frontend:** React.js 18 (Vite engine) utilizing standard Javascript.
- **Styling:** Custom Vanilla CSS3 leveraging modern CSS variables (No external bloated libraries like Tailwind or Bootstrap).
- **Backend:** Node.js (v18+) with Express.js REST APIs.
- **Database:** MongoDB Atlas (Cloud NoSQL) strictly manipulated via Mongoose ODM.
- **Core Dependencies:** `multer` (File handling), `jsonwebtoken` (Auth), `bcryptjs` (Hashing).

---

## ⚙️ Cloning & Configuration Guide (For New Computers)

Because this repository strictly ignores heavy auto-generated dependency files (`node_modules`) and secret passwords (`.env`), anyone cloning this repository must rebuild them locally.

### 1. Rebuild Dependencies
Run these commands instantly to download all required modules:
```bash
# In your terminal, navigate inside the server folder:
cd server
npm install

# Next, navigate inside the client folder:
cd ../client
npm install
```

### 2. Configure the Backend Environment
Inside your `server/` directory, create a hidden file named exactly: `.env`
Paste the following block into it, replacing the password string with your actual Database user password from your MongoDB Atlas dashboard:
```txt
PORT=5000
MONGODB_URI=mongodb+srv://<replace_username>:<replace_password>@cluster0.abcde.mongodb.net/govelocity_insurance?retryWrites=true&w=majority
JWT_SECRET=govelocity_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
```
*(⚠️ Note: Ensure your local computer IP Address is whitelisted globally (`0.0.0.0/0`) on your Atlas Network Access settings!)*

### 3. Seed the Base Data
To ensure your new cloud database isn't totally blank, run the official seed script exactly once carefully:
```bash
cd server
node scripts/seed.js
```
*This will inject dummy Agent accounts, Customer accounts, test Vehicles, and generic Coverages directly into your Cloud Cluster.*

---

## 🚀 Running the Project

You must boot both Node servers concurrently to bridge the internal HTTP API natively.

**Terminal 1 (Backend Host):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend React):**
```bash
cd client
npm run dev
```

The application client route will generate locally at exactly: `http://localhost:5173/`

### Test Credentials
- **Customer Sandbox:** `rahul@test.com` | Pw: `Test@1234`
- **Agent Dashboard:** `vikram@agent.com` | Pw: `Test@1234`
