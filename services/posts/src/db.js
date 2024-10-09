const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbPath = './../../storage/db.sql'
const initPath = './../../storage/init-db.sql'


const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error("Error connecting to the database:", err.message);
    }
    console.log('Connected to the SQLite database.');
})

/////////////////
// const sql = fs.readFileSync(initPath, 'utf-8');
//
// db.exec(sql, (err) => {
//     if (err) {
//         return console.error("Error initializing database:", err.message);
//     }
//     console.log('Database initialized successfully.');
// });
////////////////

const readData = (tableName) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM " + tableName;

        let items = [];

        db.all(sql, [], (err, rows) => {
            if (err) {
                return reject(err);
            }

            if (rows.length >= 10) {
                items = rows.slice(-10);
            } else {
                items = rows;
            }
            resolve(items.reverse());
        });
    });
};

const writeData = (tableName, data) => {
    const values = `('${data.username}', '${data.content}');`
    const sql = `INSERT INTO ${tableName} (${Object.keys(data).join(', ')}) VALUES ${values}`;

    console.log('SQL: ', sql);

    // db.run(sql, Object.values(data), function(err) {
    //     if (err) {
    //         return console.error('Error inserting data:', err.message);
    //     }
    //
    //     console.log('Data was inserted');
    // });

    db.exec(sql, (err, result) => {
            if (err) {
                return console.error('Error inserting data:', err.message);
            }

            console.log('Data was inserted');
    })
}

module.exports = {readData, writeData}