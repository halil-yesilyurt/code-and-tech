import fs from 'fs';
import path from 'path';

const VIEWS_FILE_PATH = path.join(process.cwd(), 'data', 'views.json');

interface ViewData {
  [postId: number]: number;
  lastUpdated: string;
}

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(VIEWS_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read view counts from file
export function readViewCounts(): ViewData {
  try {
    ensureDataDirectory();
    if (fs.existsSync(VIEWS_FILE_PATH)) {
      const data = fs.readFileSync(VIEWS_FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Failed to read view counts from file:', error);
  }
  
  return { lastUpdated: new Date().toISOString() };
}

// Write view counts to file
export function writeViewCounts(viewCounts: ViewData): void {
  try {
    ensureDataDirectory();
    viewCounts.lastUpdated = new Date().toISOString();
    fs.writeFileSync(VIEWS_FILE_PATH, JSON.stringify(viewCounts, null, 2));
  } catch (error) {
    console.warn('Failed to write view counts to file:', error);
  }
}

// Increment view count for a post
export function incrementViewCount(postId: number): number {
  const viewData = readViewCounts();
  viewData[postId] = (viewData[postId] || 0) + 1;
  writeViewCounts(viewData);
  return viewData[postId];
}

// Get view count for a post
export function getViewCount(postId: number): number {
  const viewData = readViewCounts();
  return viewData[postId] || 0;
}

// Get all view counts
export function getAllViewCounts(): ViewData {
  return readViewCounts();
} 