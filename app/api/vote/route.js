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
        const { voteId, selectedOption, voterAddress } = await request.json();

        if (!voteId || !selectedOption || !voterAddress) {
            return NextResponse.json({ message: 'Неверные данные: отсутствуют voteId, selectedOption или voterAddress.' }, { status: 400 });
        }

        const votes = await readData(dataFilePath);
        const poll = votes[voteId];

        if (!poll) {
            return NextResponse.json({ message: 'Опрос не найден.' }, { status: 404 });
        }

        // Проверяем, голосовал ли пользователь в этом опросе
        if (poll.voters.includes(voterAddress)) {
            return NextResponse.json({ message: 'Вы уже голосовали в этом опросе.' }, { status: 403 });
        }

        // Убедимся, что выбранная опция существует
        if (poll[selectedOption] === undefined) {
            return NextResponse.json({ message: 'Неверный вариант голосования.' }, { status: 400 });
        }

        // Записываем голос
        poll[selectedOption]++;
        // Добавляем адрес проголосовавшего
        poll.voters.push(voterAddress);

        await writeData(dataFilePath, votes);

        return NextResponse.json({ message: 'Голос успешно учтен' }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при отправке голоса:', error);
        return NextResponse.json({ message: 'Произошла ошибка при обработке вашего голоса.' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const votes = await readData(dataFilePath);
        // Преобразуем объект в массив для удобства фронтенда
        const pollsArray = Object.keys(votes).map(key => ({
            id: key,
            ...votes[key]
        }));
        return NextResponse.json(pollsArray);
    } catch (error) {
        console.error('Ошибка чтения данных:', error);
        return NextResponse.json({ message: 'Не удалось загрузить данные голосования.' }, { status: 500 });
    }
}