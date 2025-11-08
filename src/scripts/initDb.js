require('dotenv').config();
const { initDb, initializeDatabase, close } = require('../config/database');
const User = require('../models/User');
const Project = require('../models/Project');

async function init() {
  console.log('Initializing database...');

  // Initialize SQL.js and schema
  await initDb();
  initializeDatabase();

  // Create sample data
  console.log('Creating sample data...');

  try {
    // Create sample engineers
    const engineer1 = User.create({
      email: 'john.engineer@example.com',
      password: 'password123',
      name: 'John Builder',
      userType: 'engineer',
      phone: '555-0101',
      location: 'Portland, OR',
      bio: 'Experienced DIY engineer with 15 years in carpentry and general construction. Love giving back to my community!',
      skills: 'Carpentry, Plumbing, Electrical, Landscaping'
    });

    const engineer2 = User.create({
      email: 'sarah.maker@example.com',
      password: 'password123',
      name: 'Sarah Maker',
      userType: 'engineer',
      phone: '555-0102',
      location: 'Seattle, WA',
      bio: 'Mechanical engineer by day, community builder by weekend. Specialized in playground equipment and accessibility projects.',
      skills: 'Mechanical Design, Welding, CAD, Accessibility Design'
    });

    // Create sample communities
    const community1 = User.create({
      email: 'greenpark@community.org',
      password: 'password123',
      name: 'Green Park Community Center',
      userType: 'community',
      phone: '555-0201',
      location: 'Portland, OR',
      bio: 'We serve a diverse community of 5,000 families in downtown Portland. Always looking for help with community improvement projects.'
    });

    const community2 = User.create({
      email: 'oakridge@community.org',
      password: 'password123',
      name: 'Oak Ridge Neighborhood Association',
      userType: 'community',
      phone: '555-0202',
      location: 'Seattle, WA',
      bio: 'Small neighborhood association focused on creating safe, accessible spaces for all residents.'
    });

    // Create sample projects
    const project1 = Project.create({
      communityId: community1.id,
      title: 'Community Garden Raised Beds',
      description: 'We need help building 10 raised garden beds (4x8 feet each) for our community garden. Materials will be provided, but we need skilled hands to help with construction. This project will help provide fresh produce to 30+ families.',
      category: 'Construction',
      requiredSkills: 'Carpentry, Basic Tools',
      location: 'Portland, OR',
      budgetMin: 0,
      budgetMax: 500,
      timeline: '2 weekends',
      imageUrl: null
    });

    const project2 = Project.create({
      communityId: community1.id,
      title: 'Playground Safety Fence Installation',
      description: 'Install a 6-foot safety fence around our playground area (approximately 200 linear feet). We have the materials but need help with proper installation to keep our kids safe.',
      category: 'Construction',
      requiredSkills: 'Fencing, Post Installation, Concrete',
      location: 'Portland, OR',
      budgetMin: 200,
      budgetMax: 800,
      timeline: '1 weekend',
      imageUrl: null
    });

    const project3 = Project.create({
      communityId: community2.id,
      title: 'Wheelchair Ramp for Community Center',
      description: 'Design and build an ADA-compliant wheelchair ramp for our community center entrance. Current entrance has 4 steps. This project will make our center accessible to everyone.',
      category: 'Accessibility',
      requiredSkills: 'Carpentry, ADA Compliance, Construction',
      location: 'Seattle, WA',
      budgetMin: 1000,
      budgetMax: 2000,
      timeline: '1 month',
      imageUrl: null
    });

    console.log('\n✓ Sample data created successfully!');
    console.log('\nSample Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nENGINEERS:');
    console.log('  Email: john.engineer@example.com');
    console.log('  Password: password123');
    console.log('  ---');
    console.log('  Email: sarah.maker@example.com');
    console.log('  Password: password123');
    console.log('\nCOMMUNITIES:');
    console.log('  Email: greenpark@community.org');
    console.log('  Password: password123');
    console.log('  ---');
    console.log('  Email: oakridge@community.org');
    console.log('  Password: password123');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    close();
    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error creating sample data:', error);
    close();
    process.exit(1);
  }
}

init();
