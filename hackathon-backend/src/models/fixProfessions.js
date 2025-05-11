const mongoose = require('mongoose');
const User = require('./User');

const mongoUri = 'mongodb://localhost:27017/hackathon2025';

async function fixProfessions() {
  await mongoose.connect(mongoUri);
  const res1 = await User.updateMany({ profession: 'professeur' }, { $set: { profession: 'professor' } });
  const res2 = await User.updateMany({ profession: 'etudiant' }, { $set: { profession: 'student' } });
  console.log('Updated professions:', { professeurToProfessor: res1.modifiedCount, etudiantToStudent: res2.modifiedCount });
  await mongoose.disconnect();
}

fixProfessions().catch(err => { console.error(err); process.exit(1); }); 