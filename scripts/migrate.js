#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Starting database migration...');

try {
  // Generate Prisma client first
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Deploy migrations
  console.log('🗄️ Deploying migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  
  console.log('✅ Migration completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  
  // Try db push as fallback
  console.log('🔄 Trying db push as fallback...');
  try {
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ DB push completed successfully!');
  } catch (pushError) {
    console.error('❌ DB push also failed:', pushError.message);
    process.exit(1);
  }
} 