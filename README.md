# AIDA Chatbot Pop-out Prototype

This prototype demonstrates how to implement a pop-out chatbot dialog for the AIDA application interface.

## Features

### 🚀 Main Features
- **Pop-out Functionality**: Click the pop-out button (⤴️) in the chatbot header to move the chat to a floating window
- **Dock Back**: Use the dock button (⤵️) or close button (✕) to return the chat to the sidebar
- **Drag & Drop**: The pop-out window can be dragged around the screen by clicking and dragging the header
- **Responsive Design**: The interface adapts to different screen sizes
- **State Persistence**: Chat history is maintained when switching between docked and pop-out modes

### 💬 Chat Features
- **Interactive Chat**: Type messages and receive simulated AI responses
- **Quick Actions**: Click the "Summarize" button for quick interactions
- **Keyboard Shortcuts**: Press Enter to send messages, Escape to dock back when popped out

### 🎨 UI/UX Features
- **Modern Design**: Clean, modern interface matching the original AIDA aesthetic
- **Smooth Animations**: Sliding animations when popping out/docking back
- **Resizable Window**: The pop-out window can be resized by dragging the corners
- **Viewport Constraints**: The pop-out window stays within screen boundaries

## How to Use

1. **Open the Prototype**: Open `index.html` in a web browser
2. **Interact with the Interface**: Explore the planning documents and sections
3. **Pop Out the Chatbot**: 
   - Click the up-arrow button (⤴️) in the chatbot header
   - The chatbot will slide out and appear as a floating window
4. **Use the Floating Chat**:
   - Drag the window around by clicking the header
   - Resize by dragging the window corners
   - Type messages in the input field
   - Click quick action buttons
5. **Dock Back**: 
   - Click the down-arrow button (⤵️) to dock back
   - Or click the close button (✕)
   - Or press the Escape key

## Technical Implementation

### Architecture
- **HTML**: Semantic structure with main app layout and pop-out container
- **CSS**: Flexbox-based responsive design with smooth transitions
- **JavaScript**: ES6 class-based architecture for clean code organization

### Key Components
- `ChatbotPopout` class: Manages all pop-out functionality
- Drag system: Handles window dragging with viewport constraints
- State management: Maintains chat state between modes
- Event handling: Keyboard shortcuts and user interactions

### File Structure
```
aida-chatbot-prototype/
├── index.html          # Main application structure
├── styles.css          # Complete styling and animations
├── script.js           # Pop-out functionality and interactions
└── README.md           # This documentation
```

## Browser Compatibility

- ✅ Chrome/Chromium-based browsers
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Customization Options

### Styling
- Modify colors in `styles.css` using CSS custom properties
- Adjust window sizes by changing `.popout-window` dimensions
- Customize animations by modifying `@keyframes` rules

### Functionality
- Add real chat API integration in the `sendMessage` methods
- Customize drag constraints in the `drag` method
- Add more quick actions in the chat interface

## Future Enhancements

- **Multi-window Support**: Allow multiple chat windows
- **Window Snapping**: Snap to screen edges
- **Minimize/Maximize**: Add window controls
- **Theme Switching**: Light/dark mode toggle
- **Chat History**: Persistent chat storage
- **File Attachments**: Drag and drop file support

## Demo Scenarios

1. **Basic Pop-out**: Pop out the chat and move it around
2. **Resize Testing**: Try resizing the window to different sizes
3. **Chat Interaction**: Send messages and see responses
4. **Multi-tasking**: Use the main interface while chat is popped out
5. **Dock Back**: Return the chat to the sidebar seamlessly

This prototype provides a solid foundation for implementing chatbot pop-out functionality in production applications. 