# 📚 MCQ Quiz Application

A modern, responsive Multiple Choice Question (MCQ) quiz application built with vanilla JavaScript and Supabase backend.

## 🌟 Features

- ✅ **User Authentication** - Secure login and registration with Supabase Auth
- ✅ **Quiz Management** - Take quizzes with instant feedback
- ✅ **Score Tracking** - Save and view quiz history
- ✅ **User Profiles** - Track user statistics and performance
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Real-time Timer** - Track time spent on quiz
- ✅ **Leaderboard Ready** - Track best scores and performance
- ✅ **Progress Tracking** - Visual progress bar and question counter
- ✅ **Demo Mode** - Fallback demo questions if database is empty
- ✅ **Offline Support** - LocalStorage for session management

## 📁 Project Structure

```
quiz-app/
├── .env                    # Environment variables (NOT in git)
├── .gitignore              # Git ignore rules
├── index.html              # Main HTML file
├── README.md               # This file
├── js/
│   ├── config.js           # Supabase configuration
│   ├── auth.js             # Authentication functions
│   ├── quiz.js             # Quiz logic & question management
│   ├── results.js          # Results & scoring management
│   └── utils.js            # Utility functions
├── css/
│   └── style.css           # Main stylesheet
└── data/
    └── questions.json      # Sample questions data
```

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ (optional, for development)
- A Supabase account
- A modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/quiz-app.git
cd quiz-app
```

2. **Create `.env` file**
```bash
cp .env.example .env
```

3. **Update `.env` with your Supabase credentials**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. **Set up Supabase Database**

Run these SQL queries in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  fullname TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  attempts INT DEFAULT 0,
  best_score INT DEFAULT 0
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  questiontext TEXT NOT NULL,
  optiona TEXT NOT NULL,
  optionb TEXT NOT NULL,
  optionc TEXT NOT NULL,
  optiond TEXT NOT NULL,
  correctoption CHAR(1) NOT NULL CHECK (correctoption IN ('a', 'b', 'c', 'd')),
  category TEXT,
  difficulty VARCHAR(10) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id SERIAL PRIMARY KEY,
  userid UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  correct_answers INT NOT NULL,
  wrong_answers INT NOT NULL,
  duration_seconds INT,
  attempted_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own results"
ON quiz_results FOR SELECT USING (auth.uid() = userid);

CREATE POLICY "Users can insert own results"
ON quiz_results FOR INSERT WITH CHECK (auth.uid() = userid);

CREATE POLICY "Anyone can view questions"
ON questions FOR SELECT USING (true);
```

5. **Open in browser**
```bash
# If using Python
python -m http.server 8000

# Or if using Node/npm
npx http-server

# Then open http://localhost:8000
```

## 📖 Usage

### Register New User
1. Click "Register" tab
2. Enter name, email, and password
3. Check email for confirmation
4. Return to Login and enter credentials

### Take a Quiz
1. Login with your credentials
2. Click "Start Quiz"
3. Answer questions (progress bar shows your progress)
4. Review answers before submitting
5. Click "Submit Quiz" when ready

### View Results
- See your score, time spent, and performance metrics
- View all previous attempts
- Compare scores across attempts

### Track Statistics
- View total attempts
- Check average and best scores
- Monitor time spent on quizzes

## 🛠️ API Reference

### Authentication (`auth.js`)

```javascript
// Login
await loginUser(email, password)

// Register
await registerUser(email, password, fullname)

// Logout
await logoutUser()

// Get current user
const user = await getCurrentUser()

// Get user profile
const profile = await getUserProfile(userId)

// Update profile
await updateUserProfile(userId, updates)
```

### Quiz Management (`quiz.js`)

```javascript
// Load questions
const result = await loadQuestions(limit = 100)

// Initialize quiz
initializeQuiz(questions)

// Get current question
const q = getCurrentQuestion()

// Select answer
selectAnswer(letter)

// Get progress
const progress = getProgress()

// Calculate score
const score = calculateScore()
```

### Results (`results.js`)

```javascript
// Save quiz result
await saveQuizResult(userId, score, totalQuestions, duration)

// Get user results
const results = await getUserResults(userId, limit = 10)

// Get statistics
const stats = await getStatistics(userId)

// Format result data
const formatted = formatResultData(correct, total, duration)
```

### Utilities (`utils.js`)

```javascript
// Time formatting
formatTime(seconds) // "05:30"

// Date formatting
formatDate(dateString)

// Calculate percentage
calculatePercentage(correct, total)

// Validation
validateEmail(email)
validatePassword(password)

// Storage
saveToLocalStorage(key, value)
getFromLocalStorage(key)
removeFromLocalStorage(key)
```

## 🎨 Customization

### Change Colors

Edit `css/style.css` CSS variables:

```css
:root {
  --primary-color: #667eea;
  --primary-dark: #764ba2;
  --success-color: #10b981;
  --danger-color: #ef4444;
  /* ... more colors ... */
}
```

### Add Questions

Edit `data/questions.json` or add via Supabase:

```json
{
  "questiontext": "Your question?",
  "optiona": "Option A",
  "optionb": "Option B",
  "optionc": "Option C",
  "optiond": "Option D",
  "correctoption": "b",
  "category": "Category",
  "difficulty": "easy"
}
```

### Modify Quiz Settings

Edit `js/config.js`:

```javascript
export const config = {
  features: {
    demoMode: true,
    quizTimeLimit: 3600, // seconds
    enableAnalytics: false
  }
}
```

## 🔒 Security

- ✅ Credentials in `.env` file (not in code)
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only see their own data
- ✅ Supabase Auth for secure authentication
- ✅ Password validation on client and server

## 📊 Database Schema

### profiles
- `id` (UUID) - User ID
- `fullname` (TEXT) - User's name
- `email` (TEXT) - User's email
- `created_at` (TIMESTAMP) - Registration date
- `attempts` (INT) - Number of quiz attempts
- `best_score` (INT) - Highest score

### questions
- `id` (SERIAL) - Question ID
- `questiontext` (TEXT) - The question
- `optiona-d` (TEXT) - Answer options
- `correctoption` (CHAR) - Correct answer (a/b/c/d)
- `category` (TEXT) - Question category
- `difficulty` (VARCHAR) - Difficulty level

### quiz_results
- `id` (SERIAL) - Result ID
- `userid` (UUID) - User who took quiz
- `score` (INT) - Number correct
- `total_questions` (INT) - Total questions
- `correct_answers` (INT) - Correct count
- `wrong_answers` (INT) - Wrong count
- `duration_seconds` (INT) - Time taken
- `created_at` (TIMESTAMP) - When quiz was taken

## 🚀 Deployment

### Deploy to GitHub Pages

```bash
# 1. Build (if using build tool)
npm run build

# 2. Create git repo
git init
git add .
git commit -m "Quiz app with Supabase backend"
git branch -M main
git remote add origin https://github.com/yourusername/quiz-app.git
git push -u origin main

# 3. Enable GitHub Pages
# Settings → Pages → Deploy from main branch

# Access at: https://yourusername.github.io/quiz-app/
```

### Deploy to Vercel

```bash
vercel
# Follow prompts
```

### Deploy to Netlify

```bash
npm i -g netlify-cli
netlify deploy
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "supabase is not defined" | Add `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>` before other scripts |
| Questions don't load | Add questions to database or check network tab |
| Results not saving | Check RLS policies, verify user ID |
| Session lost on refresh | Clear browser cache, check auth session |
| Credentials exposed in code | Move to `.env` file, add to `.gitignore` |

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Create an issue on GitHub
4. Contact the development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎓 Learning Resources

- [Supabase Documentation](https://supabase.com/docs)
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)
- [CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📈 Roadmap

- [ ] Add admin panel for question management
- [ ] Implement leaderboard
- [ ] Add certificate generation
- [ ] Support for multiple languages
- [ ] Mobile app version
- [ ] Real-time multiplayer quizzes
- [ ] Advanced analytics dashboard
- [ ] Integration with learning management systems

---

**Happy Quizzing! 🎉**

Made with ❤️ for learners everywhere.
