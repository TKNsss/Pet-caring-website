# Pet Caring Website

## Giới thiệu ngắn gọn

Pet Caring Website là hệ thống chăm sóc thú cưng kết hợp SPA React và API ASP.NET Core để quản lý dịch vụ, đặt lịch, hồ sơ thú cưng và người dùng. Back-end cung cấp các API REST `api/v1/*` kèm OTP, đăng nhập Google, gửi email, lưu trữ hình ảnh Cloudinary và token JWT. Front-end Vite/React 19 hiển thị landing page, form đặt dịch vụ, quản lý tài khoản, đồng thời kết nối tới API thông qua Axios với interceptor tự động gắn JWT.

## Công nghệ sử dụng

**Ngôn ngữ & nền tảng**

- `C#` với `.NET 8 / ASP.NET Core MVC + API` (launch URL `http://localhost:5247` / `https://localhost:7042`).
- `JavaScript (ESNext)` với `React 19`, `Vite 6`, `Tailwind CSS 4 beta`.
- `PostgreSQL` làm cơ sở dữ liệu quan hệ.

**Back-end (thư viện chính)**

- `Entity Framework Core 9 + Npgsql` cho truy vấn Postgres; context `AppDbContext` mô hình hoá bảng Appointments/Pets/Services/Users.
- `AutoMapper`, `DTOs` và `Mapping/AutoMapperProfile` để tách lớp trình bày.
- `ServiceService` cung cấp endpoint phân trang/filter cho dịch vụ (`GET /api/v1/services?page=&pageSize=&search=`) kèm metadata `{ data, meta }`, giảm tải so với trả toàn bộ bảng.
- `BCrypt.Net-Next`, `Microsoft.AspNetCore.Authentication.JwtBearer`, `Microsoft.IdentityModel.Tokens`, `System.IdentityModel.Tokens.Jwt` cho xác thực, mã hoá mật khẩu và phát hành JWT.
- `Google.Apis.Auth`, `Microsoft.AspNetCore.Authentication.Google` và luồng OAuth tuỳ chỉnh cho GitHub giúp Single Sign-On (Google/GitHub).
- `MailKit/MimeKit` + `OtpService` gửi OTP qua email Gmail App Password.
- `CloudinaryDotNet` + `ImageService` quản lý media.
- `OpenTelemetry.Exporter.Console` ghi log có cấu trúc; `Swashbuckle.AspNetCore` đã khai báo để sẵn sàng cho Swagger.
- `MemoryCache`, `HttpContextAccessor`, middleware `GlobalExceptionHandler` giúp xử lý trạng thái, context người dùng và chuẩn hoá lỗi.

**Front-end (thư viện chính)**

- `@reduxjs/toolkit`, `react-redux`, listener middleware => quản lý state auth/pets/services.
- Request Services form gọi API `/services` theo trang/từ khoá, dùng metadata tổng số trang từ backend thay vì slice dữ liệu toàn cục.
- `react-router-dom 7`, `@react-oauth/google`, `axios` (wrapper `src/api/axiosCustom.js`), `jwt-decode` cho điều hướng, gọi API và xử lý token.
- `i18next` + `react-i18next` + `LanguageSwitcher` tuỳ chọn tiếng Anh / Việt cho toast & nút đăng nhập.
- `tailwindcss 4`, `@tailwindcss/vite`, `react-icons`, `framer-motion`, `react-toastify`, `react-modal`, `react-lazy-load-image-component` cho UI/UX.
- `ESLint flat config`, `Prettier + prettier-plugin-tailwindcss` dùng thống nhất code style.

## Cấu trúc thư mục

```text
Pet-caring-website/
├─ Pet-caring-website/                # ASP.NET Core backend (.csproj)
│  ├─ Controllers/                    # Appointments, Auth, Pets, Services, Species, User API controllers (route api/v1/*)
│  ├─ Services/                       # Auth/Pet/User/Image/Jwt/Email/Otp business services
│  ├─ Interfaces/                     # DI contracts cho từng service
│  ├─ DTOs/                           # Yêu cầu/đáp ứng cho Auth, Pet, Appointment...
│  ├─ Models/                         # Entities (User, Pet, Appointment, Service, Species...)
│  ├─ Data/AppDbContext.cs            # Cấu hình DbContext và Fluent API
│  ├─ Configurations/                 # Typed settings: JwtSettings, EmailSettings, CloudinarySettings...
│  ├─ Mapping/AutoMapperProfile.cs    # Map entity ↔ DTO
│  ├─ Helpers/                        # PasswordHandler, VerifyUserRole utilities
│  ├─ Middleware/GlobalExceptionHandler.cs
│  ├─ wwwroot/                        # Nội dung tĩnh, nơi có thể phục vụ build React
│  ├─ appsettings*.json               # Cấu hình môi trường
│  └─ Program.cs / Properties/        # Bootstrap, launchSettings
├─ ClientApp/                         # React + Vite SPA
│  ├─ public/                         # Asset tĩnh dùng khi build
│  ├─ src/
│  │  ├─ api/axiosCustom.js           # Axios instance kèm interceptor JWT
│  │  ├─ components/                  # UI modules (đặt dịch vụ, profile, form...)
│  │  ├─ redux/                       # store, slices (auth, pets, services, species, users) và listener
│  │  ├─ hooks/, contexts/            # Reusable hooks & context (auth, theme...)
│  │  ├─ constants/, assets/, shares/ # Data hiển thị, hình ảnh, layout chung
│  │  ├─ utils/                       # Hàm tiện ích (format, validator...)
│  │  └─ App.jsx / main.jsx / index.css
│  ├─ .env                            # Cấu hình Vite (API base URL, Google Client Id)
│  ├─ package.json / package-lock.json
│  └─ vite.config.js / eslint.config.js / .prettierrc
├─ .github/                           # Workflow / issue template
├─ Pet-caring-website.sln             # Solution tập trung 1 project
└─ .gitignore, .gitattributes
```

## Hướng dẫn cài đặt & chạy chương trình

### 1. Yêu cầu môi trường

- `.NET SDK 8.0.x` (bao gồm ASP.NET Core runtime) và `dotnet` CLI.
- `Node.js 20.x` + `npm 10.x` (hoặc `yarn/pnpm` tương đương) cho Vite/React.
- `PostgreSQL 15+` (cài kèm `psql` hoặc `pgAdmin 4`) và tài khoản có quyền tạo DB.
- `dotnet-ef` CLI: `dotnet tool install --global dotnet-ef` (cần cho migrate/generate script).
- Công cụ quản lý mã nguồn (`git`) và quyền truy cập Cloudinary, Google Cloud OAuth 2.0, Gmail App Password để cấu hình secrets.

### 2. Thiết lập & chạy back-end (ASP.NET Core)

```powershell
# 1. Cài dependency
cd Pet-caring-website/Pet-caring-website
dotnet restore

# 2. (Tuỳ chọn) build kiểm tra
dotnet build

# 3. Chạy dev server (mặc định ASPNETCORE_ENVIRONMENT=Development)
dotnet watch run
# hoặc: dotnet run
```

- API chạy ở `http://localhost:5247` (HTTP) và `https://localhost:7042` (HTTPS).
- CORS `AllowFrontend` mở cho `http://localhost:5173`, bảo đảm Vite dev server truy cập được.
- Logs được đẩy ra console thông qua OpenTelemetry. Kiểm tra lỗi chuẩn nhờ `GlobalExceptionHandler`.
- Khi build production có thể dùng `dotnet publish -c Release` rồi trỏ web server (Kestrel, IIS, Nginx) vào thư mục publish. Nếu đã build front-end, copy thư mục `ClientApp/dist` vào `wwwroot` để phục vụ SPA.

### 3. Thiết lập & chạy front-end (React + Vite)

```powershell
cd Pet-caring-website/ClientApp
# sao chép cấu hình môi trường nếu chưa có
cp .env .env.local   # hoặc tự tạo file .env mới

npm install          # cài dependencies
npm run dev -- --host 0.0.0.0 --port 5173
```

- `VITE_API_BASE_URL` phải trỏ tới API (`http://localhost:5247/api/v1`).
- `VITE_GOOGLE_CLIENT_ID` lấy từ Google Cloud Console (OAuth client type Web).
- Sản xuất: `npm run build` (Vite tạo thư mục `dist/`). Script `postbuild` đã cấu hình để giữ `ClientApp/dist`; bạn có thể copy thủ công sang `Pet-caring-website/wwwroot` hoặc cấu hình middleware `app.UseStaticFiles()` để phục vụ SPA từ backend.

### 4. Import database PostgreSQL

1. Tạo database trống (mặc định tên `pcwdb`, user `postgres`):
   ```powershell
   createdb -h localhost -U postgres pcwdb   # hoặc dùng pgAdmin UI
   ```
2. **Nếu đã có file sao lưu** (ví dụ `backups/pcwdb.sql` mà nhóm backend chia sẻ), phục hồi bằng `psql`:
   ```powershell
   psql -h localhost -U postgres -d pcwdb -f path/to/pcwdb.sql
   ```
3. **Nếu chưa có schema**, tạo thông qua EF Core:
   ```powershell
   # đảm bảo đã cài dotnet-ef và ConnectionStrings:DefaultConnection đã trỏ đúng DB
   cd Pet-caring-website/Pet-caring-website
   dotnet ef migrations add InitSchema        # migrations nằm ngoài git (bị .gitignore), tạo mới trên máy bạn
   dotnet ef database update
   ```
4. Sau khi schema có sẵn, chạy script seed (ví dụ phần _Tài khoản demo_ bên dưới) để có dữ liệu đăng nhập.

> **Lưu ý**: Folder `Migrations/` đang bị `.gitignore`, vì vậy mỗi lập trình viên cần tự generate lại hoặc xin file sao lưu DB từ nhóm backend nhằm giữ đúng cấu trúc bảng gốc (Appointments, Pets, Services, Species, Users...).

### 5. Cấu hình file kết nối DB & secrets

- **`Pet-caring-website/appsettings.Development.json`** (không commit) chứa các khoá cho backend. Ví dụ:
  ```json
  {
    "ConnectionStrings": {
      "DefaultConnection": "Server=localhost;Port=5432;Database=pcwdb;User ID=postgres;Password=<postgres-password>"
    },
    "Authentication": {
      "Google": {
        "ClientId": "<google-oauth-client-id>",
        "ClientSecret": "<google-oauth-client-secret>"
      }
    },
    "Jwt": {
      "SecretKey": "<32+ chars secret>",
      "Issuer": "http://localhost:5247",
      "Audience": "http://localhost:5173",
      "ExpiryInHours": 3
    },
    "SuperAdmins": ["admin@demo.vn"],
    "Email": {
      "SmtpServer": "smtp.gmail.com",
      "SmtpPort": 587,
      "SmtpUser": "<gmail>@gmail.com",
      "SmtpPassword": "<app-password>",
      "EnableSsl": true
    },
    "Cloudinary": {
      "CloudName": "<cloud-name>",
      "ApiKey": "<api-key>",
      "ApiSecret": "<api-secret>"
    }
  }
  ```
  Có thể dùng `dotnet user-secrets` để lưu các khoá trên thay vì đặt trực tiếp trong file.
- **`ClientApp/.env`**: tối thiểu gồm
  ```env
  VITE_API_BASE_URL=http://localhost:5247/api/v1
  VITE_GOOGLE_CLIENT_ID=<same-as-backend>
  ```
  Khi build production, thêm các biến khác (ví dụ URL CDN) và commit `.env.example` thay vì `.env` thực tế.

### 6. Cấu hình OAuth2/SSO (Google & GitHub)
- **Google**: đã hoạt động sẵn thông qua endpoint `POST /api/v1/auth/google-login`. Chỉ cần giữ `Authentication:Google` trong `appsettings.*` đồng bộ với `VITE_GOOGLE_CLIENT_ID` ở `ClientApp/.env`.
- **GitHub**:
  1. Trên https://github.com/settings/developers > *OAuth Apps* > *New OAuth App*, đặt `Homepage URL` là URL frontend và `Authorization callback URL = http://localhost:5173/auth/github/callback` (giống `VITE_GITHUB_REDIRECT_URI`). Ghi nhận `Client ID` và tạo `Client Secret`.
  2. Cập nhật `Pet-caring-website/appsettings.Development.json`:
     ```json
     "Authentication": {
       "GitHub": {
         "ClientId": "<client-id>",
         "ClientSecret": "<client-secret>",
         "RedirectUri": "http://localhost:5173/auth/github/callback"
       }
     }
     ```
  3. Điền `ClientApp/.env`:
     ```env
     VITE_GITHUB_CLIENT_ID=<client-id>
     VITE_GITHUB_REDIRECT_URI=http://localhost:5173/auth/github/callback
     ```
     (frontend chỉ cần client_id, có thể commit nếu là dev/test).
  4. Luồng đăng nhập: nút "Continue with GitHub" trong `Login.jsx` sinh `state` (lưu `sessionStorage`) và redirect tới GitHub. Khi callback về `/auth/github/callback`, component `GitHubCallback.jsx` kiểm tra `state`, gọi `POST /api/v1/auth/github-login` → `AuthService.LoginWithGitHubAsync` đổi `code` lấy `access_token` và tạo user/token nội bộ.
  5. Khi triển khai sản xuất, cập nhật các URL ở cả backend/frontend cho khớp domain HTTPS thực tế.

### 7. API dịch vụ & phân trang
- **`GET /api/v1/services`**: hỗ trợ `page`, `pageSize`, `search`, `type`, `isActive`, `sortBy`, `sortDescending`. Trả về
  ```json
  {
    "message": "...",
    "data": [ { serviceId, serviceName, ... } ],
    "meta": { "totalCount": 42, "page": 2, "pageSize": 5, "totalPages": 9 }
  }
  ```
  Phần `data` chỉ chứa các field cần cho card (giá min/max, thời lượng min/max, rating). Khi cần chi tiết, gọi `GET /api/v1/services/{id}` để lấy đầy đủ pricing/slot.
- **Upload & CRUD**: `POST /api/v1/services`, `PATCH /api/v1/services/{id}`, `DELETE /api/v1/services/{id}`, `POST /api/v1/services/upload-service-image` yêu cầu admin (JWT).
- **Frontend**: `ClientApp/src/components/RequestServices/element/RequestForm.jsx` lưu `serviceQuery`, dispatch `fetchServices(serviceQuery)` mỗi khi trang/từ khoá đổi, đồng bộ với `Pagination` thông qua metadata.

### 8. Lệnh chạy hệ thống thường dùng

| Thành phần              | Lệnh                                                       | Ghi chú                                            |
| ----------------------- | ---------------------------------------------------------- | -------------------------------------------------- |
| Restore & build backend | `dotnet restore && dotnet build`                           | chạy trong `Pet-caring-website/Pet-caring-website` |
| Khởi động API dev       | `dotnet watch run`                                         | Auto reload khi code thay đổi                      |
| Áp dụng migration       | `dotnet ef database update`                                | yêu cầu `dotnet-ef`                                |
| Chạy client dev         | `npm run dev -- --host --port 5173`                        | trong `ClientApp`                                  |
| Build client            | `npm run build`                                            | tạo `ClientApp/dist`                               |
| Publish backend         | `dotnet publish -c Release -o ../publish`                  | copy kết quả deploy                                |
| Seed demo users         | `psql -h localhost -U postgres -d pcwdb -f demo_users.sql` | xem script phía dưới                               |

## Tài khoản demo

| Vai trò | Email / Username               | Mật khẩu (để đăng nhập) | Ghi chú                                                          |
| ------- | ------------------------------ | ----------------------- | ---------------------------------------------------------------- |
| Admin   | `admin@demo.vn` / `admin.demo` | `Admin@123`             | cần thêm email này vào `SuperAdmins` để kích hoạt quyền cao nhất |
| User    | `user@demo.vn` / `demo.user`   | `User@123`              | role `client`, dùng để trải nghiệm luồng khách hàng              |

Database lưu mật khẩu dạng BCrypt. Có thể dùng script sau (chạy bằng `psql`) để chèn nhanh 2 tài khoản trên sau khi đã tạo schema:

```sql
INSERT INTO "Users"
    ("user_id","user_name","email","first_name","last_name","password","phone","address","role")
VALUES
    ('11111111-1111-1111-1111-111111111111','admin.demo','admin@demo.vn','Happy','Admin',
     '$2b$12$S2eRGXLHSYJ3T/6d/TSWquzoOOD6myhnDZsVhha/Ov5wWdjt1CuzG','0900000000','Ho Chi Minh','admin'),
    ('22222222-2222-2222-2222-222222222222','demo.user','user@demo.vn','Pet','Lover',
     '$2b$12$3CzKIIKT9ivBw/2mzvLHGuyW/FhW1HjFykE3QGPoefoR18wxCwYZ6','0900000001','Ha Noi','client');
```

- Sau khi insert, gọi `POST /api/v1/Auth/login` với cặp email/mật khẩu tương ứng hoặc dùng form đăng nhập trên SPA.
- Có thể tạo thêm nhân viên/vet bằng cách đặt `role` thành `staff`/`vet` và cập nhật bảng liên quan (ví dụ `PetOwners`, `ServiceDetails`) nếu cần dữ liệu demo phong phú hơn.

---

**Gợi ý bước tiếp theo**

1. Hoàn thiện file `appsettings.Development.json` & `.env` bằng thông tin thực tế.
2. Import/khởi tạo database rồi chạy `dotnet watch run` + `npm run dev` để kiểm tra toàn bộ luồng.
3. Khi triển khai production, build front-end (`npm run build`), publish backend (`dotnet publish`) và cấu hình reverse proxy (Nginx/IIS) phục vụ cả API lẫn SPA.
