import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'votes.json');

const readData = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
};

const writeData = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    const votes = await readData(dataFilePath);
    if (!votes[id]) {
      return NextResponse.json({ message: 'Poll not found' }, { status: 404 });
    }
    
    delete votes[id];
    await writeData(dataFilePath, votes);
    
    return NextResponse.json({ message: 'Poll deleted' });
  } catch (error) {
    console.error('Ошибка удаления опроса:', error);
    return NextResponse.json({ message: 'Error deleting poll' }, { status: 500 });
  }
}