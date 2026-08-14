# ProposalAI - Intelligent Sales Pipeline & CRM

ProposalAI is a full-stack, AI-driven CRM designed to completely automate the sales and onboarding pipeline for digital agencies. It acts as an autonomous Sales Manager by ingesting incoming leads, utilizing **Groq (Llama 3.3)** to score them based on business logic, and automatically generating and emailing customized PDF proposals to high-value prospects.

## 🚀 Features

- **Automated AI Lead Scoring:** Inbound leads are instantly analyzed and scored (0-100) based on budget, timeline, and requirement clarity.
- **Dynamic Business Logic Routing:**
  - **Cold Leads (< 50):** Automatically rejected to save time.
  - **Warm Leads (50 - 79):** Drafts a proposal and awaits human review in the CRM.
  - **Hot Leads (80 - 100):** Automatically generates a branded PDF proposal and dispatches it directly to the client's email via Resend.
- **Beautiful Dashboard:** A premium, fully responsive React dashboard to manage the sales pipeline, view analytics, and review AI-generated proposals.
- **Real-time PDF Generation:** Utilizes `reportlab` to compile complex JSON project requirements into beautifully formatted, branded PDF documents.

## 🛠️ Technology Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Framer Motion, Recharts
- **Backend:** FastAPI (Python), SQLite, SQLAlchemy, JWT Authentication
- **AI/LLM:** Groq API (Llama 3.3 70B Versatile) for high-speed requirement extraction and scoring
- **Email Delivery:** Resend API

---

## 💻 How to Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup
Navigate to the backend directory and install the required dependencies:
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory with your API keys (see `.env.example`):
```env
GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
```

Seed the database and start the server:
```bash
python seed.py
uvicorn app.main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

## 🧪 Demo Instructions & Credentials

To test the application as an administrator, go to `http://localhost:5173/login` and use the following seeded credentials:

> **Admin Login Details:**
> - **Email:** `admin@proposalai.com`
> - **Password:** `admin123`

### Testing the AI Pipeline (Client View)
1. Navigate to the public form at `http://localhost:5173/demo`.
2. Fill out the lead form. 
   - *Tip to test automation:* Request an enterprise application with a massive budget (e.g., $100,000) to ensure the AI assigns a score > 80.
3. Submit the form.
4. **Behind the scenes:** The FastAPI backend will call Groq, extract the requirements, determine it is a "Hot Lead", generate the PDF, and send the email.
5. Log into the Admin Dashboard to view the newly processed lead and the drafted proposal!

---
*Built as a technical demonstration of full-stack engineering, AI automation, and premium UI/UX design.*
