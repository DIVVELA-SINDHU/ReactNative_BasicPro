import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const openDatabase = async () => {
    try {
        const db = await SQLite.openDatabase({ name: "users.db", location: "default" });
        return db;
    } catch (error) {
        console.error("error creating database", error);
        throw error;
    }
}

export const createTable = async () => {
    const db = await openDatabase();
    await db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS UsersData (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, phone TEXT, password TEXT)',
        )
    })
}

export const insertUser = async (email, phone, password) => {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO UsersData(email,phone,password) VALUES (?,?,?)',
                [email, phone, password],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            )
        })
    })
}

export const deleteUser = async (email) => {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM UsersData WHERE email = ?',
                [email],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                (_, error) => reject(error)
            );
        });
    });
};

export const fetchUsers = async () => {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM UsersData',
                [],
                (_, result) => {
                    if (result.rows.length === 0) {
                        resolve(null);
                    } else {
                        // without this array creation data cant be accessed
                        const users = [];
                        for (let i = 0; i < result.rows.length; i++) {
                            users.push(result.rows.item(i));
                        }
                        resolve(users);
                    }
                },
                (_, error) => reject(error)
            );
        });
    });
};


export const findUser = async (email) => {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT email,password FROM UsersData where email=?',
                [email],
                (_, result) => {
                    if (result.rows.length > 0) {
                        resolve(result.rows.item(0));
                    } else {
                        resolve(null);
                    }
                },
                (_, error) => reject(error)
            )
        })
    })
}