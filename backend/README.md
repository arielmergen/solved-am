# Backend API Candidates

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   - Copy .env.example to .env
   - Update DATABASE_URL if needed

3. Run migrations:
   ```bash
   npm run prisma:migrate
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## API Endpoints
- POST /api/candidates - Create candidate
- GET /api/candidates - List candidates
- GET /api/candidates/:id - Get candidate
- PUT /api/candidates/:id - Update candidate
- DELETE /api/candidates/:id - Delete candidate
- POST /api/candidates/:id/cv - Upload CV 