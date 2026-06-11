export function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message || 'Ошибка запроса' });
  }

  if (error.name === 'ZodError') {
    return res.status(400).json({
      message: 'Ошибка валидации данных',
      errors: error.errors.map((item) => ({ path: item.path.join('.'), message: item.message }))
    });
  }

  if (error.code === 'P2002') {
    return res.status(409).json({ message: 'Запись с такими уникальными данными уже существует' });
  }

  if (error.code === 'P2003') {
    return res.status(409).json({ message: 'Запись используется в других разделах системы. Сначала удалите связанные данные или используйте исправленную версию удаления.' });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({ message: 'Запись не найдена или уже была удалена' });
  }

  return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
}
