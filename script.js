class EnhancedChatbotPopout {
    constructor() {
        this.isPopped = false;
        this.isMinimized = false;
        this.dragState = {
            isDragging: false,
            startX: 0,
            startY: 0,
            startLeft: 0,
            startTop: 0
        };
        this.resizeState = {
            isResizing: false,
            startX: 0,
            startWidth: 0
        };
        
        this.init();
    }
    
    init() {
        // Get DOM elements
        this.chatbotPanel = document.getElementById('chatbot-panel');
        this.popoutWindow = document.getElementById('popout-window');
        this.minimizedWindow = document.getElementById('minimized-window');
        this.popoutContent = document.getElementById('popout-content');
        this.popoutBtn = document.getElementById('popout-btn');
        this.dockBtn = document.getElementById('dock-btn');
        this.closeBtn = document.getElementById('close-popout-btn');
        this.minimizeBtn = document.getElementById('minimize-btn');
        this.restoreBtn = document.getElementById('restore-btn');
        this.popoutHeader = document.querySelector('.popout-header');
        this.resizeHandle = document.querySelector('.resize-handle');
        
        // Bind event listeners
        this.bindEvents();
        
        // Initialize functionality
        this.initDrag();
        this.initResize();
        this.initChat();
        
        console.log('Enhanced Chatbot Popout initialized');
    }
    
    bindEvents() {
        // Pop out button
        this.popoutBtn.addEventListener('click', () => this.popOut());
        
        // Dock back button
        this.dockBtn.addEventListener('click', () => this.dockBack());
        
        // Close button
        this.closeBtn.addEventListener('click', () => this.dockBack());
        
        // Minimize button
        this.minimizeBtn.addEventListener('click', () => this.minimize());
        
        // Restore button
        this.restoreBtn.addEventListener('click', () => this.restore());
        this.minimizedWindow.addEventListener('click', () => this.restore());
        
        // Escape key to dock back or restore
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.isMinimized) {
                    this.restore();
                } else if (this.isPopped) {
                    this.dockBack();
                }
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
        
        // Hide popout window and minimized window
        this.popoutWindow.classList.add('hidden');
        this.minimizedWindow.classList.add('hidden');
        this.isMinimized = false;
        
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
    
    minimize() {
        if (!this.isPopped || this.isMinimized) return;
        
        console.log('Minimizing chatbot...');
        
        this.popoutWindow.classList.add('minimized');
        this.minimizedWindow.classList.remove('hidden');
        this.isMinimized = true;
        
        // Add notification badge if there are unread messages
        this.addNotificationBadge();
        
        console.log('Chatbot minimized');
    }
    
    restore() {
        if (!this.isPopped || !this.isMinimized) return;
        
        console.log('Restoring chatbot...');
        
        this.popoutWindow.classList.remove('minimized');
        this.minimizedWindow.classList.add('hidden');
        this.isMinimized = false;
        
        // Remove notification badge
        this.removeNotificationBadge();
        
        // Focus on input
        const popoutInput = this.popoutContent.querySelector('#chat-input');
        if (popoutInput) {
            popoutInput.focus();
        }
        
        console.log('Chatbot restored');
    }
    
    addNotificationBadge() {
        const existingBadge = this.minimizedWindow.querySelector('.notification-badge');
        if (existingBadge) return;
        
        const badge = document.createElement('div');
        badge.className = 'notification-badge';
        badge.textContent = '1';
        this.minimizedWindow.appendChild(badge);
    }
    
    removeNotificationBadge() {
        const badge = this.minimizedWindow.querySelector('.notification-badge');
        if (badge) {
            badge.remove();
        }
    }
    
    initDrag() {
        this.popoutHeader.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
    }
    
    startDrag(e) {
        if (!this.isPopped || this.isMinimized) return;
        
        this.dragState.isDragging = true;
        this.dragState.startX = e.clientX;
        this.dragState.startY = e.clientY;
        
        const rect = this.popoutWindow.getBoundingClientRect();
        this.dragState.startLeft = rect.left;
        this.dragState.startTop = rect.top;
        
        this.popoutWindow.classList.add('dragging');
        
        e.preventDefault();
    }
    
    drag(e) {
        if (!this.dragState.isDragging || !this.isPopped || this.isMinimized) return;
        
        const deltaX = e.clientX - this.dragState.startX;
        const deltaY = e.clientY - this.dragState.startY;
        
        const newLeft = this.dragState.startLeft + deltaX;
        const newTop = this.dragState.startTop + deltaY;
        
        // Constrain to viewport with some padding
        const padding = 20;
        const maxLeft = window.innerWidth - this.popoutWindow.offsetWidth - padding;
        const maxTop = window.innerHeight - this.popoutWindow.offsetHeight - padding;
        
        const constrainedLeft = Math.max(padding, Math.min(newLeft, maxLeft));
        const constrainedTop = Math.max(padding, Math.min(newTop, maxTop));
        
        this.popoutWindow.style.left = constrainedLeft + 'px';
        this.popoutWindow.style.top = constrainedTop + 'px';
        this.popoutWindow.style.right = 'auto';
        this.popoutWindow.style.bottom = 'auto';
    }
    
    stopDrag() {
        if (!this.dragState.isDragging) return;
        
        this.dragState.isDragging = false;
        this.popoutWindow.classList.remove('dragging');
    }
    
    initResize() {
        this.resizeHandle.addEventListener('mousedown', (e) => this.startResize(e));
        document.addEventListener('mousemove', (e) => this.resize(e));
        document.addEventListener('mouseup', () => this.stopResize());
    }
    
    startResize(e) {
        if (this.isPopped) return;
        
        this.resizeState.isResizing = true;
        this.resizeState.startX = e.clientX;
        this.resizeState.startWidth = this.chatbotPanel.offsetWidth;
        
        document.body.style.cursor = 'col-resize';
        e.preventDefault();
    }
    
    resize(e) {
        if (!this.resizeState.isResizing || this.isPopped) return;
        
        const deltaX = this.resizeState.startX - e.clientX;
        const newWidth = this.resizeState.startWidth + deltaX;
        
        // Constrain width
        const minWidth = 250;
        const maxWidth = 600;
        const constrainedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
        
        this.chatbotPanel.style.width = constrainedWidth + 'px';
    }
    
    stopResize() {
        if (!this.resizeState.isResizing) return;
        
        this.resizeState.isResizing = false;
        document.body.style.cursor = 'default';
    }
    
    handleResize() {
        if (!this.isPopped) return;
        
        // Ensure popout window stays within viewport bounds
        const rect = this.popoutWindow.getBoundingClientRect();
        const padding = 20;
        const maxLeft = window.innerWidth - rect.width - padding;
        const maxTop = window.innerHeight - rect.height - padding;
        
        if (rect.left > maxLeft) {
            this.popoutWindow.style.left = maxLeft + 'px';
        }
        if (rect.top > maxTop) {
            this.popoutWindow.style.top = maxTop + 'px';
        }
        if (rect.left < padding) {
            this.popoutWindow.style.left = padding + 'px';
        }
        if (rect.top < padding) {
            this.popoutWindow.style.top = padding + 'px';
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
            
            // Add quick action listeners
            this.bindQuickActions();
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
            
            // Add quick action listeners in popout
            this.bindQuickActionsInPopout();
        }
    }

    
    bindQuickActions() {
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const responses = [
                    'Here\'s a summary of your current engagement: You have completed 6 out of 12 planning sections. The materiality has been set at $150,000. Next steps include completing the risk assessment and team discussions.',
                    'Reviewing your checklist: Missing documents include signed engagement letter, management representation letter, and 3 lease agreements. I recommend prioritizing the engagement letter first.',
                    'Missing documents identified: 1) Updated trial balance 2) Bank confirmations 3) Accounts receivable aging 4) Fixed asset register. Would you like me to help draft requests for these?',
                    'Suggested next steps: 1) Complete A400 Team planning discussions 2) Finalize materiality calculations 3) Review and update risk assessment 4) Schedule client meetings for document collection.'
                ];
                this.simulateResponse(responses[index] || 'I can help you with that. What specific information do you need?');
            });
        });
    }
    
    bindQuickActionsInPopout() {
        const quickActionBtns = this.popoutContent.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const responses = [
                    'Here\'s a summary of your current engagement: You have completed 6 out of 12 planning sections. The materiality has been set at $150,000. Next steps include completing the risk assessment and team discussions.',
                    'Reviewing your checklist: Missing documents include signed engagement letter, management representation letter, and 3 lease agreements. I recommend prioritizing the engagement letter first.',
                    'Missing documents identified: 1) Updated trial balance 2) Bank confirmations 3) Accounts receivable aging 4) Fixed asset register. Would you like me to help draft requests for these?',
                    'Suggested next steps: 1) Complete A400 Team planning discussions 2) Finalize materiality calculations 3) Review and update risk assessment 4) Schedule client meetings for document collection.'
                ];
                this.simulateResponseInPopout(responses[index] || 'I can help you with that. What specific information do you need?');
            });
        });
    }
    
    sendMessage() {
        const chatInput = document.querySelector('#chat-input');
        const message = chatInput.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            chatInput.value = '';
            
            // Show typing indicator
            this.showTypingIndicator();
            
            // Simulate AI response with realistic delay
            setTimeout(() => {
                this.hideTypingIndicator();
                this.simulateResponse(this.generateContextualResponse(message));
            }, 1500 + Math.random() * 1000);
        }
    }
    
    sendMessageInPopout() {
        const chatInput = this.popoutContent.querySelector('#chat-input');
        const message = chatInput.value.trim();
        
        if (message) {
            this.addMessageInPopout(message, 'user');
            chatInput.value = '';
            
            // Show typing indicator
            this.showTypingIndicatorInPopout();
            
            // Simulate AI response
            setTimeout(() => {
                this.hideTypingIndicatorInPopout();
                this.simulateResponseInPopout(this.generateContextualResponse(message));
            }, 1500 + Math.random() * 1000);
        }
    }
    
    generateContextualResponse(message) {
        const lowMessage = message.toLowerCase();
        
        if (lowMessage.includes('materiality')) {
            return 'Based on your engagement, I see materiality is set at $150,000. This represents 5% of pre-tax income. Would you like me to help you reassess this based on the latest financial information?';
        } else if (lowMessage.includes('risk') || lowMessage.includes('assessment')) {
            return 'For your risk assessment, I notice you haven\'t completed the fraud risk evaluation. Key areas to consider include revenue recognition, management override of controls, and related party transactions. Shall I guide you through this?';
        } else if (lowMessage.includes('document') || lowMessage.includes('missing')) {
            return 'I\'ve identified several missing documents in your engagement file. Priority items include: bank confirmations, management rep letter, and lease agreements. Would you like me to generate template requests?';
        } else if (lowMessage.includes('planning') || lowMessage.includes('strategy')) {
            return 'Your overall audit strategy shows good progress. Consider updating the staffing plan based on the risk assessment results. The client has indicated some time constraints - shall I suggest an optimized approach?';
        } else if (lowMessage.includes('team') || lowMessage.includes('discuss')) {
            return 'Team discussions are crucial for engagement quality. I recommend scheduling a discussion about significant risks, journal entry testing approach, and coordination with component auditors. Need help preparing an agenda?';
        } else {
            return `I understand you're asking about "${message}". Based on your current engagement status, I can help you with planning activities, risk assessments, document management, or team coordination. What would be most helpful right now?`;
        }
    }
    
    showTypingIndicator() {
        const chatContent = document.querySelector('.chatbot-content');
        const inputSection = chatContent.querySelector('.chat-input-section');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        
        chatContent.insertBefore(typingDiv, inputSection);
        chatContent.scrollTop = chatContent.scrollHeight;
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    showTypingIndicatorInPopout() {
        const inputSection = this.popoutContent.querySelector('.chat-input-section');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        
        this.popoutContent.insertBefore(typingDiv, inputSection);
        this.popoutContent.scrollTop = this.popoutContent.scrollHeight;
    }
    
    hideTypingIndicatorInPopout() {
        const typingIndicator = this.popoutContent.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
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
                ? 'background: linear-gradient(135deg, #4CAF50, #45a049);' 
                : 'background: linear-gradient(135deg, #ff6b6b, #ee5a24);'
            }
        `;
        avatar.textContent = sender === 'user' ? '👤' : '🤖';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        return messageDiv;
    }
    
    simulateResponse(response) {
        setTimeout(() => {
            this.addMessage(response, 'ai');
        }, 100);
    }
    
    simulateResponseInPopout(response) {
        setTimeout(() => {
            this.addMessageInPopout(response, 'ai');
        }, 100);
    }
}

// Initialize the enhanced chatbot when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedChatbotPopout();
});

// Add interactive features for the main interface
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects and click handlers to section items
    const sectionItems = document.querySelectorAll('.section-item');
    sectionItems.forEach(item => {
        item.addEventListener('click', () => {
            const itemName = item.textContent.trim();
            console.log('Clicked on:', itemName);
            
            // Simulate opening a document or form
            item.style.background = '#e3f2fd';
            item.style.borderColor = '#1976d2';
            
            setTimeout(() => {
                item.style.background = '#fafafa';
                item.style.borderColor = '#e0e0e0';
            }, 2000);
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
                header.querySelector('::after') && (header.style.transform = 'rotate(0deg)');
            } else {
                group.classList.add('collapsed');
                items.forEach(item => {
                    item.style.display = 'none';
                });
                header.querySelector('::after') && (header.style.transform = 'rotate(-90deg)');
            }
        });
        
        header.style.cursor = 'pointer';
        header.title = 'Click to expand/collapse';
    });
    
    // Add realistic workflow simulation
    setTimeout(() => {
        // Simulate some activity in the interface
        const items = document.querySelectorAll('.section-item');
        if (items.length > 0) {
            // Mark some items as completed
            items[0].style.background = '#e8f5e8';
            items[0].style.borderColor = '#4caf50';
            items[0].querySelector('.item-icon').textContent = '✅';
            
            if (items[1]) {
                items[1].style.background = '#fff3e0';
                items[1].style.borderColor = '#ff9800';
                items[1].querySelector('.item-icon').textContent = '⏳';
            }
        }
    }, 3000);
}); 