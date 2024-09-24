import sqlite3
import os.path

def drop_table():
    with sqlite3.connect('./database/users.db') as connection:
        c = connection.cursor()
        c.execute("""DROP TABLE IF EXISTS users;""")
    return True


def create_db():
    with sqlite3.connect('./database/users.db') as connection:
        c = connection.cursor()
        table = """CREATE TABLE users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL,
            roll_number VARCHAR(20) NOT NULL
        );
        """
        c.execute(table)
    return True


if __name__ == '__main__':

    if (os.path.isfile("./database/users.db")):
        print("Database Already exists! This will overwrite it! are you sure you want to continue (yes/no)?")
        if (input() != "yes"): exit(0)

    drop_table()
    create_db()
