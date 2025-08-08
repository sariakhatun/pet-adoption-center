
## 🐾 PetNect – Pet Adoption Center

### Description

PetNect is a modern, responsive web application that helps users adopt pets, create donation campaigns, and connect with other pet lovers. The platform offers smooth adoption request management, donation tracking, and admin moderation features.

### Live Project Link

PetNect Live Site : https://b11a12-sariakhatun.web.app/

### Technologies Used

* **Frontend:** React, Tailwind CSS, ShadCN UI, React Hook Form, React Router
* **Backend:** Node.js, Express.js, MongoDB
* **Authentication:** Firebase Authentication (Google & Email/Password)
* **Payments:** Stripe
* **State & Data Fetching:** TanStack Query, Axios
* **UI Icons:** Lucide React, React Icons
* **Notifications:** SweetAlert2



### Overview
PetNect is a user-friendly pet adoption platform that allows users to discover and adopt pets, create and manage donation campaigns, and connect with a community of pet lovers. With integrated authentication, payment support, and an admin dashboard, it streamlines pet adoption and donation management in a responsive and modern interface.

### Screenshot


![PetNect Dashboard Screenshot](src/assets/b11a12-sariakhatun.web.app_(Nest Hub Max).png)



---

### Core Features

* User registration/login with Firebase (Google & email/password)
* Browse adoptable pets and submit adoption requests through modals
* Add, manage, and view personal pet listings
* Create and track donation campaigns with progress bars
* Admin dashboard for user role management, pet, and donation moderation
* Responsive design with light/dark mode support
* Elegant error handling and loading states

### Dependencies

* react-router-dom
* firebase
* stripe
* axios
* react-hook-form
* @tanstack/react-query
* shadcn/ui
* lucide-react
* react-icons
* sweetalert2
* nodejs
* cors
* express js

---

### How to Run Locally

1. **Clone the repository:**
 ```bash
  git clone https://github.com/sariakhatun/pet-adoption-center
   cd pet-adoption-center
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup environment variables:**
   Create a `.env` file in the root with your Firebase, Stripe, and backend URLs/configs:

   ```
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

4. **Start the development server:**

   ```bash
   npm start
   ```

5. **Run backend separately:**
   Navigate to your backend folder and run:

   ```bash
   npm install
   npm run dev
   ```

6. **Open your browser at:**

   ```
   http://localhost:3000
   ```

---

