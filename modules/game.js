import { pool } from "../config/params.js";
async function getVersion(req, res) {
    try {
        const [news] = await pool.query('SELECT value FROM `settings_login` WHERE name = ?', ['sNews']);
        const [client] = await pool.query('SELECT value FROM `settings_login` WHERE name = ?', ['sFile']);
        const [title] = await pool.query('SELECT value FROM `settings_login` WHERE name = ?', ['sTitle']);
        const [background] = await pool.query('SELECT value FROM `settings_login` WHERE name = ?', ['sBG']);
        const [music] = await pool.query('SELECT value FROM `settings_login` WHERE name = ?', ['sBGM']);
        const [signup] = await pool.query('SELECT value FROM `settings_login` WHERE name = ?', ['sNewUser']);
        const [character] = await pool.query('SELECT value FROM `settings_login` WHERE name = ?', ['sCharacter']);
        const [emoji] = await pool.query('SELECT value FROM `settings_login` WHERE name = ?', ['sEmoji']);
        const token = req.session.token;
        const userId = req.userId;
        const [userData] = await pool.query('SELECT Name, Hash FROM users_characters WHERE UserId = ?', [userId]);

        if (!userData || userData.length === 0) {
            console.log('User data not found for user ID:', userId);
            return res.status(404).json({ error: 'User data not found' });
        }
        const { Name, Hash } = userData[0];

        console.log(`[zCore] Game data retrieved for user ID:`, userId);

        const gameData = {
            sFile: client[0].value,
            sTitle: title[0].value,
            sBG: background[0].value,
            sBGM: music[0].value,
            sNews: news[0].value,
            sNewUser: signup[0].value,
            sCharacter: character[0].value,
            sEmoji: emoji[0].value,
            sUsername: Name,
        };

        res.status(200).json(gameData);
    } catch (error) {
        console.error('Error in getVersion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export { getVersion };
