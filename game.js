// ============================================
// GAME STATE
// ============================================

let db; // SQL database instance
let playerName = '';
let score = 0;
let questionsData = [];
let answeredCorrectly = new Set();
let totalQuestions = 0;
let mistakes = 0;

// ============================================
// QUESTIONS CONFIGURATION (ONE-WORD ANSWERS ONLY)
// ============================================

const questions = [
    {
        id: 1,
        text: "What is the name of the guard?",
        answers: ["Rohan"],
        hint: "SELECT name FROM people WHERE role = 'guard'"
    },
    {
        id: 2,
        text: "What is the name of the teacher?",
        answers: ["Neha"],
        hint: "SELECT name FROM people WHERE role = 'teacher'"
    },
    {
        id: 3,
        text: "Who was at the Stage during theft?",
        answers: ["Aisha"],
        hint: "Join movements and locations, filter by place = 'Stage'"
    },
    {
        id: 4,
        text: "What is at location id 3?",
        answers: ["StorageRoom"],
        hint: "SELECT place FROM locations WHERE id = 3"
    },
    {
        id: 5,
        text: "Who is the volunteer?",
        answers: ["Kabir"],
        hint: "SELECT name FROM people WHERE role = 'volunteer'"
    },
    {
        id: 6,
        text: "What role has storage access according to clues?",
        answers: ["volunteer"],
        hint: "SELECT description FROM clues WHERE id = 2"
    },
    {
        id: 7,
        text: "Who went to location 3 at time 18:10?",
        answers: ["Kabir"],
        hint: "Find person_id from movements, then get name from people"
    },
    {
        id: 8,
        text: "Who is the thief?",
        answers: ["Kabir"],
        hint: "The volunteer who had access and went to Storage Room"
    }
];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Check if player name exists
    playerName = sessionStorage.getItem('playerName');
    if (!playerName) {
        window.location.href = 'index.html';
        return;
    }

    // Display player name
    document.getElementById('detective-name').textContent = playerName;

    // Initialize database and game
    await initSQLDatabase();
    setupEventListeners();
    questionsData = questions;
    totalQuestions = questions.length;
    renderQuestions();
});

// ============================================
// SQL DATABASE SETUP
// ============================================

async function initSQLDatabase() {
    try {
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });

        db = new SQL.Database();

        // Create tables
        db.run(`
            CREATE TABLE people (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                role TEXT NOT NULL
            );
        `);

        db.run(`
            CREATE TABLE locations (
                id INTEGER PRIMARY KEY,
                place TEXT NOT NULL
            );
        `);

        db.run(`
            CREATE TABLE movements (
                person_id INTEGER,
                place_id INTEGER,
                time TEXT NOT NULL,
                FOREIGN KEY (person_id) REFERENCES people(id),
                FOREIGN KEY (place_id) REFERENCES locations(id)
            );
        `);

        db.run(`
            CREATE TABLE clues (
                id INTEGER PRIMARY KEY,
                description TEXT NOT NULL
            );
        `);

        // Insert data
        db.run(`
            INSERT INTO people (id, name, role) VALUES
            (1, 'Rahul', 'student'),
            (2, 'Aisha', 'student'),
            (3, 'Kabir', 'volunteer'),
            (4, 'Neha', 'teacher'),
            (5, 'Rohan', 'guard');
        `);

        db.run(`
            INSERT INTO locations (id, place) VALUES
            (1, 'Hall'),
            (2, 'Stage'),
            (3, 'Storage Room'),
            (4, 'Gate');
        `);

        db.run(`
            INSERT INTO movements (person_id, place_id, time) VALUES
            (1, 1, '18:00'),
            (2, 2, '18:05'),
            (3, 3, '18:10'),
            (4, 1, '18:15'),
            (5, 4, '18:20'),
            (1, 3, '18:25');
        `);

        db.run(`
            INSERT INTO clues (id, description) VALUES
            (1, 'Trophy was last seen at Stage'),
            (2, 'Only volunteers had storage access'),
            (3, 'Theft happened after 18:05');
        `);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
        alert('Failed to initialize database. Please refresh the page.');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // SQL Editor
    const executeBtn = document.getElementById('execute-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sqlInput = document.getElementById('sql-input');

    executeBtn.addEventListener('click', executeQuery);
    clearBtn.addEventListener('click', clearEditor);

    // Execute on Ctrl+Enter
    sqlInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            executeQuery();
        }
    });

    // Hint modal
    const hintBtn = document.getElementById('hint-btn');
    const closeHintModal = document.getElementById('close-hint-modal');
    const hintModal = document.getElementById('hint-modal');

    hintBtn.addEventListener('click', () => {
        hintModal.classList.add('active');
    });

    closeHintModal.addEventListener('click', () => {
        hintModal.classList.remove('active');
    });

    hintModal.addEventListener('click', (e) => {
        if (e.target === hintModal) {
            hintModal.classList.remove('active');
        }
    });
}

// ============================================
// GAME FLOW
// ============================================

function renderQuestions() {
    const questionsList = document.getElementById('questions-list');
    questionsList.innerHTML = '';

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.id = `question-${q.id}`;

        questionDiv.innerHTML = `
            <div class="question-text">
                <span class="question-number">${q.id}</span>
                ${q.text}
            </div>
            <div class="answer-input-group">
                <input 
                    type="text" 
                    class="answer-input" 
                    id="answer-${q.id}"
                    placeholder="One word only..."
                    autocomplete="off"
                >
                <button class="btn-validate" onclick="validateAnswer(${q.id})">
                    Validate
                </button>
            </div>
            <div class="feedback-area" id="feedback-${q.id}"></div>
        `;

        questionsList.appendChild(questionDiv);
    });
}

function validateAnswer(questionId) {
    const question = questions.find(q => q.id === questionId);
    const input = document.getElementById(`answer-${questionId}`);
    const answer = input.value.trim();
    const feedbackArea = document.getElementById(`feedback-${questionId}`);
    const questionItem = document.getElementById(`question-${questionId}`);

    if (!answer) {
        return;
    }

    // RULE: Check if answer contains spaces (multi-word answer)
    if (answer.includes(' ')) {
        feedbackArea.innerHTML = `<div class="feedback incorrect">✗ Only ONE WORD allowed! No spaces permitted.</div>`;
        questionItem.classList.add('incorrect');
        return;
    }

    // Check if answer is correct (case-insensitive)
    const isCorrect = question.answers.some(
        correctAnswer => correctAnswer.toLowerCase() === answer.toLowerCase()
    );

    if (isCorrect) {
        // Only add points if not already answered correctly
        if (!answeredCorrectly.has(questionId)) {
            score += 5;
            answeredCorrectly.add(questionId);
        }

        feedbackArea.innerHTML = `<div class="feedback correct">✓ Correct! +5 points</div>`;
        questionItem.classList.add('correct');
        questionItem.classList.remove('incorrect');
        input.disabled = true;

        // Check if all questions answered correctly with perfect score
        if (answeredCorrectly.size === totalQuestions && mistakes === 0) {
            setTimeout(navigateToSuccess, 1000);
        }
    } else {
        score -= 1;
        mistakes++;
        feedbackArea.innerHTML = `<div class="feedback incorrect">✗ Incorrect. Try again! -1 point</div>`;
        questionItem.classList.add('incorrect');
    }

    updateScore();
}

function updateScore() {
    document.getElementById('score-value').textContent = score;
}

function navigateToSuccess() {
    // Store final score in sessionStorage
    sessionStorage.setItem('finalScore', score);
    // Navigate to success page
    window.location.href = 'success.html';
}

// ============================================
// SQL EDITOR
// ============================================

function executeQuery() {
    const sqlInput = document.getElementById('sql-input');
    const query = sqlInput.value.trim();
    const outputDiv = document.getElementById('sql-output');

    if (!query) {
        outputDiv.innerHTML = '<div class="error-message">Please enter a query</div>';
        return;
    }

    // Security check: Only allow SELECT queries
    const dangerousKeywords = /\b(DELETE|DROP|UPDATE|INSERT|ALTER|TRUNCATE|CREATE|REPLACE)\b/i;
    if (dangerousKeywords.test(query)) {
        outputDiv.innerHTML = `
            <div class="error-message">
                🚫 Security Alert: Only SELECT queries are allowed in this game!
            </div>
        `;
        return;
    }

    try {
        const results = db.exec(query);

        if (results.length === 0) {
            outputDiv.innerHTML = `
                <div class="success-message">
                    Query executed successfully (0 rows returned)
                </div>
            `;
            return;
        }

        // Display results as table
        const result = results[0];
        let tableHTML = '<table><thead><tr>';

        // Headers
        result.columns.forEach(col => {
            tableHTML += `<th>${escapeHtml(col)}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        // Rows
        result.values.forEach(row => {
            tableHTML += '<tr>';
            row.forEach(cell => {
                tableHTML += `<td>${escapeHtml(String(cell))}</td>`;
            });
            tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table>';
        outputDiv.innerHTML = tableHTML;

    } catch (error) {
        outputDiv.innerHTML = `
            <div class="error-message">
                ❌ Error: ${escapeHtml(error.message)}
            </div>
        `;
    }
}

function clearEditor() {
    document.getElementById('sql-input').value = '';
    document.getElementById('sql-output').innerHTML =
        '<div class="output-placeholder">Query results will appear here...</div>';
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Make validateAnswer available globally
window.validateAnswer = validateAnswer;
