import fs from 'fs';
import path from 'path';

// Try to use Render's persistent disk first, fall back to local storage
const DATA_DIR = process.env.NODE_ENV === 'production' ? '/data' : path.join(process.cwd(), 'data');

// Ensure data directories exist
const ensureDirectories = () => {
  const dirs = [
    path.join(DATA_DIR, 'customers'),
    path.join(DATA_DIR, 'logs')
  ];

  dirs.forEach(dir => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (error) {
      console.error(`Could not create directory ${dir}:`, error);
    }
  });
};

// Save or update customer data
export const saveCustomerData = async (email: string, newData: any) => {
  try {
    ensureDirectories();
    const hashedEmail = Buffer.from(email).toString('base64').replace(/[\/+=]/g, '_');
    const filepath = path.join(DATA_DIR, 'customers', `${hashedEmail}.json`);
    
    // Read existing data if file exists
    let customerData = {
      email,
      submissions: [] as any[],
      lastUpdated: new Date().toISOString()
    };

    if (fs.existsSync(filepath)) {
      const existingData = await fs.promises.readFile(filepath, 'utf-8');
      customerData = JSON.parse(existingData);
    }

    // Add new submission with timestamp
    customerData.submissions.push({
      timestamp: new Date().toISOString(),
      data: newData
    });

    // Update last updated timestamp
    customerData.lastUpdated = new Date().toISOString();

    // Save updated data
    await fs.promises.writeFile(filepath, JSON.stringify(customerData, null, 2));
    return filepath;
  } catch (error) {
    console.error('Error saving customer data:', error);
    // Return a dummy path if saving fails
    return 'data-not-saved';
  }
};

// Save log data
export const saveLog = async (type: string, data: any) => {
  try {
    ensureDirectories();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${type}-${timestamp}.json`;
    const filepath = path.join(DATA_DIR, 'logs', filename);
    
    await fs.promises.writeFile(filepath, JSON.stringify(data, null, 2));
    return filepath;
  } catch (error) {
    console.error('Error saving log:', error);
    return 'log-not-saved';
  }
}; 