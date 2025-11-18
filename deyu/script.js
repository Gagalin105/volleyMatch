  document.addEventListener('DOMContentLoaded', () => {
    // I. AI 顧問功能 (AI Consultant)
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatHistory = document.getElementById('chat-history');

    // 模擬 AI 的回答邏輯
    function getAIResponse(question) {
        const lowerQuestion = question.toLowerCase();

        if (lowerQuestion.includes('攔網') || lowerQuestion.includes('規則')) {
            return '攔網後，球隊仍有三次擊球權。攔網觸球不計入這三次擊球次數中。';
        } else if (lowerQuestion.includes('企業排球')) {
            return '企業排球聯賽 (TVL) 是台灣最高級別的排球聯賽，通常在每年底至隔年舉行。您想知道最新的賽程嗎？';
        } else if (lowerQuestion.includes('你好') || lowerQuestion.includes('哈囉')) {
            return '您好！很高興為您服務。';
        } else {
            return '這是一個進階的問題！很抱歉，我的知識庫目前沒有這個答案，但我會努力學習！';
        }
    }

    // 處理送出按鈕的點擊事件
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            const question = userInput.value.trim();
            
            if (question) {
                // 1. 顯示使用者的提問
                const userMessageDiv = document.createElement('div');
                userMessageDiv.classList.add('message', 'user-message');
                userMessageDiv.innerHTML = `<p><strong>您：</strong>${question}</p>`;
                chatHistory.appendChild(userMessageDiv);
                // 2. 顯示 AI 的模擬回答 
                setTimeout(() => {
                    const aiResponse = getAIResponse(question);
                    
                    const aiMessageDiv = document.createElement('div');
                    aiMessageDiv.classList.add('message', 'ai-message');
                    aiMessageDiv.innerHTML = `<p><strong>AI 顧問：</strong>${aiResponse}</p>`;
                    chatHistory.appendChild(aiMessageDiv);
                    chatHistory.scrollTop = chatHistory.scrollHeight;
                }, 800); 
                userInput.value = '';
            }
        });
    }
    // II. 留言揪團功能 
    // 1. 處理「留言揪團」按鈕點擊事件
    const lfgButton = document.getElementById('toggle-comments-1');
    const commentSection = document.getElementById('comments-match-1');

    if (lfgButton && commentSection) {
        lfgButton.addEventListener('click', () => {
            if (commentSection.style.display === 'block') {
                commentSection.style.display = 'none';
            } else {
                commentSection.style.display = 'block';
            }
        });
    }

    // 2. 處理「發布留言」按鈕點擊事件 
    const postButton = document.querySelector('.post-button');
    const commentInput = document.getElementById('comment-input-1');
    const commentList = document.getElementById('comment-list-1');

    if (postButton) {
        postButton.addEventListener('click', () => {
            const commentText = commentInput.value.trim();
            
            if (commentText) {
                const now = new Date();
                const timeString = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                const newComment = document.createElement('div');
                newComment.classList.add('comment');
                newComment.innerHTML = `
                    <p><strong>球友 (您):</strong> ${commentText}</p>
                    <span class="comment-time">${timeString}</span>
                `;
                commentList.prepend(newComment); 
                commentInput.value = '';
                commentList.scrollTop = 0;
            }
        });
    }

});