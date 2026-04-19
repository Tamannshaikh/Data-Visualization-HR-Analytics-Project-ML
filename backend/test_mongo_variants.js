const mongoose = require('mongoose');

const uri1 = "mongodb+srv://shaikhtamanna678_db_user:RuEVnMWowdyfLRON@corphr.xivppmw.mongodb.net/hr_dashboard?retryWrites=true&w=majority&appName=CorpHR";
const uri2 = "mongodb+srv://corphrAdmin:RuEVnMWowdyfLRON@corphr.xivppmw.mongodb.net/hr_dashboard?retryWrites=true&w=majority&appName=CorpHR";

async function test(uri, name) {
    console.log(`Testing ${name}...`);
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log(`✅ ${name} connected!`);
        await mongoose.disconnect();
        return true;
    } catch (err) {
        console.log(`❌ ${name} failed: ${err.message}`);
        return false;
    }
}

async function run() {
    const r1 = await test(uri1, "User-provided URI (shaikhtamanna678_db_user)");
    const r2 = await test(uri2, "README URI (corphrAdmin)");
    
    if (r1 || r2) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

run();
