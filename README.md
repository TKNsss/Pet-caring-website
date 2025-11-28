# Pet Caring Website

## Gioi thieu ngan gon
Ung dung quan ly dich vu cham soc thu cung: frontend Vite/React, backend ASP.NET Core API, PostgreSQL, Upload Cloudinary, OTP email, SSO Google/GitHub, JWT.

## Cong nghe chinh
- Backend: ASP.NET Core 8, Entity Framework Core (PostgreSQL), AutoMapper, JWT, OTP email, Cloudinary.
- Frontend: React 19 + Vite 6, Redux Toolkit, react-router-dom 7, i18next, TailwindCSS 4 beta, framer-motion, react-toastify.
- Bao mat XSS: React tu dong escape text; cac cho render HTML i18n deu duoc sanitize qua DOMPurify (`sanitizeHtml`) truoc `dangerouslySetInnerHTML`.
- Docker: anh API (Dockerfile goc), anh frontend (ClientApp/Dockerfile, Nginx), Postgres anh chinh thuc. Secrets doc tu file `.env` (khong commit).

## Cau truc thu muc
- Pet-caring-website/ : ASP.NET Core backend (.csproj)
  - Controllers, Services, Interfaces, DTOs, Models, Data/AppDbContext, Configurations, Helpers, Middleware, wwwroot
- ClientApp/ : React + Vite SPA
  - src/api, components, redux, hooks, constants, assets, shares, utils, App.jsx, main.jsx, index.css
- docker-compose.yml, Dockerfile (API), ClientApp/Dockerfile, .env.example

## Cai dat & chay local
1) Backend
```
cd Pet-caring-website/Pet-caring-website
dotnet restore
(dotnet ef database update) # khi da co connection string
dotnet watch run
```
2) Frontend
```
cd Pet-caring-website/ClientApp
npm install
npm run dev -- --host --port 5173
```
- Bien can thiet: `VITE_API_BASE_URL=http://localhost:5247/api/v1`, `VITE_GOOGLE_CLIENT_ID`, `VITE_GITHUB_CLIENT_ID`...

## Docker compose (API + frontend + Postgres)
1) Tao `.env` tu `.env.example`, dien POSTGRES_PASSWORD, JWT_SECRET, OAuth, Cloudinary.
2) Chay:
```
docker compose --env-file .env up --build
```
- API: http://localhost:8080, Frontend: http://localhost:5173, DB: localhost:5432.
- Muon build frontend voi API domain khac: `docker compose build --build-arg VITE_API_BASE_URL=https://api.example.com frontend`.
- Co the xoa dong `version:` trong docker-compose.yml de het canh bao.

## Tai khoan demo
- Admin: admin@demo.vn / Admin@123 (can co trong `SuperAdmins`).
- User: user@demo.vn / User@123.

## Ghi chu secrets
- Khong commit `.env`; luu o local/secret store. Neu secrets tung bi lo, hay rotate (JWT, Google/GitHub, Cloudinary) truoc khi deploy.
