# 📱 Easy USSD Builder

A simple, intuitive USSD (Unstructured Supplementary Service Data) flow builder that anyone can use - no coding required!

## ✨ Features

### 🎯 **Simple & Intuitive**
- **Visual drag-and-drop** interface powered by React Flow
- **No technical knowledge required** - perfect for non-developers
- **Real-time phone preview** to test your flows
- **Built-in tutorial** to get you started in minutes

### 🏗️ **Three Building Blocks**
1. **📋 Menu Nodes** - Show options to users (1. Check Balance, 2. Send Money, etc.)
2. **📝 Input Nodes** - Collect user information (amounts, phone numbers, etc.)
3. **✅ End Nodes** - Display final messages and end the session

### 🚀 **Professional Features**
- **Smart auto-save** - Never lose your work
- **Interactive testing** - Test flows before going live
- **Flow validation** - Automatic checks for common issues
- **Export/Import** - Share flows with your team
- **Mobile-responsive** - Works on all devices

## 🎮 How to Use

### Getting Started
1. **Open the tutorial** (Help button) to learn the basics
2. **Create your first flow** using the sample template
3. **Add building blocks** using the colored buttons
4. **Connect blocks** by dragging from the dots
5. **Test your flow** using the phone preview
6. **Save and deploy** when ready!

### Building Your Flow
```
Start → Add Menu → Connect to Next Step → Test → Deploy
```

### Example Flow Structure
```
Main Menu
├─ 1. Check Balance → End (Show Balance)
├─ 2. Send Money → Input (Amount) → Input (Phone) → End (Confirmation)
├─ 3. Buy Airtime → Input (Phone) → Input (Amount) → End (Success)
└─ 0. Exit → End (Goodbye)
```

## 🎨 Node Types

### Menu Node (Blue)
- **Purpose**: Present options to users
- **Example**: "1. Check Balance\n2. Send Money\n3. Exit"
- **Best Practice**: Keep 3-7 options max

### Input Node (Green)  
- **Purpose**: Collect user input
- **Types**: Text, Number, Phone, Email, Date, Amount
- **Example**: "Enter amount to send: ____"

### End Node (Red)
- **Purpose**: Show final message and end session
- **Types**: Success, Thank You, Goodbye, Rating, Feedback
- **Example**: "Thank you! Your balance is $150.00"

## 🎯 **Individual Option Connectors**

**Revolutionary Feature**: Each menu option has its own connection handle!

### How It Works
- **🔵 Smart Handles**: Every menu option gets its own blue connector dot
- **🎨 Visual Feedback**: Handles light up on hover and scale on interaction  
- **🔗 Precise Routing**: Connect specific options to specific destinations
- **⚡ Instant Updates**: Real-time visual feedback when connecting
- **💡 Intuitive UX**: Hover over options to see connection points

### Usage Steps
1. **Create Menu Node** → Add your options (1. Balance, 2. Transfer, etc.)
2. **See Blue Dots** → Each option shows a connector on the right side
3. **Drag to Connect** → Drag from any blue dot to any other node
4. **Color-Coded Edges** → Connections get different colors automatically
5. **Smart Labels** → Edges are labeled with the option text

### Visual Example
```
Main Menu Node
├─ 1. Check Balance  ○ ──→ Balance Display Node
├─ 2. Send Money     ○ ──→ Amount Input Node  
├─ 3. Buy Airtime    ○ ──→ Phone Input Node
└─ 0. Exit          ○ ──→ Goodbye Node

○ = Individual connector handles (blue dots)
```

## 💡 Pro Tips

### For Great User Experience
- ✅ **Keep it simple** - 3-7 menu options maximum
- ✅ **Use clear language** - Avoid technical jargon  
- ✅ **Logical flow** - Make the path intuitive
- ✅ **Always include "Back"** - Let users navigate easily
- ✅ **Test thoroughly** - Try all possible paths

### Common Patterns
- **Authentication**: Menu → Input (PIN) → Action → End
- **Balance Inquiry**: Menu → End (Show Balance)
- **Money Transfer**: Menu → Input (Amount) → Input (Phone) → Confirm → End
- **Airtime Purchase**: Menu → Input (Phone) → Input (Amount) → End

## 🛠️ Technical Details

### Built With
- **React Flow** - Smooth node-based editor
- **Framer Motion** - Beautiful animations
- **Tailwind CSS** - Modern styling
- **Lucide Icons** - Clean, consistent icons

### File Structure
```
SimpleUSSDBuilder.jsx     # Main builder component
nodes/
  ├─ MenuNode.jsx         # Menu option blocks
  ├─ InputNode.jsx        # Input collection blocks
  └─ EndNode.jsx          # Session ending blocks
SimplePhonePreview.jsx    # Interactive phone simulator
QuickTutorial.jsx         # Built-in help system
```

### Data Format
Flows are stored as simple JSON with nodes and edges:
```json
{
  "nodes": [
    {
      "id": "menu-1",
      "type": "menuNode", 
      "data": {
        "title": "Main Menu",
        "options": [
          {"key": "1", "text": "Check Balance"},
          {"key": "0", "text": "Exit"}
        ]
      }
    }
  ],
  "edges": [
    {
      "id": "menu-1-end-1",
      "source": "menu-1",
      "target": "end-1",
      "label": "Option 1"
    }
  ]
}
```

## 🎯 Target Users

### Perfect For
- **Business owners** wanting to add phone services
- **Product managers** designing customer experiences  
- **Support teams** creating help systems
- **Telecom operators** building USSD services
- **Anyone** who needs phone-based interactions

### No Need For
- Programming knowledge
- Technical background
- Complex software
- Expensive tools

## 🚀 Getting Started

1. Click **"Help"** to see the interactive tutorial
2. Try the **"Create Sample Flow"** to see an example
3. Start building your own flow step by step
4. Use the **phone preview** to test everything
5. Save and deploy when ready!

---

**Made with ❤️ for everyone who wants to build great phone experiences without the complexity!**