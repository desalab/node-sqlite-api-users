import sqlite3

conn = sqlite3.connect('./database/cognos.db')


cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT
)
''')

conn.close()

