# MysteryQuery – Learn SQL Through Investigation

A web-based detective mystery game that teaches SQL fundamentals through an engaging story-driven investigation. Solve "The Missing Trophy" case using only `SELECT` queries!

## 🎮 Game Overview

Players take on the role of a detective investigating a stolen school trophy. Using SQL queries, they must analyze database tables containing information about people, locations, movements, and clues to identify the culprit.

## ✨ Features

- **Multi-Page Architecture**: Separate login, game, and success pages with proper navigation
- **Story-Driven Learning**: Engaging mystery narrative that makes learning SQL fun
- **Interactive SQL Editor**: Execute real SQL queries using SQL.js (client-side database)
- **Question System**: 8 progressive questions that guide the investigation
- **ONE-WORD Answers**: Strict validation - only single-word answers accepted (no spaces)
- **Scoring System**: +5 points for correct answers, -1 for wrong answers
- **Security Built-in**: Only SELECT queries allowed (blocks DELETE, DROP, UPDATE, etc.)
- **Hint System**: Quick reference guide for SQL commands
- **Perfect Score Celebration**: Special success page with confetti for flawless investigations
- **Mystery-Themed UI**: Beautiful detective aesthetics with smooth animations

## 🎯 Learning Objectives

Players will learn:
- Basic SELECT statements
- WHERE clauses with conditions
- JOINs across multiple tables
- AND/OR logical operators
- Filtering and comparing data
- Logical reasoning with SQL

## 📄 Page Structure

The game consists of **three separate pages**:

1. **index.html** - Login page where players enter their detective name
2. **game.html** - Main investigation page with story, questions, and SQL editor
3. **success.html** - Celebration page shown only for perfect investigations

Navigation uses `sessionStorage` to maintain player state across pages.

## 🗃️ Database Schema

### Tables

**people**
- id (INTEGER)
- name (TEXT)
- role (TEXT)

**locations**
- id (INTEGER)
- place (TEXT)

**movements**
- person_id (INTEGER)
- place_id (INTEGER)
- time (TEXT)

**clues**
- id (INTEGER)
- description (TEXT)

## 🚀 How to Run

1. Simply open `index.html` in a modern web browser
2. No server or installation required!
3. The game runs entirely client-side using SQL.js

## 🎲 How to Play

1. **Login Page**: Enter your detective name and click "Begin Investigation"
2. **Game Page**:
   - Read the case story in the top section
   - Write and execute SQL queries in the editor (bottom-right)
   - Answer the 8 investigation questions (bottom-left)
   - **IMPORTANT**: All answers must be exactly ONE WORD (no spaces allowed!)
3. **Success Page**: Complete all questions correctly on first try to see the celebration!

## ⚠️ Answer Format Rule

**All answers must be exactly ONE WORD with NO SPACES.**

- ✓ Correct: `Kabir`
- ✓ Correct: `volunteer`
- ✗ Wrong: `Kabir volunteer` (has space - will be rejected)
- ✗ Wrong: `Storage Room` (has space - will be rejected)

If you try to enter multiple words, the answer will be rejected before validation.

## 🔍 Game Flow

1. **Login Page** (`index.html`): Player enters name → stored in sessionStorage → navigate to game
2. **Game Page** (`game.html`):
   - Story section (top)
   - Score card (top-right, fixed)
   - Questions panel (bottom-left)
   - SQL editor (bottom-right)
   - Hint button (bottom-right, fixed)
3. **Success Page** (`success.html`): Shown ONLY if all 8 questions are answered correctly on first attempt

## 💡 Hints

Click the "💡 Hints" button for quick SQL reference including:
- SELECT
- WHERE
- AND/OR
- JOIN
- ORDER BY
- LIMIT

## 🎨 Design

- Light theme with mystery/detective aesthetics
- Custom color palette with purple and blue accents
- Smooth animations and micro-interactions
- Responsive design for desktop and mobile
- Premium fonts: Crimson Text & Inter

## 🛡️ Security

The game implements regex-based SQL injection prevention:
- Only SELECT queries are executed
- Dangerous keywords (DELETE, DROP, UPDATE, INSERT, ALTER, TRUNCATE) are blocked
- Safe client-side execution with SQL.js

## 📚 Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Custom design system with animations
- **JavaScript (ES6+)**: Game logic and interactions
- **SQL.js**: Client-side SQL database engine
- **Google Fonts**: Crimson Text & Inter

## 🎓 Educational Use

Perfect for:
- SQL beginners
- Classroom teaching
- Self-paced learning
- Gamified education
- Database fundamentals

## 📝 Answer Key

The solution involves finding that **Kabir** (the volunteer) is the thief because:
1. Only volunteers had storage access
2. The trophy was last seen at the Stage
3. Kabir went to the Storage Room after 18:05
4. He matches both the role requirement and the movement pattern

## 🏆 Scoring

- Each correct answer: **+5 points**
- Each wrong answer: **-1 point**
- Maximum possible score: **40 points** (8 questions × 5 points)
- Perfect investigation: All questions correct on first try → Success page appears!

## 🔄 Future Enhancements

Potential additions:
- Multiple mystery cases
- Difficulty levels
- More complex SQL operations (GROUP BY, HAVING, etc.)
- Leaderboard system
- Time-based challenges
- Multiplayer mode

## 📄 License

This project is free to use for educational purposes.

---

**Built with ❤️ for SQL learners everywhere**
