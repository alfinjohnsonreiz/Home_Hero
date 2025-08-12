# Home_Hero

🏠 Home Hero
Home Hero is a service marketplace platform that connects homeowners with service providers.
Homeowners can post service requests, providers can send quotes, and upon acceptance, jobs are created with secure payments via Razorpay.

🚀 Features
👤 User Roles
Homeowner:

Register and log in

Create service requests

View & manage quotes from providers

Accept quotes to create jobs

Make secure payments via Razorpay

Service Provider:

Register and log in

Browse available service requests

Send quotes to homeowners

Manage accepted jobs

Track payment status

🛠 Tech Stack
Frontend
React.js

Material UI (MUI)

Axios for API calls

Backend
Node.js

Express.js

TypeORM (or Prisma, depending on your final implementation)

PostgreSQL (or your chosen database)

Razorpay SDK for payment integration

Other Tools
JWT Authentication

RESTful APIs

Cloud deployment ready

📦 Installation
Clone the repository

bash
Copy
Edit
git clone https://github.com/your-username/home-hero.git
cd home-hero
Install dependencies

Frontend:

bash
Copy
Edit
cd frontend
npm install
Backend:

bash
Copy
Edit
cd backend
npm install
Setup environment variables
Create .env files for both frontend and backend with:

Backend .env

env
Copy
Edit
PORT=4040
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=homehero
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
Frontend .env

env
Copy
Edit
VITE_API_URL=http://localhost:4040
VITE_RAZORPAY_KEY_ID=your_razorpay_key
Run the project

Backend:

bash
Copy
Edit
cd backend
npm run dev
Frontend:

bash
Copy
Edit
cd frontend
npm run dev
