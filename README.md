# 🏰 Battle Village

![Battle Village Landscape](static/assets/Battle-Village-Landscape.svg)

Welcome to Battle Village - an exciting archery-based defense game where you protect your village from the menacing Warlord! Test your archery skills, improve your accuracy, and compete with other players for the highest score.

## 🎮 Game Features

- **Archery Combat**: Take aim and shoot arrows to defend your village
- **Health System**: Manage both your health and track the Warlord's health
- **Score Tracking**: Compete with other players and track various statistics:
  - Total Score
  - Arrows Shot
  - Hit Accuracy
  - Player Health
  - Warlord Health
- **User Authentication**: Create an account to save your progress and compete on the leaderboard

## 🚀 Getting Started

### Prerequisites

- Python 3.x
- Flask
- SQLAlchemy
- Modern web browser with JavaScript enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/awaliuddin/Game-Battle-Village.git
cd Game-Battle-Village
```

2. Set up a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# Create a .env file with the following:
DATABASE_URL=sqlite:///game.db  # or your preferred database URL
SESSION_SECRET=your_secret_key
```

5. Run the application:
```bash
python main.py
```

6. Open your browser and navigate to `http://localhost:5000`

## 🎯 How to Play

1. **Create an Account**: Register to track your scores and compete with others
2. **Start the Game**: Click "Play" to begin defending your village
3. **Controls**:
   - Use your mouse to aim
   - Click to shoot arrows
   - Dodge incoming attacks
4. **Objective**: Defeat the Warlord while maintaining your health
5. **Scoring**: Points are awarded based on accuracy and damage dealt

## 🛠️ Tech Stack

- **Backend**: Flask (Python)
- **Database**: SQLAlchemy
- **Frontend**: HTML5, CSS3, JavaScript
- **Authentication**: Flask-Login
- **Security**: Werkzeug Security

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 🎮 Play Now!

Ready to defend your village? [Play Battle Village](http://localhost:5000) now and become the legendary archer your village needs!

---

Made with ❤️ by Ayana.Code
