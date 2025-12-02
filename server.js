require('dotenv').config(); // 載入 .env 檔案

const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(express.json()); 

// 設定 CORS，允許您的前端 (http://localhost:5173) 訪問 API
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); 
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); // 允許 GET 請求和 OPTIONS 預檢
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 1. 建立 Nodemailer 傳輸器 (用於發送郵件)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD 
    }
});


// ==========================================================
// ⭐️ 解決 "Cannot GET /" 的新增路由 ⭐️
// 當瀏覽器直接訪問 http://localhost:3001 時，回傳歡迎訊息
// ==========================================================
app.get('/', (req, res) => {
    res.send(`
        <h1>🏐 Volley Go API Server 運行中!</h1>
        <p>後端通知服務正在運行於 Port ${PORT}。</p>
        <p>核心 API 接口: <strong>POST /api/send-match-invite</strong></p>
        <p>通用測試接口: <strong>POST /send-email</strong></p>
    `);
});


// 2. 通用郵件發送 API 路由 (您提供的第一個路由)
app.post('/send-email', async (req, res) => {
    // 假設前端會透過 JSON 傳送收件人、主旨和內容
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).json({ success: false, message: '錯誤：缺少必要的參數 (to, subject, 或 text)。' });
    }

    const mailOptions = {
        from: process.env.GMAIL_USER, 
        to: to,                      
        subject: subject,            
        text: text                   
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("郵件發送成功:", info.response);
        res.json({ success: true, message: '郵件已成功發送！', info: info });
    } catch (error) {
        console.error("郵件發送失敗:", error);
        res.status(500).json({ success: false, message: '郵件發送失敗，請檢查伺服器日誌', error: error.message });
    }
});


// 3. 模擬獲取收件人列表的函式 (未來將替換為 Supabase 查詢)
function getMatchRecipients(matchId) {
    // ⚠️ 請修改成您要測試的 Email 地址
    const recipients = [
        'cundeyu384@gmail.com', 
        // 'user2@example.com', // 更多收件人
    ]; 
    return recipients; 
}

// 4. 建立 API 接口：/api/send-match-invite (核心功能)
app.post('/api/send-match-invite', async (req, res) => {
    const { matchId, matchName = '排球揪團活動' } = req.body; 

    if (!matchId) {
        return res.status(400).json({ success: false, message: '錯誤：缺少比賽 ID (matchId)。' });
    }

    const recipients = getMatchRecipients(matchId);

    if (recipients.length === 0) {
        return res.status(404).json({ success: false, message: `找不到比賽 ID ${matchId} 的參與者。` });
    }
    
    // 測試用的專題連結 (指向本機開發地址)
    const PROJECT_URL = `http://localhost:5173/match/${matchId}`;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: recipients.join(','), // 郵件收件人列表，用逗號分隔
        subject: `🏐 排球揪團通知：${matchName} 即將開始！`, 
        html: `
            <h3>嗨，排球夥伴們！</h3>
            <p>這是一個提醒：您報名的比賽 <strong>${matchName}</strong> 即將舉行。</p>
            <p><strong>請點擊此處查看詳情：</strong> <a href="${PROJECT_URL}">點擊查看比賽詳情</a></p>
            <p>期待您的參與！</p>
            <hr>
            <p><small>本郵件由 [Volley Go] 自動發出。</small></p>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('郵件已成功發送。Message ID: %s', info.messageId);
        res.json({ success: true, message: '通知郵件已成功發送。' });
    } catch (error) {
        console.error('發送郵件失敗:', error);
        res.status(500).json({ success: false, message: '發送郵件時發生錯誤。請檢查 App Password 或網路連線是否正確。' });
    }
});


// ==========================================================
// 伺服器啟動 (已移除重複的 app.listen)
// ==========================================================
app.listen(PORT, () => {
    console.log(`🚀 伺服器已啟動，正在 Port ${PORT} 上運行`);
    console.log(`您現在可以從 http://localhost:${PORT} 訪問伺服器狀態`);
    console.log(`API 接口: POST http://localhost:${PORT}/api/send-match-invite`);
});