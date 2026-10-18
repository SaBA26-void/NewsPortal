# News Portal

სიახლეების ვებაპლიკაცია (Full-Stack), შექმნილი GITA Full-Stack დავალებისთვის.

პროექტი აერთიანებს **ASP.NET Core Web API**-ს, **MS SQL Server + EF Core**-ს და **React + TypeScript + Tailwind** ფრონტენდს. მომხმარებლები კითხულობენ სტატიებს, რეგისტრირდებიან/ავტორიზდებიან, ინახავენ ფავორიტებს; ჟურნალისტები მართავენ საკუთარ სტატიებს; სუპერადმინი მართავს კატეგორიებს და მოდერაციას.

---

## ძირითადი ფუნქციონალი

| ფუნქცია | აღწერა |
|---|---|
| სტატიების სია | პაგინაცია, კატეგორიის ფილტრი, სურათი, დეტალური გვერდი |
| რეგისტრაცია / შესვლა | JWT ავტორიზაცია, BCrypt პაროლის ჰაში |
| როლები | `User`, `Journalist`, `SuperAdmin` |
| ფავორიტები | მხოლოდ ავტორიზებული მომხმარებლისთვის; guest-ზე login/register შეტყობინება |
| სტატიების მართვა | Journalist / SuperAdmin — შექმნა, რედაქტირება, წაშლა |
| კატეგორიები | `NameKa` / `NameEn` (i18n); CRUD API SuperAdmin-ისთვის |
| UI | Light / Dark / System თემა; ქართული / ინგლისური ინტერფეისი |

### როლების უფლებები

- **Guest** — სტატიებისა და კატეგორიების კითხვა
- **User** — + ფავორიტები
- **Journalist** — + საკუთარი სტატიების CRUD
- **SuperAdmin** — + ყველა სტატიის მოდერაცია და კატეგორიების CRUD (API / Swagger)

> რეგისტრაცია ყოველთვის ქმნის `User` როლს. Journalist / SuperAdmin როლი ინიშნება მონაცემთა ბაზაში (იხ. ქვემოთ).

---

## ტექნოლოგიები

### Backend
- C# / .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- Microsoft SQL Server
- JWT Bearer Authentication
- BCrypt.Net-Next
- Swashbuckle (Swagger)

### Frontend
- React.js (Vite)
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Lucide React (აიქონები)

### ინსტრუმენტები
- Git
- EF Core Migrations
- npm

---

## პროექტის სტრუქტურა

```text
NewsPortal/
├── NewsPortal.sln
├── NewsPortal.API/          # Backend Web API
│   ├── Controllers/
│   ├── Services/
│   ├── Entities/
│   ├── DTOs/
│   ├── Data/
│   └── Migrations/
└── news-portal-web/         # Frontend (React + Vite)
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── pages/
        ├── types/
        └── utils/
```

---

## მონაცემთა მოდელი

### ენტითიები

| ცხრილი | მთავარი ველები | შენიშვნა |
|---|---|---|
| **Users** | Id, FirstName, LastName, Email, PasswordHash, Role, CreatedAt | Email — უნიკალური ინდექსი |
| **Categories** | Id, NameKa, NameEn | ორენოვანი სახელები ფრონტისთვის |
| **Articles** | Id, Title, Content, ImageUrl, CreatedAt, CategoryId, AuthorId | FK → Category, User |
| **FavoriteArticles** | UserId, ArticleId, CreatedAt | Composite PK `(UserId, ArticleId)` |

### ურთიერთობები

```text
User 1 ──────── * Article          (AuthorId)
Category 1 ──── * Article          (CategoryId)
User * ──────── * Article          (FavoriteArticles join)
```

- Article → Author / Category: **Restrict** წაშლისას (სტატიები შემთხვევით არ წაიშლება)
- Favorite → User / Article: **Cascade**

### ER (მოკლედ)

```text
┌──────────┐       ┌──────────────────┐       ┌────────────┐
│  Users   │──1──*─│ FavoriteArticles │─*──1──│  Articles  │
└──────────┘       └──────────────────┘       └─────┬──────┘
     │                                              │
     │ 1                                            │ *
     └──────────────── * Articles ──────────────────┘
                              │
                              │ *
                         ┌────┴─────┐
                         │Categories│
                         └──────────┘
```

---

## გაშვების ინსტრუქცია

### მოთხოვნები

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/) (npm)
- Microsoft SQL Server (მაგ. SQL Server Express) + SSMS (ოფციონალური)
- `dotnet-ef` ტულინგი (მიგრაციებისთვის):

```powershell
dotnet tool install --global dotnet-ef
```

### 1) მონაცემთა ბაზა

1. გახსენი `NewsPortal.API/appsettings.json`
2. შეცვალე connection string შენი SQL Server instance-ის მიხედვით:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_PC\\SQLEXPRESS;Database=NewsPortalDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}
```

3. მიგრაციის გამოყენება (ბაზა შეიქმნება ავტომატურად თუ არ არსებობს):

```powershell
cd NewsPortal.API
dotnet ef database update
```

თუ მოდელი შეიცვალა და ახალი მიგრაცია გჭირდება:

```powershell
dotnet ef migrations add MigrationName
dotnet ef database update
```

### 2) Backend API

```powershell
cd NewsPortal.API
dotnet restore
dotnet run
```

ნაგულისხმევად HTTP: `http://localhost:5206`  
Swagger: `http://localhost:5206/swagger`

### 3) Frontend

```powershell
cd news-portal-web
npm install
```

შეამოწმე `.env`:

```env
VITE_API_URL=http://localhost:5206/api
```

გაშვება:

```powershell
npm run dev
```

ბრაუზერი: ჩვეულებრივ `http://localhost:5173`

> `.env`-ის შეცვლის შემდეგ Vite თავიდან გაუშვი.

### 4) სატესტო როლების დაყენება

რეგისტრაციის შემდეგ SSMS / SQL-ით:

```sql
-- Journalist
UPDATE Users SET Role = 1 WHERE Email = 'journalist@example.com';

-- SuperAdmin
UPDATE Users SET Role = 2 WHERE Email = 'admin@example.com';
```

`UserRole` enum: `User = 0`, `Journalist = 1`, `SuperAdmin = 2`.

შემდეგ ხელახლა გაიარე Login, რომ JWT-ში ახალი როლი მოხვდეს.

---

## API მიმოხილვა

| მეთოდი | Endpoint | წვდომა |
|---|---|---|
| POST | `/api/Auth/register` | Public |
| POST | `/api/Auth/login` | Public |
| GET | `/api/Articles` | Public (page, pageSize, categoryId) |
| GET | `/api/Articles/{id}` | Public |
| POST/PUT/DELETE | `/api/Articles` | Journalist, SuperAdmin |
| GET | `/api/Categories` | Public |
| POST/PUT/DELETE | `/api/Categories` | SuperAdmin |
| GET/POST/DELETE | `/api/Favorites` | Authorized User |

დეტალები და ტესტირება — Swagger UI.

---

## არქიტექტურა და ტექნიკური გადაწყვეტილებები

### Backend
- **Controllers + Services + DTOs + Entities** — თხელი კონტროლერები, ბიზნეს ლოგიკა სერვისებში
- **DTO** — Entity პირდაპირ არ ბრუნდება API-დან (`PasswordHash` და navigation ციკლები არ ჟონავს)
- **JWT** — ავტორიზაცია; `AuthorId` / `UserId` აღებულია ტოკენიდან, არა კლიენტის body-დან
- **BCrypt** — პაროლის უსაფრთხო ჰაშირება
- **CORS** — ლოკალური Vite origin (`localhost:5173`)
- **როლური დაცვა** — `[Authorize(Roles = "...")]`; Journalist მხოლოდ საკუთარ სტატიას ცვლის/შლის

### Frontend
- **Context API** — Auth, Theme, Language (Redux არ გამოიყენება — პროექტის ზომისთვის საკმარისია)
- **Axios interceptors** — ავტომატური `Bearer` token
- **Loading / Error / Empty** — სიებისა და ფორმების UX
- **i18n მზადება** — კატეგორიების `NameKa` / `NameEn`; UI ტექსტები ka/en

---

## შეზღუდვები და დაუსრულებელი ფუნქციები

| პუნქტი | მდგომარეობა | მიზეზი / შენიშვნა |
|---|---|---|
| AI ჩატბოტი | არ არის | დავალებაში ოპციონალური იყო; დრო ძირითად CRUD/Auth-ზე დაიხარჯა |
| კატეგორიების ადმინ UI | არ არის | CRUD API მზადაა; მართვა Swagger-ით / SuperAdmin API-თი |
| როლის მინიჭების UI | არ არის | უსაფრთხოებისთვის რეგისტრაციაზე როლი არ ირჩევა; იცვლება DB-დან |
| ავტომატური ტესტები | არ არის | ტესტირება ხელით (Swagger + UI) |
| Refresh token / httpOnly cookie | არ არის | JWT ინახება `localStorage`-ში (ჯუნიორ დემოსთვის საკმარისი) |
| სტატიის ორენოვანი კონტენტი | არ არის | მხოლოდ კატეგორიების სახელებია ორენოვანი |

---

## სწრაფი დემო სცენარი

1. გაუშვი API + Frontend  
2. Guest-ად ნახე სტატიების სია და დეტალი  
3. დარეგისტრირდი / შეხვიდე  
4. დაამატე სტატია ფავორიტებში  
5. SQL-ით გახდი Journalist → Login → Manage Articles  
6. Swagger-ით SuperAdmin-ით შექმენი კატეგორია (`NameKa` / `NameEn`)  

---

## ლიცენზია / ავტორი

სასწავლო / საკონკურსო პროექტი — GITA Full-Stack დავალება.
