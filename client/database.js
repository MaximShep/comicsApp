import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('db.db');

// Обёртка для выполнения SQL-запроса с промисом
const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        params,
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

const getAllImage = async () => {
  try {
    const result = await executeQuery('SELECT * FROM image');
    console.log('Image data:', result.rows._array);
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};

const saveImage = async (base64Svg) => {
  try {
    const query = `INSERT INTO image (base64) VALUES (?);`;
    const result = await executeQuery(query, [base64Svg]);
    console.log('Saved image ID:', result.insertId);
    return result.insertId;
  } catch (error) {
    console.error('Error saving image:', error);
  }
};

export { db, getAllImage, saveImage };
