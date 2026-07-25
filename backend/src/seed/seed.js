import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Disease from '../models/Disease.js';
import Medicine from '../models/Medicine.js';

const diseases = [
  {
    name: 'Tomato Early Blight',
    crop: 'Tomato',
    classLabel: 'tomato_early_blight',
    description: 'A fungal disease causing dark concentric spots on leaves, common in warm humid weather.',
    symptoms: ['Dark concentric rings on leaves', 'Yellowing around lesions', 'Leaf drop'],
    causes: ['Alternaria solani fungus', 'High humidity', 'Poor air circulation'],
    preventiveMeasures: ['Crop rotation', 'Avoid overhead irrigation', 'Remove infected debris'],
    organicTreatment: ['Neem oil spray', 'Copper-based fungicide'],
    chemicalTreatment: ['Chlorothalonil', 'Mancozeb'],
    estimatedRecoveryDays: 14,
    sprayIntervalDays: 7,
  },
  {
    name: 'Rice Blast',
    crop: 'Rice',
    classLabel: 'rice_blast',
    description: 'A destructive fungal disease affecting leaves, stems, and panicles of rice.',
    symptoms: ['Diamond-shaped lesions', 'Grayish centers with brown margins'],
    causes: ['Magnaporthe oryzae fungus', 'High nitrogen fertilization', 'Prolonged leaf wetness'],
    preventiveMeasures: ['Use resistant varieties', 'Balanced fertilization', 'Proper field drainage'],
    organicTreatment: ['Trichoderma-based biofungicide'],
    chemicalTreatment: ['Tricyclazole', 'Isoprothiolane'],
    estimatedRecoveryDays: 21,
    sprayIntervalDays: 10,
  },
  {
    name: 'Potato Late Blight',
    crop: 'Potato',
    classLabel: 'potato_late_blight',
    description: 'A serious oomycete disease that can destroy entire potato crops rapidly in cool wet weather.',
    symptoms: ['Water-soaked lesions on leaves', 'White fungal growth on leaf undersides', 'Tuber rot'],
    causes: ['Phytophthora infestans', 'Cool moist conditions'],
    preventiveMeasures: ['Plant certified disease-free seed', 'Hill soil around plants', 'Avoid excess irrigation'],
    organicTreatment: ['Copper hydroxide spray'],
    chemicalTreatment: ['Metalaxyl', 'Chlorothalonil'],
    estimatedRecoveryDays: 10,
    sprayIntervalDays: 5,
  },
  {
    name: 'Healthy',
    crop: 'General',
    classLabel: 'healthy',
    isHealthy: true,
    description: 'No visible signs of disease detected. Crop appears healthy.',
    symptoms: [],
    causes: [],
    preventiveMeasures: ['Continue regular monitoring', 'Maintain balanced nutrition', 'Ensure proper irrigation'],
    organicTreatment: [],
    chemicalTreatment: [],
    estimatedRecoveryDays: 0,
    sprayIntervalDays: 0,
  },
];

const medicines = [
  { name: 'Neem Oil', type: 'organic', activeIngredient: 'Azadirachtin', dosage: '5ml per liter of water', applicationMethod: 'Foliar spray', price: 250 },
  { name: 'Copper Oxychloride', type: 'chemical', activeIngredient: 'Copper', dosage: '3g per liter of water', applicationMethod: 'Foliar spray', price: 180 },
  { name: 'Mancozeb 75% WP', type: 'chemical', activeIngredient: 'Mancozeb', dosage: '2.5g per liter of water', applicationMethod: 'Foliar spray', price: 220 },
  { name: 'NPK 19:19:19', type: 'fertilizer', activeIngredient: 'Nitrogen-Phosphorus-Potassium', dosage: '50kg per acre', applicationMethod: 'Soil application', price: 1200 },
];

const run = async () => {
  await connectDB();

  await Promise.all([Disease.deleteMany({}), Medicine.deleteMany({})]);

  const createdMedicines = await Medicine.insertMany(medicines);
  const createdDiseases = await Disease.insertMany(
    diseases.map((d, i) => ({
      ...d,
      recommendedMedicines: i < 3 ? [createdMedicines[i % createdMedicines.length]._id] : [],
    }))
  );

  const adminExists = await User.findOne({ email: 'admin@aifarmer.app' });
  if (!adminExists) {
    await User.create({
      name: 'Platform Admin',
      email: 'admin@aifarmer.app',
      password: 'Admin@12345',
      role: 'admin',
      isVerified: true,
    });
  }

  const farmerExists = await User.findOne({ email: 'farmer@aifarmer.app' });
  if (!farmerExists) {
    await User.create({
      name: 'Demo Farmer',
      email: 'farmer@aifarmer.app',
      password: 'Farmer@12345',
      role: 'farmer',
      isVerified: true,
      farmDetails: { farmSize: 5, primaryCrops: ['Rice', 'Tomato'], soilType: 'Loamy' },
    });
  }

  const expertExists = await User.findOne({ email: 'expert@aifarmer.app' });
  if (!expertExists) {
    await User.create({
      name: 'Dr. Agri Expert',
      email: 'expert@aifarmer.app',
      password: 'Expert@12345',
      role: 'expert',
      isVerified: true,
      expertDetails: { specialization: ['Plant Pathology'], experienceYears: 8, verified: true },
    });
  }

  console.log(`Seeded ${createdDiseases.length} diseases, ${createdMedicines.length} medicines, and demo users.`);
  console.log('Demo logins: admin@aifarmer.app / Admin@12345, farmer@aifarmer.app / Farmer@12345, expert@aifarmer.app / Expert@12345');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
