import { pool } from "../config/params.js";
import axios from 'axios'; // for fetching IP data
import bcrypt from 'bcrypt';
async function registerUser(
    username,
    password,
    email,
    type = 'Player' // Default user type
) {
    try {
        // Fixed regex to correctly escape special characters
        const escapedUsername = username.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');

        // Check for existing username or email
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE Name = ? OR Email = ?', [escapedUsername, email]);
        if (existingUsers.length > 0) {
            return {status: 'Error', strReason: 'The username or email is already in use.'};
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get user IP address (avoid directly storing user IP in logs or database for privacy concerns)
        const ipResponse = await axios.get('https://ipinfo.io/json?token=0da49c2bd3185f');
        const userIP = ipResponse.data?.ip || '0.0.0.0'; // Handle potential API errors

        // Create user with a single transaction
        const connection = await pool.getConnection(); // Get a single connection
        await connection.beginTransaction(); // Start the transaction

        try {
            // Create user
            const dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const [newUser] = await pool.query('INSERT INTO users (Name, Hash, Email, Type, LastLogin, SignupDate, IP) VALUES (?, ?, ?, ?, ?, ?, ?)', [escapedUsername, hashedPassword, email, type, dateCreated, dateCreated, userIP]);
            const userID = newUser.insertId;
            // Create character
            const characterData = {
                UserId: userID,
                Name: escapedUsername,
                // Replace with your specific game schema and set default or user-selected values
                HairID: 52, // Replace with default or selection logic
                Access: 1, // Replace with default or selection logic
                Stage: 'Adult', // Replace with default or selection logic
                SkillPoints: 0,
                RaceID: 1, // Replace with default or selection logic
                RaceXP: 0,
                ActivationFlag: 5,
                PermamuteFlag: 0,
                Country: 'CN', // Replace with default country code or selection logic
                Gender: 'M', // Replace with default gender or selection logic
                Level: 1,
                Copper: 0,
                Silver: 0,
                Gold: 0,
                Coins: 0,
                Exp: 0,
                ColorHair: '000000',
                ColorSkin: '000000',
                ColorEye: '000000',
                ColorBase: '000000',
                ColorTrim: '000000',
                ColorAccessory: '000000',
                SlotsBag: 60,
                SlotsBank: 0,
                SlotsHouse: 20,
                SlotsAuction: 5,
                DateCreated: new Date().toISOString().slice(0, 19).replace('T', ' '),
                LastLogin: new Date().toISOString().slice(0, 19).replace('T', ' '),
                CpBoostExpire: '1999-12-31 04:00:00',
                RepBoostExpire: '1999-12-31 04:00:00',
                GoldBoostExpire: '1999-12-31 04:00:00',
                ExpBoostExpire: '1999-12-31 04:00:00',
                UpgradeExpire: '1999-12-31 04:00:00',
                UpgradeDays: 0,
                Upgraded: '0',
                Achievement: 0,
                Settings: 0,
                Quests: '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                Quests2: '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                DailyQuests0: 0,
                DailyQuests1: 0,
                DailyQuests2: 0,
                MonthlyQuests0: 0,
                LastArea: 'faroff-1|Enter|Spawn',
                SpawnPoint: 'faroff-1|Enter|Spawn',
                CurrentServer: 'Offline',
                HouseInfo: '',
                KillCount: 0,
                DeathCount: 0,
                Address: userIP,
                Language: 'en',
                Rebirth: 0,
                Bounty: 0,
                Coordinates: '0|0',
                Fly: 0,
                ChatColor: '9CCAFD',
                Age: 15,
                Email: email, // Include registered email address
                Hash: hashedPassword
            };

            const query = `INSERT INTO users_characters
                           SET UserId = ?, Name = ?, HairID = ?, Access = ?, Stage = ?,
                               SkillPoints = ?, RaceID = ?, RaceXP = ?, ActivationFlag = ?, PermamuteFlag = ?,
                               Country = ?, Gender = ?, Level = ?, Copper = ?, Silver = ?, Gold = ?, Coins = ?, Exp = ?,
                               ColorHair = ?, ColorSkin = ?, ColorEye = ?, ColorBase = ?, ColorTrim = ?, ColorAccessory = ?,
                               SlotsBag = ?, SlotsBank = ?, SlotsHouse = ?, SlotsAuction = ?, DateCreated = ?,
                               LastLogin = ?, CpBoostExpire = ?, RepBoostExpire = ?, GoldBoostExpire = ?, ExpBoostExpire = ?,
                               UpgradeExpire = ?, UpgradeDays = ?, Upgraded = ?, Achievement = ?, Settings = ?, Quests = ?,
                               Quests2 = ?, DailyQuests0 = ?, DailyQuests1 = ?, DailyQuests2 = ?, MonthlyQuests0 = ?,
                               LastArea = ?, SpawnPoint = ?, CurrentServer = ?, HouseInfo = ?, KillCount = ?, DeathCount = ?,
                               Address = ?, Language = ?, Rebirth = ?, Bounty = ?, Coordinates = ?, Fly = ?, ChatColor = ?,
                               Age = ?, Email = ?, Hash = ?`;

// Replace the question marks with the actual values to be inserted (obtained elsewhere)
            await pool.query(query, [
                characterData.UserId,
                characterData.Name,
                characterData.HairID,
                characterData.Access,
                characterData.Stage,
                characterData.SkillPoints,
                characterData.RaceID,
                characterData.RaceXP,
                characterData.ActivationFlag,
                characterData.PermamuteFlag,
                characterData.Country,
                characterData.Gender,
                characterData.Level,
                characterData.Copper,
                characterData.Silver,
                characterData.Gold,
                characterData.Coins,
                characterData.Exp,
                characterData.ColorHair,
                characterData.ColorSkin,
                characterData.ColorEye,
                characterData.ColorBase,
                characterData.ColorTrim,
                characterData.ColorAccessory,
                characterData.SlotsBag,
                characterData.SlotsBank,
                characterData.SlotsHouse,
                characterData.SlotsAuction,
                characterData.DateCreated,
                characterData.LastLogin,
                characterData.CpBoostExpire,
                characterData.RepBoostExpire,
                characterData.GoldBoostExpire,
                characterData.ExpBoostExpire,
                characterData.UpgradeExpire,
                characterData.UpgradeDays,
                characterData.Upgraded,
                characterData.Achievement,
                characterData.Settings,
                characterData.Quests,
                characterData.Quests2,
                characterData.DailyQuests0,
                characterData.DailyQuests1,
                characterData.DailyQuests2,
                characterData.MonthlyQuests0,
                characterData.LastArea,
                characterData.SpawnPoint,
                characterData.CurrentServer,
                characterData.HouseInfo,
                characterData.KillCount,
                characterData.DeathCount,
                characterData.Address,
                characterData.Language,
                characterData.Rebirth,
                characterData.Bounty,
                characterData.Coordinates,
                characterData.Fly,
                characterData.ChatColor,
                characterData.Age,
                characterData.Email,
                characterData.Hash
            ]);

            // Use the inserted characterID for subsequent queries
            const [insertedCharacter] = await pool.query(
                "SELECT * FROM users_characters WHERE CharacterID = LAST_INSERT_ID()"
            );
            const characterID = insertedCharacter[0].CharacterID; // Access the ID from the first element

            // Additional inserts using characterID
            await pool.query('INSERT INTO users_characters_items (CharacterID, ItemID, ElementID, RefineID, Equipped, Quantity, Bank, DatePurchased) VALUES (?, 1, 1, 0, 1, 1, 0, ?)', [characterID, dateCreated]);
            await pool.query('INSERT INTO users_characters_job_skills (CharacterID, ClassID, SkillID, Slot, Level) VALUES (?, 1, 1, 1, 1)', [characterID]);
            await pool.query('INSERT INTO users_characters_friends (CharacterID, FriendID) VALUES (?, ?)', [characterID, 1]);
            await pool.query('INSERT INTO users_characters_banks (CharacterID, Pin, Copper, Silver, Gold, Coins) VALUES (?, 123456, 0, 0, 0, 5000)', [characterID]); // Assuming empty pin and starting balance
            await pool.query('INSERT INTO users_characters_stats (CharacterID, Points, Strength, Intellect, Endurance, Dexterity, Wisdom, Luck) VALUES (?, 3, 0, 0, 0, 0, 0, 0)', [characterID]);
            await pool.query('INSERT INTO users_characters_vending (CharacterID, Copper, Silver, Gold, Coins) VALUES (?, 0, 0, 0, 0)', [characterID]);

            await connection.commit(); // Explicitly commit the transaction

            console.log(`[zCore] User "${username}" with ID ${userID} and character "${characterData.Name}" created successfully!`);
            return {status: 'Success', user: {username, userID}, character: {CharacterID: characterID, Name: characterData.Name, dateCreated}};

        } catch (error) {
            // Rollback the transaction on any error
            await connection.rollback();
            console.error('Error creating user or character:', error);
            return {status: 'Error', strReason: 'An error occurred while creating the user or character.'};
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error creating user or character:', error);
        return {status: 'Error', strReason: 'An error occurred while creating the user or character.'};
    }
}

async function handleRegister (req, res){
    try {
        // Destructure required fields from the request body
        const { username, password, email } = req.body;

        // Validate required fields
        if (!username || !password || !email) {
            return res.status(400).json({ error: 'Missing required fields: username, password, and email.' });
        }

        // Call the updated registerUser function
        const registerResult = await registerUser(username, password, email); // Use updated function signature

        if (registerResult.status === 'Success') {
            res.status(201).json(registerResult);
        } else {
            res.status(400).json({ error: registerResult.strReason });
        }
    } catch (error) {
        console.error(error);
        // Provide a more specific error message if possible
        if (error.code === 'ER_TRUNCATED_WRONG_VALUE' && error.sqlMessage.includes('UpgradeExpire')) {
            return res.status(400).json({ error: 'Invalid datetime value for UpgradeExpire.' });
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export { registerUser, handleRegister }