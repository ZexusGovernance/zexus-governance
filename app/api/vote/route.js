import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// API-роут для обработки голосования
export async function POST(request) {
  try {
    const { voteId, selectedOption, voterAddress } = await request.json();

    if (!voteId || !selectedOption || !voterAddress) {
      return NextResponse.json({ message: 'Неверные данные: отсутствуют voteId, selectedOption или voterAddress.' }, { status: 400 });
    }

    // Находим опрос в базе данных
    const poll = await prisma.vote.findUnique({
      where: { id: voteId },
    });

    if (!poll) {
      return NextResponse.json({ message: 'Опрос не найден.' }, { status: 404 });
    }

    // Проверяем, голосовал ли пользователь
    if (poll.voters.includes(voterAddress)) {
      return NextResponse.json({ message: 'Вы уже голосовали в этом опросе.' }, { status: 403 });
    }

    // Убедимся, что выбранная опция существует
    if (poll[selectedOption] === undefined) {
      return NextResponse.json({ message: 'Неверный вариант голосования.' }, { status: 400 });
    }

    // Используем транзакцию для атомарного обновления.
    // Это гарантирует, что данные не будут повреждены,
    // если несколько пользователей проголосуют одновременно.
    await prisma.$transaction(async (tx) => {
      // Обновляем количество голосов для выбранной опции
      const updatedPoll = await tx.vote.update({
        where: { id: voteId },
        data: {
          [selectedOption]: {
            increment: 1,
          },
        },
      });

      // Добавляем адрес проголосовавшего пользователя
      await tx.vote.update({
        where: { id: voteId },
        data: {
          voters: {
            push: voterAddress,
          },
        },
      });
    });

    return NextResponse.json({ message: 'Голос успешно учтен' }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при отправке голоса:', error);
    return NextResponse.json({ message: 'Произошла ошибка при обработке вашего голоса.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// API-роут для получения списка всех опросов
export async function GET() {
  try {
    const polls = await prisma.vote.findMany();
    return NextResponse.json(polls, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return NextResponse.json({ message: 'Не удалось загрузить данные голосования.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}