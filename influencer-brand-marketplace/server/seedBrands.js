const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Brand = require('./models/Brand');
const User = require('./models/User');

dotenv.config();

const sampleBrands = [
  {
    userId: null, // Will be set after creating user
    companyName: 'TechNova Solutions',
    website: 'https://technova.com',
    description: 'Leading technology solutions provider specializing in digital transformation and cloud services.',
    industry: 'Technology',
    logo: 'https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=TechNova'
  },
  {
    userId: null,
    companyName: 'Fashion Forward',
    website: 'https://fashionforward.com',
    description: 'Premium fashion brand offering sustainable and trendy clothing for modern professionals.',
    industry: 'Fashion',
    logo: 'https://via.placeholder.com/150x150/E11D48/FFFFFF?text=Fashion'
  },
  {
    userId: null,
    companyName: 'GreenLife Wellness',
    website: 'https://greenlifewellness.com',
    description: 'Organic wellness products and natural supplements for a healthier lifestyle.',
    industry: 'Health & Wellness',
    logo: 'https://via.placeholder.com/150x150/10B981/FFFFFF?text=GreenLife'
  },
  {
    userId: null,
    companyName: 'Creative Studio Pro',
    website: 'https://creativestudiopro.com',
    description: 'Full-service creative agency specializing in branding, web design, and digital marketing.',
    industry: 'Creative Services',
    logo: 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=Creative'
  },
  {
    userId: null,
    companyName: 'FitLife Nutrition',
    website: 'https://fitlifenutrition.com',
    description: 'Premium sports nutrition and fitness supplements for athletes and fitness enthusiasts.',
    industry: 'Fitness',
    logo: 'https://via.placeholder.com/150x150/EF4444/FFFFFF?text=FitLife'
  }
];

async function seedBrands() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/influencer-marketplace');
    console.log('Connected to MongoDB');

    // Clear existing brands
    await Brand.deleteMany({});
    console.log('Cleared existing brands');

    // Create sample users and brands
    for (let i = 0; i < sampleBrands.length; i++) {
      const brandData = sampleBrands[i];

      // Create a user for this brand
      const user = new User({
        email: `brand${i + 1}@example.com`,
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fEtTT2/Da', // "password123"
        role: 'brand',
        name: brandData.companyName,
        profileCompleted: true,
        emailVerified: true
      });

      await user.save();
      console.log(`Created user: ${user.email}`);

      // Create brand profile
      const brand = new Brand({
        ...brandData,
        userId: user._id
      });

      await brand.save();
      console.log(`Created brand: ${brand.companyName}`);
    }

    console.log('✅ Successfully seeded brand data!');
    console.log('\n📋 Sample Brand Accounts Created:');
    console.log('Email: brand1@example.com, Password: password123');
    console.log('Email: brand2@example.com, Password: password123');
    console.log('Email: brand3@example.com, Password: password123');
    console.log('Email: brand4@example.com, Password: password123');
    console.log('Email: brand5@example.com, Password: password123');

  } catch (error) {
    console.error('❌ Error seeding brands:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeder
seedBrands();
