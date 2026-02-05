# HeartNote

A modern note-taking application with card-based organization. Built with Next.js 14+, FastAPI, and PostgreSQL.

## 🚀 Tech Stack

### Frontend

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

### Backend

- **FastAPI** - Modern Python web framework
- **SQLAlchemy 2.0** - Async ORM
- **Pydantic v2** - Data validation
- **PostgreSQL** - Database with JSONB support

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
HeartNote/
├── client/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/
│   │   │   └── ui/           # Base UI components (Atomic design)
│   │   ├── features/         # Domain-based modules
│   │   │   ├── auth/         # Authentication feature
│   │   │   └── editor/       # Card editor feature
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and configs
│   │   └── types/            # TypeScript interfaces
│   └── Dockerfile
├── server/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/v1/           # Route handlers
│   │   │   ├── endpoints/    # Individual route files
│   │   │   ├── deps.py       # Dependencies (auth, etc.)
│   │   │   └── router.py     # API router
│   │   ├── core/             # Configuration & security
│   │   ├── db/               # Database connection
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic layer
│   │   └── main.py           # Application entry point
│   ├── tests/                # Pytest tests
│   └── Dockerfile
├── docker-compose.yml        # Container orchestration
├── .env.example              # Environment template
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- Python 3.12+ (for local backend development)

### Quick Start with Docker

1. **Clone and setup environment**

   ```bash
   cp .env.example .env
   # Edit .env with your secrets
   ```

2. **Start all services**

   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/api/v1/docs

### Local Development

#### Backend

```bash
cd server
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd client
npm install
npm run dev
```

## 🔧 Configuration

Environment variables are defined in `.env.example`. Key variables:

| Variable              | Description                  | Default               |
| --------------------- | ---------------------------- | --------------------- |
| `DATABASE_URL`        | PostgreSQL connection string | -                     |
| `SECRET_KEY`          | Application secret key       | -                     |
| `JWT_SECRET_KEY`      | JWT signing key              | -                     |
| `CORS_ORIGINS`        | Allowed CORS origins         | http://localhost:3000 |
| `NEXT_PUBLIC_API_URL` | Backend API URL              | http://localhost:8000 |

## 📦 Adding New Card Types

The architecture supports easy addition of new card types:

### Backend

1. Add new type to `app/core/constants.py` → `CardType` enum
2. Create content schema in `app/schemas/card.py`
3. Add validation logic if needed

### Frontend

1. Define content type in `src/types/index.ts`
2. Create editor component in `src/features/editor/editors/`
3. Register in `src/features/editor/CardEditor.tsx`

## 🧪 Testing

```bash
# Backend tests
cd server
pytest

# Frontend type checking
cd client
npm run type-check
```

## 📄 License

MIT
