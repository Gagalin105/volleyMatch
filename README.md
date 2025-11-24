# 🏐 VolleyMatch - 排球賽事揪團平台

這是**網際網路概論**期末分組作業，旨在打造一個整合賽事資訊、社群互動與 AI 輔助的排球愛好者平台。

---

## 👥 團隊成員

- **林書妤**
- **林家靖**
- **寸得育**

---

## ✨ 專案功能

### 1. 📅 賽事資訊爬蟲
- 爬取 **TPVL（台灣職業排球聯賽）** 賽程資訊
- 爬取 **TVL（台灣企業排球聯賽）** 賽程資訊
- 自動更新賽事資料至資料庫

### 2. 💬 留言揪團功能
- 使用者可在各場比賽下方留言
- 揪團功能：邀請其他球迷一起觀賽
- 整合 **Supabase** 資料庫進行留言管理

### 3. 🤖 AI 規則小幫手
- 串接 AI 後端 API
- 提供排球規則即時問答
- 協助新手球迷快速理解比賽規則

### 4. 🔗 系統整合
- 前端使用 **React + Vite**
- 路由管理使用 **React Router**
- 響應式設計，支援手機與桌面瀏覽

---

## 🛠️ 技術架構

### 前端
- **React 18**
- **Vite**
- **React Router** - 頁面路由
- **Supabase Client** - 資料庫連接

### 後端
- **Supabase** - 資料庫與身份驗證
- **AI API** - 規則問答服務
- **Python 爬蟲** - 賽事資料爬取

### 部署
- **GitHub** - 版本控制
- **Render** - 前端部署

---

## 📦 安裝與執行

### 1. Clone 專案
```bash
git clone https://github.com/你的帳號/volleyMatch.git
cd volleyMatch
```

### 2. 安裝相依套件
```bash
npm install
```

### 3. 設定環境變數
複製 `.env.example` 並重新命名為 `.env`，填入你的 API 金鑰：
```env
VITE_SUPABASE_URL=你的_Supabase_網址
VITE_SUPABASE_ANON_KEY=你的_Supabase_金鑰
VITE_AI_API_URL=你的_AI_後端_網址
```

### 4. 啟動開發伺服器
```bash
npm run dev
```

開啟瀏覽器訪問：`http://localhost:5173`

### 5. 建置專案（部署用）
```bash
npm run build
```

---

## 📂 專案結構
```
volleyMatch/
├── src/
│   ├── components/      # React 組件
│   │   ├── Layout/      # Header、Footer
│   │   ├── Match/       # 賽事相關組件
│   │   ├── Comment/     # 留言功能
│   │   └── AIChat/      # AI 規則小幫手
│   ├── pages/           # 各頁面
│   │   ├── HomePage.jsx
│   │   ├── MatchesPage.jsx
│   │   ├── MatchDetailPage.jsx
│   │   ├── RulesPage.jsx
│   │   └── VideoPage.jsx
│   ├── services/        # API 服務
│   │   ├── supabaseClient.js
│   │   ├── matchService.js
│   │   ├── commentService.js
│   │   └── aiService.js
│   ├── utils/           # 工具函數
│   ├── App.jsx          # 主程式 + 路由
│   └── main.jsx         # 進入點
├── public/
│   └── _redirects       # Render 部署設定
├── .env.example         # 環境變數範例
└── package.json
```

---

## 🌐 部署說明

### 部署到 Render
1. 將專案推送到 GitHub
2. 在 [Render](https://render.com) 建立 **Static Site**
3. 設定：
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. 在 Environment 中加入環境變數
5. 完成部署！

---

## 📸 功能展示

### 主要頁面
- **首頁** - 平台介紹與特色
- **賽事總覽** - 所有 TPVL 與 TVL 賽程
- **比賽詳情** - 單場比賽資訊 + 留言揪團
- **規則顧問** - AI 即時問答
- **影音專區** - 精彩賽事回顧

---

## 📝 開發筆記

### 已完成功能
- ✅ React 專案架構建立
- ✅ React Router 路由設定
- ✅ Supabase 資料庫整合
- ✅ AI API 串接

### 待開發功能
- ⏳ 使用者登入系統
- ⏳ 留言按讚功能
- ⏳ 賽事訂閱通知
- ⏳ 賽事資料爬蟲

---

## 📄 授權

此專案僅供**學術用途**，為網際網路概論課程期末作業。

