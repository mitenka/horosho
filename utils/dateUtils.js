/**
 * Утилиты для работы с датами в локальном времени устройства
 */

/**
 * Форматирует дату в строку YYYY-MM-DD в локальном времени
 * @param {Date} date - Дата для форматирования
 * @returns {string} Строка в формате YYYY-MM-DD
 */
export const formatDateToString = (date) => {
  if (!date || !(date instanceof Date)) {
    return new Date().toLocaleDateString('en-CA'); // 'en-CA' дает формат YYYY-MM-DD
  }
  
  return date.toLocaleDateString('en-CA');
};

/**
 * Получает сегодняшнюю дату в локальном времени
 * @returns {Date} Сегодняшняя дата
 */
export const getTodayDate = () => {
  return new Date();
};

/**
 * Получает строку сегодняшней даты в формате YYYY-MM-DD в локальном времени
 * @returns {string} Строка в формате YYYY-MM-DD
 */
export const getTodayDateString = () => {
  return formatDateToString(new Date());
};

/**
 * Создает дату из строки YYYY-MM-DD в локальном времени
 * @param {string} dateString - Строка в формате YYYY-MM-DD
 * @returns {Date} Дата в локальном времени
 */
export const createDateFromString = (dateString) => {
  if (!dateString) return new Date();
  
  // Создаем дату в локальном времени, избегая проблем с UTC
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month - 1 потому что месяцы в JS начинаются с 0
};

/**
 * Проверяет, является ли дата будущей относительно сегодняшнего дня
 * @param {Date} date - Дата для проверки
 * @returns {boolean} true если дата в будущем
 */
export const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dateToCheck = new Date(date);
  dateToCheck.setHours(0, 0, 0, 0);
  
  return dateToCheck > today;
};

/**
 * Получает локальную дату и время в формате ISO для timestamps
 * @returns {string} Локальная дата и время в формате ISO
 */
export const getLocalISOString = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localTime = new Date(now.getTime() - (offset * 60 * 1000));
  return localTime.toISOString();
};

/**
 * Генерирует массив дней для DaySelector (7 дней назад + сегодня + 2 дня вперед)
 * @param {Date} today - Сегодняшняя дата
 * @returns {Array<Date>} Массив дат
 */
export const getDaysArray = (today) => {
  const daysArray = [];

  // Добавляем 7 дней назад
  for (let i = 7; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    daysArray.push(date);
  }

  // Добавляем сегодня
  daysArray.push(new Date(today));

  // Добавляем 2 дня вперед
  for (let i = 1; i <= 2; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    daysArray.push(date);
  }

  return daysArray;
};
