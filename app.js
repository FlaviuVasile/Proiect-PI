import express from 'express';
import sqlite3 from 'sqlite3';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { Database } = sqlite3.verbose();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new Database('./sqlite.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectat la baza de date SQLite.');
        initializeDB();
    }
});

function initializeDB() {
    db.run("CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, password TEXT)", (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log("Tabelul 'users' a fost creat sau există deja.");
        }
    });

    // Crearea tabelului 'projects'
    db.run("CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT)", (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log("Tabelul 'projects' a fost creat sau există deja.");
        }
    });

    // Crearea tabelului 'sprints'
    db.run("CREATE TABLE IF NOT EXISTS sprints (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER, status TEXT, indicator TEXT, hours_worked INTEGER, capacity INTEGER, story_points_completed INTEGER, total_story_points INTEGER, FOREIGN KEY(project_id) REFERENCES projects(id))", (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log("Tabelul 'sprints' a fost creat sau există deja.");
        }
    });
}

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    if(password[0] != password[1]) {
        res.status(201).send({ message: 'Parolele nu fac match'});
    }
    else {
        db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, password[0]], function(err) {
            if (err) {
                res.status(400).send({ error: err.message });
            } else {
                res.redirect('/');
            }
        });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check for email and password in the request
    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required.' });
    }

    try {
        // Retrieve user from the database
        const user = await dbQuery(`SELECT * FROM users WHERE email = ?`, [email]);

        if (!user) {
            return res.status(401).send({ message: '1Invalid credentials.' });
        }
        if(user.password !== password) {
            return res.status(401).send({ message: '2Invalid credentials.' });
        }

        const sessionToken = "logged";

        res.status(200).send({ message: "Autentificare reușită", token: sessionToken }); 

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error during login." });
    }
});

app.post('/add', async (req, res) => {
    const { titlu, descriere } = req.body;

    // Verifică dacă titlul și descrierea sunt furnizate
    if (!titlu || !descriere) {
        return res.status(400).send({ message: 'Titlul și descrierea sunt obligatorii.' });
    }

    const query = 'INSERT INTO projects (title, description) VALUES (?, ?)';

    db.run(query, [titlu, descriere], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send({ message: 'Eroare la adăugarea proiectului în baza de date.' });
        } else {
            console.log('Proiect adăugat cu succes cu ID-ul:', this.lastID);
            res.status(201).send({ message: 'Proiect adăugat cu succes.', projectId: this.lastID });
        }
    });
});


app.use(express.static(path.join(__dirname, 'frontend')));

// mapping get pentru ficare .html fisier 
app.get('/*', (req, res, next) => {
    let routeName = req.path.substring(1);
    
    if (routeName === '') routeName = 'index';

    const filePath = path.join(__dirname, 'frontend', `${routeName}.html`);

    res.sendFile(filePath, (err) => {
        if (err) {
            next();
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT}`);
});


// asyncronous method for querying the database
async function dbQuery(query, args) {
    return new Promise((resolve, reject) => {
        db.get(query, args, (err, row) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}