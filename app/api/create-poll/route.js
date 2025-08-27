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

export async function POST(request) {
  try {
    const { question } = await request.json();
    if (!question) {
      return NextResponse.json({ message: 'Missing question' }, { status: 400 });
    }

    const votes = await readData(dataFilePath);
    const pollIds = Object.keys(votes).map(Number);
    const newId = pollIds.length > 0 ? Math.max(...pollIds) + 1 : 1;
    
    votes[newId] = {
      question,
      yes: 0,
      no: 0,
      voters: [], // Инициализируем пустой массив для проголосовавших
    };

    await writeData(dataFilePath, votes);

    return NextResponse.json({ message: 'Poll created', pollId: newId }, { status: 200 });
  } catch (error) {
    console.error('Ошибка создания опроса:', error);
    return NextResponse.json({ message: 'Error creating poll' }, { status: 500 });
  }
}