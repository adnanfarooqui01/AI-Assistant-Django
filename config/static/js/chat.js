document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector(".input-area input");
    const sendBtn = document.querySelector(".input-area button");
    const messages = document.querySelector(".messages");
    const newChatBtn = document.querySelector(".new-chat");
    const chatHistoryContainer = document.getElementById("chatHistory");

    // Chat management variables
    let currentChatId = null;
    let chatHistory = {};
    let currentMessages = [];

    // Enable input
    input.disabled = false;
    sendBtn.disabled = false;
    sendBtn.style.cursor = "pointer";

    // Initialize
    loadChatHistory();
    startNewChat();

    // Event Listeners
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    sendBtn.addEventListener("click", sendMessage);
    newChatBtn.addEventListener("click", handleNewChat);

    // =====================
    // CHAT MANAGEMENT
    // =====================

    function startNewChat() {
        currentChatId = generateChatId();
        currentMessages = [];
        
        // Reset messages area
        messages.innerHTML = `
            <div class="message bot">
                <div class="avatar">🤖</div>
                <div class="bubble">
                    Hello 👋 <br>How can I help you today?
                </div>
            </div>
        `;

        // Update active state in sidebar
        updateActiveChatInSidebar(currentChatId);
    }

    function handleNewChat() {
        // Save current chat if it has messages
        if (currentMessages.length > 0) {
            saveCurrentChat();
        }

        // Start a new chat
        startNewChat();
    }

    function saveCurrentChat() {
        if (!currentChatId || currentMessages.length === 0) return;

        // Generate chat name from first user message or timestamp
        const chatName = generateChatName(currentMessages);

        chatHistory[currentChatId] = {
            id: currentChatId,
            name: chatName,
            messages: [...currentMessages],
            timestamp: Date.now()
        };

        saveChatHistory();
        renderChatHistory();
    }

    function generateChatName(messages) {
        // Find first user message
        const firstUserMsg = messages.find(msg => msg.type === 'user');
        
        if (firstUserMsg) {
            // Truncate to 30 characters
            let name = firstUserMsg.text.substring(0, 30);
            if (firstUserMsg.text.length > 30) {
                name += "...";
            }
            return name;
        }

        // Fallback to timestamp
        const date = new Date();
        return `Chat ${date.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`;
    }

    function generateChatId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // =====================
    // MESSAGE HANDLING
    // =====================

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Add to current messages
        currentMessages.push({
            type: 'user',
            text: text
        });

        addUserMessage(text);
        input.value = "";

        const loadingBubble = addLoading();

        fetch("/api/chat/ask/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: text }),
        })
            .then(res => res.json())
            .then(data => {
                loadingBubble.remove();

                if (data.ai_response) {
                    currentMessages.push({
                        type: 'bot',
                        text: data.ai_response
                    });
                    addBotMessage(data.ai_response);

                    // Auto-save after each exchange
                    saveCurrentChat();
                } else {
                    addBotMessage("Something went wrong.");
                }
            })
            .catch(() => {
                loadingBubble.remove();
                addBotMessage("Network error. Please try again.");
            });
    }

    function addUserMessage(text) {
        const div = document.createElement("div");
        div.className = "message user";
        div.innerHTML = `
            <div class="bubble">${escapeHTML(text)}</div>
        `;
        messages.appendChild(div);
        scrollBottom();
    }

    function addBotMessage(text) {
        const div = document.createElement("div");
        div.className = "message bot";
        
        // Format the text with code blocks
        const formattedText = formatCodeBlocks(text);
        
        div.innerHTML = `
            <div class="avatar">🤖</div>
            <div class="bubble">${formattedText}</div>
        `;
        messages.appendChild(div);
        scrollBottom();
    }

    function formatCodeBlocks(text) {
        // Handle code blocks with language specification (```language)
        text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
            const lang = language || 'code';
            return `<div class="code-block">
                <div class="code-header">
                    <span class="code-language">${escapeHTML(lang)}</span>
                    <button class="copy-btn" onclick="copyCode(this)">Copy</button>
                </div>
                <pre><code>${escapeHTML(code.trim())}</code></pre>
            </div>`;
        });

        // Handle inline code (`code`)
        text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        // Handle bold text (**text**)
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Handle line breaks
        text = text.replace(/\n/g, '<br>');

        return text;
    }

    // Copy code function (global scope)
    window.copyCode = function(button) {
        const codeBlock = button.closest('.code-block');
        const code = codeBlock.querySelector('code').textContent;
        
        navigator.clipboard.writeText(code).then(() => {
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });
    }

    function addLoading() {
        const div = document.createElement("div");
        div.className = "message bot";
        div.innerHTML = `
            <div class="avatar">🤖</div>
            <div class="bubble">Typing...</div>
        `;
        messages.appendChild(div);
        scrollBottom();
        return div;
    }

    // =====================
    // CHAT HISTORY UI
    // =====================

    function renderChatHistory() {
        chatHistoryContainer.innerHTML = '';

        // Sort chats by timestamp (newest first)
        const sortedChats = Object.values(chatHistory).sort((a, b) => b.timestamp - a.timestamp);

        sortedChats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.dataset.chatId = chat.id;

            if (chat.id === currentChatId) {
                chatItem.classList.add('active');
            }

            chatItem.innerHTML = `
                <span class="chat-title">${escapeHTML(chat.name)}</span>
                <span class="delete-chat" data-chat-id="${chat.id}">🗑️</span>
            `;

            // Click to load chat
            chatItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-chat')) {
                    loadChat(chat.id);
                }
            });

            // Delete button
            const deleteBtn = chatItem.querySelector('.delete-chat');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteChat(chat.id);
            });

            chatHistoryContainer.appendChild(chatItem);
        });
    }

    function loadChat(chatId) {
        // Save current chat first
        if (currentMessages.length > 0 && currentChatId !== chatId) {
            saveCurrentChat();
        }

        const chat = chatHistory[chatId];
        if (!chat) return;

        currentChatId = chatId;
        currentMessages = [...chat.messages];

        // Clear and render messages
        messages.innerHTML = '';

        // Add welcome message
        messages.innerHTML = `
            <div class="message bot">
                <div class="avatar">🤖</div>
                <div class="bubble">Hello 👋 <br>How can I help you today?</div>
            </div>
        `;

        // Add all saved messages
        chat.messages.forEach(msg => {
            if (msg.type === 'user') {
                addUserMessage(msg.text);
            } else if (msg.type === 'bot') {
                addBotMessage(msg.text);
            }
        });

        updateActiveChatInSidebar(chatId);
    }

    function deleteChat(chatId) {
        // Confirm deletion
        if (!confirm('Are you sure you want to delete this chat?')) {
            return;
        }

        delete chatHistory[chatId];
        saveChatHistory();
        renderChatHistory();

        // If deleted chat was active, start new chat
        if (currentChatId === chatId) {
            startNewChat();
        }
    }

    function updateActiveChatInSidebar(chatId) {
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.chatId === chatId) {
                item.classList.add('active');
            }
        });
    }

    // =====================
    // LOCAL STORAGE
    // =====================

    function saveChatHistory() {
        try {
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        } catch (e) {
            console.error('Failed to save chat history:', e);
        }
    }

    function loadChatHistory() {
        try {
            const saved = localStorage.getItem('chatHistory');
            if (saved) {
                chatHistory = JSON.parse(saved);
                renderChatHistory();
            }
        } catch (e) {
            console.error('Failed to load chat history:', e);
            chatHistory = {};
        }
    }

    // =====================
    // UTILITY FUNCTIONS
    // =====================

    function scrollBottom() {
        messages.scrollTop = messages.scrollHeight;
    }

    function escapeHTML(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
});