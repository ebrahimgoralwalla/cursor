class ChatbotPopout {
    constructor() {
        this.isPopped = false;
        this.dragState = {
            isDragging: false,
            startX: 0,
            startY: 0,
            startLeft: 0,
            startTop: 0
        };
        
        this.init();
    }
    
    init() {
        // Get DOM elements
        this.chatbotPanel = document.getElementById('chatbot-panel');
        this.popoutWindow = document.getElementById('popout-window');
        this.popoutContent = document.getElementById('popout-content');
        this.popoutBtn = document.getElementById('popout-btn');
        this.dockBtn = document.getElementById('dock-btn');
        this.closeBtn = document.getElementById('close-popout-btn');
        this.popoutHeader = document.querySelector('.popout-header');
        
        // Bind event listeners
        this.bindEvents();
        
        // Initialize drag functionality
        this.initDrag();
        
        // Add chat functionality
        this.initChat();
        
        console.log('Chatbot Popout initialized');
    }
    
    bindEvents() {
        // Pop out button
        this.popoutBtn.addEventListener('click', () => this.popOut());
        
        // Dock back button
        this.dockBtn.addEventListener('click', () => this.dockBack());
        
        // Close button
        this.closeBtn.addEventListener('click', () => this.dockBack());
        
        // Escape key to dock back
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isPopped) {
                this.dockBack();
            }
        });
        
        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
    }
    
    popOut() {
        if (this.isPopped) return;
        
        console.log('Popping out chatbot...');
        
        // Move chatbot content to popout window
        const chatbotContent = this.chatbotPanel.querySelector('.chatbot-content');
        this.popoutContent.appendChild(chatbotContent.cloneNode(true));
        
        // Hide original panel with animation
        this.chatbotPanel.classList.add('sliding-out');
        
        setTimeout(() => {
            this.chatbotPanel.style.display = 'none';
            this.popoutWindow.classList.remove('hidden');
            this.isPopped = true;
            
            // Re-bind chat events in popout
            this.initChatInPopout();
            
            // Focus on input in popout
            const popoutInput = this.popoutContent.querySelector('#chat-input');
            if (popoutInput) {
                popoutInput.focus();
            }
            
            console.log('Chatbot popped out successfully');
        }, 300);
    }
    
    dockBack() {
        if (!this.isPopped) return;
        
        console.log('Docking chatbot back...');
        
        // Move content back to original panel
        const popoutChatContent = this.popoutContent.querySelector('.chatbot-content');
        if (popoutChatContent) {
            const originalContent = this.chatbotPanel.querySelector('.chatbot-content');
            originalContent.innerHTML = popoutChatContent.innerHTML;
        }
        
        // Hide popout window
        this.popoutWindow.classList.add('hidden');
        
        // Show original panel with animation
        this.chatbotPanel.style.display = 'flex';
        this.chatbotPanel.classList.remove('sliding-out');
        this.chatbotPanel.classList.add('sliding-in');
        
        setTimeout(() => {
            this.chatbotPanel.classList.remove('sliding-in');
            this.isPopped = false;
            
            // Clear popout content
            this.popoutContent.innerHTML = '';
            
            // Re-bind chat events in main panel
            this.initChat();
            
            console.log('Chatbot docked back successfully');
        }, 300);
    }
    
    initDrag() {
        this.popoutHeader.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
    }
    
    startDrag(e) {
        if (!this.isPopped) return;
        
        this.dragState.isDragging = true;
        this.dragState.startX = e.clientX;
        this.dragState.startY = e.clientY;
        
        const rect = this.popoutWindow.getBoundingClientRect();
        this.dragState.startLeft = rect.left;
        this.dragState.startTop = rect.top;
        
        this.popoutWindow.style.cursor = 'grabbing';
        this.popoutHeader.style.cursor = 'grabbing';
        
        e.preventDefault();
    }
    
    drag(e) {
        if (!this.dragState.isDragging || !this.isPopped) return;
        
        const deltaX = e.clientX - this.dragState.startX;
        const deltaY = e.clientY - this.dragState.startY;
        
        const newLeft = this.dragState.startLeft + deltaX;
        const newTop = this.dragState.startTop + deltaY;
        
        // Constrain to viewport
        const maxLeft = window.innerWidth - this.popoutWindow.offsetWidth;
        const maxTop = window.innerHeight - this.popoutWindow.offsetHeight;
        
        const constrainedLeft = Math.max(0, Math.min(newLeft, maxLeft));
        const constrainedTop = Math.max(0, Math.min(newTop, maxTop));
        
        this.popoutWindow.style.left = constrainedLeft + 'px';
        this.popoutWindow.style.top = constrainedTop + 'px';
        this.popoutWindow.style.right = 'auto';
        this.popoutWindow.style.bottom = 'auto';
    }
    
    stopDrag() {
        if (!this.dragState.isDragging) return;
        
        this.dragState.isDragging = false;
        this.popoutWindow.style.cursor = 'default';
        this.popoutHeader.style.cursor = 'move';
    }
    
    handleResize() {
        if (!this.isPopped) return;
        
        // Ensure popout window stays within viewport bounds
        const rect = this.popoutWindow.getBoundingClientRect();
        const maxLeft = window.innerWidth - rect.width;
        const maxTop = window.innerHeight - rect.height;
        
        if (rect.left > maxLeft) {
            this.popoutWindow.style.left = maxLeft + 'px';
        }
        if (rect.top > maxTop) {
            this.popoutWindow.style.top = maxTop + 'px';
        }
    }
    
    initChat() {
        const chatInput = document.querySelector('#chat-input');
        const sendBtn = document.querySelector('#send-btn');
        
        if (chatInput && sendBtn) {
            // Remove existing listeners
            const newChatInput = chatInput.cloneNode(true);
            const newSendBtn = sendBtn.cloneNode(true);
            chatInput.parentNode.replaceChild(newChatInput, chatInput);
            sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
            
            // Add new listeners
            newSendBtn.addEventListener('click', () => this.sendMessage());
            newChatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
            
            // Add quick action listener
            const quickActionBtn = document.querySelector('.quick-action-btn');
            if (quickActionBtn) {
                quickActionBtn.addEventListener('click', () => {
                    this.simulateResponse('Here\'s a summary of your current engagement activities...');
                });
            }
        }
    }
    
    initChatInPopout() {
        const chatInput = this.popoutContent.querySelector('#chat-input');
        const sendBtn = this.popoutContent.querySelector('#send-btn');
        
        if (chatInput && sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessageInPopout());
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessageInPopout();
                }
            });
            
            // Add quick action listener
            const quickActionBtn = this.popoutContent.querySelector('.quick-action-btn');
            if (quickActionBtn) {
                quickActionBtn.addEventListener('click', () => {
                    this.simulateResponseInPopout('Here\'s a summary of your current engagement activities...');
                });
            }
        }
    }
    
    sendMessage() {
        const chatInput = document.querySelector('#chat-input');
        const message = chatInput.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            chatInput.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                this.simulateResponse(`I understand you're asking about "${message}". Let me help you with that...`);
            }, 1000);
        }
    }
    
    sendMessageInPopout() {
        const chatInput = this.popoutContent.querySelector('#chat-input');
        const message = chatInput.value.trim();
        
        if (message) {
            this.addMessageInPopout(message, 'user');
            chatInput.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                this.simulateResponseInPopout(`I understand you're asking about "${message}". Let me help you with that...`);
            }, 1000);
        }
    }
    
    addMessage(message, sender) {
        const chatContent = document.querySelector('.chatbot-content');
        const messageDiv = this.createMessageElement(message, sender);
        
        // Insert before input section
        const inputSection = chatContent.querySelector('.chat-input-section');
        chatContent.insertBefore(messageDiv, inputSection);
        
        // Scroll to bottom
        chatContent.scrollTop = chatContent.scrollHeight;
    }
    
    addMessageInPopout(message, sender) {
        const messageDiv = this.createMessageElement(message, sender);
        
        // Insert before input section
        const inputSection = this.popoutContent.querySelector('.chat-input-section');
        this.popoutContent.insertBefore(messageDiv, inputSection);
        
        // Scroll to bottom
        this.popoutContent.scrollTop = this.popoutContent.scrollHeight;
    }
    
    createMessageElement(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.style.cssText = `
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
            ${sender === 'user' ? 'flex-direction: row-reverse;' : ''}
        `;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.style.cssText = `
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            font-size: 16px;
            ${sender === 'user' 
                ? 'background: linear-gradient(135deg, #4CAF50, #45a049); color: white;' 
                : 'background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white;'
            }
        `;
        avatar.textContent = sender === 'user' ? '👤' : '🤖';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.style.cssText = `
            flex: 1;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.4;
            ${sender === 'user' 
                ? 'background: #e3f2fd; color: #1976d2; margin-left: 40px;' 
                : 'background: #f5f5f5; color: #333; margin-right: 40px;'
            }
        `;
        messageContent.textContent = message;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        return messageDiv;
    }
    
    simulateResponse(response) {
        setTimeout(() => {
            this.addMessage(response, 'ai');
        }, 500);
    }
    
    simulateResponseInPopout(response) {
        setTimeout(() => {
            this.addMessageInPopout(response, 'ai');
        }, 500);
    }
}

// Initialize the chatbot popout when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatbotPopout();
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to section items
    const sectionItems = document.querySelectorAll('.section-item');
    sectionItems.forEach(item => {
        item.addEventListener('click', () => {
            console.log('Clicked on:', item.textContent.trim());
            // You could add functionality to open documents here
        });
    });
    
    // Add collapsible functionality to section groups
    const sectionGroups = document.querySelectorAll('.section-group h3');
    sectionGroups.forEach(header => {
        header.addEventListener('click', () => {
            const group = header.parentElement;
            const items = group.querySelectorAll('.section-item');
            const isCollapsed = group.classList.contains('collapsed');
            
            if (isCollapsed) {
                group.classList.remove('collapsed');
                items.forEach(item => {
                    item.style.display = 'flex';
                });
                header.style.opacity = '1';
            } else {
                group.classList.add('collapsed');
                items.forEach(item => {
                    item.style.display = 'none';
                });
                header.style.opacity = '0.7';
            }
        });
        
        header.style.cursor = 'pointer';
    });
}); 