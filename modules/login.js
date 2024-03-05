import bcrypt from 'bcrypt';
import {generateToken, pool} from "../config/params.js";

async function getServerInfo() {
    try {
        const [serverInfo] = await pool.query('SELECT * FROM servers LIMIT 1'); // Adjust query as needed
        return serverInfo[0];
    } catch (error) {
        console.error(error);
        throw new Error('Database error');
    }
}

async function getCharacterData(userId) {
    try {
        const [characters] = await pool.query(
            'SELECT * FROM users_characters WHERE UserID = ?',
            [userId]
        );

        const characterData = characters.map((char) => ({
            charID: char.CharacterID,
            sName: char.Name,
            Stage: char.Stage,
            Race: char.Race,
            Copper: char.Copper,
            Silver: char.Silver,
            Gold: char.Gold,
            Coins: char.Coins,
            iLevel: char.Level,
            sGender: char.Gender,
            intColorSkin: char.ColorSkin,
            intColorEye: char.ColorEye,
            intColorHair: char.ColorHair,
            intColorBase: char.ColorBase,
            intColorTrim: char.ColorTrim,
            intColorAccessory: char.ColorAccessory,
            strHairName: char.HairName,
            strHairFilename: char.File,
            LastLogin: char.LastLogin,
            DateCreated: char.DateCreated,
            // ... other character-specific properties
        }));

        return characterData;
    } catch (error) {
        console.error(error);
        throw new Error('Database error');
    }
}

// Assuming you have functions for retrieving additional data from other tables (modify as needed)
async function getNewsData() {
    try {
        const [newsInfo] = await pool.query('SELECT * FROM settings_login WHERE name = \'bNews\'');
        return newsInfo[0].value;
    } catch (error) {
        console.error(error);
        throw new Error('Database error');
    }
}

async function getItemsData(characterId) {
    try {
        const [items] = await pool.query(
            'SELECT * FROM users_characters_items WHERE Equipped = 1 AND CharacterID = ?',
            [characterId]
        );

        const itemData = items.map((item) => ({
            sES: item.Equipment,
            sType: item.Type,
            sFile: item.File,
            sLink: item.Link,
        }));

        return itemData;
    } catch (error) {
        console.error(error);
        throw new Error('Database error');
    }
}

async function authenticateUser(username, password, req) {
    try {
        if (!username) {
            throw new Error('Username is undefined or null');
        }

        const escapedUsername = username.replace(/[-_\s`~!@#$%^&*()+={}\[\]:;'<>,.?\/|\\]/g, '\\$&');


        const [user] = await pool.query('SELECT * FROM users WHERE Name = ?', [escapedUsername]);

        if (user.length === 0) {
            return { bSuccess: 0, sMsg: 'Invalid credentials' };
        }

        const validPassword = await bcrypt.compare(password, user[0].Hash);

        if (!validPassword) {
            return { bSuccess: 0, sMsg: 'Invalid credentials' };
        }

        const token = generateToken(user[0].id);
        req.session.token = token;

        // Update user's last login and IP (example) - modify as needed
        await pool.query('UPDATE users SET LastLogin = NOW(), IP = ? WHERE id = ?', [req.ip, user[0].id]);

        const serverInfo = await getServerInfo(); // Fetch server info
        const characterData = await getCharacterData(user[0].id); // Fetch characters
        const newsData = await getNewsData(); // Fetch news (modify function as needed)
        const itemsData = await getItemsData(); // Fetch items
        req.session.token = token;
        return {
            bSuccess: 1,
            userid: user[0].id,
            password: user[0].Hash,
            // Replace with relevant token generation logic (e.g., JWT)
            token, // Placeholder for actual token
            sMsg: 'Welcome back!', // Add a success message
            characters: characterData,
            servers: serverInfo,
            news: newsData,
            items: itemsData,
            // ... additional data as needed from other functions
        };
    } catch (error) {
        console.log(error);
        throw new Error('Database error');
    }
}

async function handleLogin(req, res) {
    try {
        const { username, password } = req.body;
        const authResult = await authenticateUser(username, password, req);
        if (authResult.bSuccess) {
            req.session.token = authResult.token;
            res.status(200).json(authResult);
            console.log(`[zCore] User: ${username} has logged in the game!`)
        } else {
            res.status(401).json({ error: authResult.sMsg }); // Replace error message as needed
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export { authenticateUser, handleLogin, getCharacterData, };
