
# 🤖 AI Assistant – Full Stack ChatGPT-Style Application

A full-stack AI Assistant web application built using **Django**, **Django REST Framework**, **MySQL**, and **Google Gemini API**, featuring a **ChatGPT/Gemini-style professional UI**, real-time chat, chat history, syntax-highlighted code responses, and robust error handling.

---

## 🚀 Features

- 🧠 AI-powered chat using **Google Gemini (latest models)**
- 🗨️ ChatGPT / Gemini-style responsive UI
- 📂 Sidebar with **New Chat** and **Delete Chat**
- 💾 Chat history stored in **MySQL**
- ⚡ REST API architecture (DRF)
- 🎨 Modern dark UI (HTML, CSS, JavaScript)
- 🧩 Syntax highlighting for code (Prism.js)
- 📋 Copy-friendly code blocks
- 🔁 Retry & fallback handling for AI overload (503 errors)
- 🔐 Secure API key management using `.env`

---

## 🛠️ Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- MySQL
- Google Gemini API (`google-genai`)

### Frontend
- HTML5
- CSS3 (Responsive, Dark Theme)
- JavaScript (Fetch API)
- Prism.js (Syntax Highlighting)

---

## 📁 Project Structure



ai-assistant-django/
│
├── chat/
│ ├── views.py
│ ├── urls.py
│ ├── models.py
│ ├── serializers.py
│ └── gemini.py
│
├── config/
│ ├── settings.py
│ ├── urls.py
│ └── wsgi.py
│
├── templates/
│ └── chat.html
│
├── static/
│ ├── css/
│ │ └── style.css
│ └── js/
│ └── chat.js
│
├── .env
├── .gitignore
├── manage.py
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/adnanfarooqui01/ai-assistant-django.git
cd ai-assistant-django

### 2️⃣ Create Virtual Environment
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

3️⃣ Install Dependencies
pip install django djangorestframework mysqlclient python-dotenv google-genai

4️⃣ Configure Environment Variables

Create a .env file in the root directory:

GEMINI_API_KEY=your_gemini_api_key_here


⚠️ Do NOT commit .env to GitHub

5️⃣ MySQL Database Setup

Create database:

CREATE DATABASE ai_assistant_db;


Update config/settings.py:

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'ai_assistant_db',
        'USER': 'root',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

6️⃣ Run Migrations
python manage.py makemigrations
python manage.py migrate

7️⃣ Run Server
python manage.py runserver


Open in browser:

http://127.0.0.1:8000/api/chat/

🔌 API Endpoints
🔹 Ask AI
POST /api/chat/ask/


Request

{
  "message": "Explain Django in one line"
}


Response

{
  "user_message": "...",
  "ai_response": "...",
  "created_at": "..."
}

🔹 Chat History
GET /api/chat/history/

🧠 AI Integration Details

Uses latest Google Gemini models

Handles:

Model overload (503)

Retry with backoff

Graceful fallback responses

Secure API key loading via .env

🎨 UI Highlights

ChatGPT-style sidebar and layout

Fully responsive (desktop, tablet, mobile)

Syntax-highlighted AI code responses

Optimistic UI updates

Typing indicator

Clean UX for developers

🧪 Example Use Cases

Programming help (Python, JS, Django)

Code generation

Translation

Explanation of concepts

Structured responses with code blocks

📌 Resume Description (Use This)

Developed a full-stack AI Assistant using Django REST Framework, MySQL, and Google Gemini API, featuring a ChatGPT-style responsive UI, real-time AI chat, database-backed history, syntax-highlighted code responses, and robust error handling.

🔮 Future Enhancements

User authentication

Multi-chat sessions in DB

Markdown editor support

Voice input

Deployment (Render / Railway)

Docker support

🤝 Contributing

Pull requests are welcome.
For major changes, please open an issue first.

📄 License

This project is for educational and portfolio purposes.

🙌 Acknowledgements

Google Gemini API

Django & DRF community

Prism.js


