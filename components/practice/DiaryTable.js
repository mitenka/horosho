import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getDiaryEntries } from "../../services/diaryService";

// Константы для фиксированного размера экспорта
const EXPORT_WIDTH = 900; // Фиксированная ширина экспорта
const EXPORT_HEIGHT = 1200; // Фиксированная высота экспорта
const MIN_DAYS = 7;
const MAX_DAYS = 14;

const DiaryTable = ({ 
  exportDays, 
  selectedDate, 
  isPreview = false,
  thoughtsControl = null,
  emotionsControl = null,
  actionsControl = null,
  onReady,
}) => {
  const [diaryData, setDiaryData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем данные дневника при монтировании компонента
  useEffect(() => {
    loadDiaryData();
  }, [exportDays]);

  const loadDiaryData = async () => {
    try {
      setIsLoading(true);
      const entries = await getDiaryEntries();
      setDiaryData(entries);
    } catch (error) {
      console.error('Error loading diary data:', error);
      setDiaryData({});
    } finally {
      setIsLoading(false);
      // Сообщаем родителю, что данные готовы к рендеру
      if (typeof onReady === 'function') {
        try { onReady(); } catch {}
      }
    }
  };

  // Форматируем дату в строку YYYY-MM-DD для поиска в данных дневника
  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Извлекаем уникальные поведения за выбранный период
  const extractUniqueBehaviors = (dates) => {
    const behaviorMap = new Map();
    
    dates.forEach(date => {
      const dateKey = formatDateKey(date);
      const dayData = diaryData[dateKey];
      
      if (dayData && dayData.behaviors) {
        dayData.behaviors.forEach(behavior => {
          if (!behaviorMap.has(behavior.id)) {
            behaviorMap.set(behavior.id, {
              id: behavior.id,
              name: behavior.name,
              type: behavior.type
            });
          }
        });
      }
    });
    
    return Array.from(behaviorMap.values());
  };

  // Получаем значение поведения для конкретной даты
  const getBehaviorValue = (date, behaviorId, valueType) => {
    const dateKey = formatDateKey(date);
    const dayData = diaryData[dateKey];
    
    if (!dayData || !dayData.behaviors) return null;
    
    const behavior = dayData.behaviors.find(b => b.id === behaviorId);
    if (!behavior) return null;
    
    const value = behavior[valueType];
    // Для незаполненных поведений показываем пустую ячейку (без прочерка)
    if (value === null || value === undefined) return '';
    
    // Для булевых действий возвращаем символы
    if (valueType === 'action' && behavior.type === 'boolean') {
      // true -> галочка, false -> крестик
      return value ? '✓' : '×';
    }
    
    return value;
  };

  // Получаем значение состояния для конкретной даты
  const getDailyStateValue = (date, stateKey) => {
    const dateKey = formatDateKey(date);
    const dayData = diaryData[dateKey];
    
    if (!dayData || !dayData.dailyState) return null;
    
    const value = dayData.dailyState[stateKey];
    return (value !== null && value !== undefined) ? value : null;
  };

  // Проверяем, заполнен ли дневник для конкретной даты
  const isDiaryCompleted = (date) => {
    const dateKey = formatDateKey(date);
    const dayData = diaryData[dateKey];
    
    return dayData && dayData.isCompleted === true;
  };

  // Получаем оценку навыков для конкретной даты
  const getSkillsAssessment = (date) => {
    const dateKey = formatDateKey(date);
    const dayData = diaryData[dateKey];
    
    if (!dayData) return null;
    
    const value = dayData.skillsAssessment;
    return (value !== null && value !== undefined) ? value : null;
  };

  // Получаем значение для ячейки таблицы в зависимости от типа данных
  const getCellValue = (date, row) => {
    switch (row.type) {
      case 'dailyState':
        return getDailyStateValue(date, row.key);
      case 'desire':
        return getBehaviorValue(date, row.key, 'desire');
      case 'action':
        return getBehaviorValue(date, row.key, 'action');
      case 'skills':
        return getSkillsAssessment(date);
      default:
        return null;
    }
  };

  // Форматируем значение для отображения в ячейке
  const formatCellValue = (value) => {
    if (value === null || value === undefined) {
      return '—';
    }
    return String(value);
  };

  // Вычисляем адаптивные размеры на основе количества дней
  const getAdaptiveSizes = () => {
    const daysCount = Math.max(MIN_DAYS, Math.min(MAX_DAYS, exportDays));
    const scaleFactor = MIN_DAYS / daysCount; // Чем больше дней, тем меньше масштаб

    // Базовые размеры для 7 дней
    const baseSizes = {
      titleFontSize: 24,
      sectionTitleFontSize: 14,
      headerFontSize: 12,
      labelFontSize: 11,
      cellFontSize: 10,
      dayOfWeekFontSize: 9,
      dayOfMonthFontSize: 12,
      rowHeight: 32,
      headerHeight: 40,
      padding: 8,
      cellPadding: 4,
    };

    // Применяем масштабирование
    return {
      titleFontSize: Math.max(16, baseSizes.titleFontSize * scaleFactor),
      sectionTitleFontSize: Math.max(
        10,
        baseSizes.sectionTitleFontSize * scaleFactor
      ),
      headerFontSize: Math.max(8, baseSizes.headerFontSize * scaleFactor),
      labelFontSize: Math.max(8, baseSizes.labelFontSize * scaleFactor),
      cellFontSize: Math.max(7, baseSizes.cellFontSize * scaleFactor),
      dayOfWeekFontSize: Math.max(7, baseSizes.dayOfWeekFontSize * scaleFactor),
      dayOfMonthFontSize: Math.max(
        9,
        baseSizes.dayOfMonthFontSize * scaleFactor
      ),
      rowHeight: Math.max(20, baseSizes.rowHeight * scaleFactor),
      headerHeight: Math.max(28, baseSizes.headerHeight * scaleFactor),
      padding: Math.max(4, baseSizes.padding * scaleFactor),
      cellPadding: Math.max(2, baseSizes.cellPadding * scaleFactor),
    };
  };

  const sizes = getAdaptiveSizes();

  // Генерируем массив дат для таблицы, начиная от сегодняшней даты и идя в прошлое
  const generateDateRange = () => {
    const dates = [];
    const startDate = new Date(); // Используем сегодняшнюю дату

    for (let i = 0; i < exportDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() - i);
      dates.push(date);
    }

    return dates.reverse(); // Показываем от старых к новым
  };

  // Форматируем дату для отображения в заголовке колонки
  const formatDateHeader = (date) => {
    const dayNames = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
    const dayOfWeek = dayNames[date.getDay()];
    const dayOfMonth = date.getDate();
    return { dayOfWeek, dayOfMonth };
  };

  // Форматируем диапазон дат для подзаголовка
  const formatDateRange = (dates) => {
    if (dates.length === 0) return "";
    
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    
    const formatDate = (date) => {
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long' 
      });
    };
    
    return `${formatDate(firstDate)} — ${formatDate(lastDate)}`;
  };

  // Форматируем объединенную строку с датами и управлением
  const formatDateAndControlLine = () => {
    const dateRange = formatDateRange(dates);
    const formatValue = (value) => (value !== null && value !== undefined) ? value : "н/д";
    
    const controlPart = `Мысли: ${formatValue(thoughtsControl)} | Эмоции: ${formatValue(emotionsControl)} | Действия: ${formatValue(actionsControl)}`;
    
    return `${dateRange} • ${controlPart}`;
  };

  const dates = generateDateRange();

  // Извлекаем уникальные поведения за выбранный период
  const uniqueBehaviors = extractUniqueBehaviors(dates);

  // Создаем динамическую структуру данных для таблицы на основе реальных данных
  const createTableData = () => {
    const sections = [
      {
        title: "Состояние (0-5)",
        rows: [
          { label: "Эмоциональное страдание", key: "emotional", type: "dailyState" },
          { label: "Физическое страдание", key: "physical", type: "dailyState" },
          { label: "Удовольствие", key: "pleasure", type: "dailyState" },
        ],
      },
    ];

    // Добавляем секцию желаний, если есть поведения
    if (uniqueBehaviors.length > 0) {
      sections.push({
        title: "Желания, максимальная выраженность в течение дня (0-5)",
        rows: uniqueBehaviors.map(behavior => ({
          label: behavior.name,
          key: behavior.id,
          type: "desire",
          behaviorType: behavior.type
        })),
      });

      // Добавляем секцию действий с теми же поведениями
      sections.push({
        title: "Действия",
        rows: uniqueBehaviors.map(behavior => ({
          label: behavior.name,
          key: behavior.id,
          type: "action",
          behaviorType: behavior.type
        })),
      });
    }

    // Добавляем секцию использованных навыков
    sections.push({
      title: "Использованные навыки",
      rows: [{ label: "Оценка (0-7)", key: "skillsAssessment", type: "skills" }],
    });

    return { sections };
  };

  const tableData = createTableData();

  // Если данные еще загружаются, показываем заглушку
  if (isLoading) {
    return (
      <View style={isPreview ? { flex: 1, justifyContent: 'center', alignItems: 'center' } : { width: EXPORT_WIDTH, height: EXPORT_HEIGHT, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: isPreview ? 12 : 16, color: '#666' }}>Загрузка данных дневника...</Text>
      </View>
    );
  }

  // Создаем все строки таблицы в едином массиве
  const allRows = [
    // Заголовок
    {
      type: "header",
      label: "",
      cells: dates.map((date) => {
        const { dayOfWeek, dayOfMonth } = formatDateHeader(date);
        return { dayOfWeek, dayOfMonth };
      }),
    },
    // Строка заполнения дневника
    {
      type: "data",
      label: "Дневник заполнен сегодня?",
      cells: dates.map((date) => isDiaryCompleted(date) ? "✓" : "—"),
    },
  ];

  // Добавляем все секции
  tableData.sections.forEach((section) => {
    // Заголовок секции
    allRows.push({
      type: "section",
      label: section.title,
      cells: [],
    });

    // Строки секции
    section.rows.forEach((row) => {
      allRows.push({
        type: "data",
        label: row.label,
        cells: dates.map((date) => formatCellValue(getCellValue(date, row))),
      });
    });
  });

  // Создаем динамические стили на основе адаптивных размеров
  const dynamicStyles = {
    container: isPreview
      ? {
          // Для превью - подстраиваемся под экран
          flex: 1,
          padding: 4,
          backgroundColor: "#fff",
        }
      : {
          // Для экспорта - фиксированные размеры
          width: EXPORT_WIDTH,
          height: EXPORT_HEIGHT,
          padding: sizes.padding,
          backgroundColor: "#fff",
        },
    title: {
      fontSize: isPreview
        ? Math.max(8, sizes.titleFontSize * 0.5)
        : sizes.titleFontSize,
      fontWeight: "bold",
      textAlign: "left",
      marginBottom: isPreview ? 1 : sizes.padding / 2,
      color: "#333",
    },
    dateAndControlLine: {
      fontSize: isPreview
        ? Math.max(5, sizes.labelFontSize * 0.5)
        : sizes.labelFontSize,
      textAlign: "left",
      marginBottom: isPreview ? 2 : sizes.padding,
      color: "#666",
      lineHeight: isPreview
        ? Math.max(6, sizes.labelFontSize * 0.5 * 1.2)
        : sizes.labelFontSize * 1.2,
    },
    headerRow: {
      flexDirection: "row",
      backgroundColor: "#f8f9fa",
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      height: isPreview
        ? Math.max(12, sizes.headerHeight * 0.4)
        : sizes.headerHeight,
    },
    sectionHeaderRow: {
      backgroundColor: "#e9ecef",
      padding: isPreview ? 1 : sizes.cellPadding,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      minHeight: isPreview
        ? Math.max(8, sizes.rowHeight * 0.4)
        : sizes.rowHeight,
      justifyContent: "center",
    },
    sectionHeaderRowLast: {
      backgroundColor: "#e9ecef",
      padding: isPreview ? 1 : sizes.cellPadding,
      minHeight: isPreview
        ? Math.max(8, sizes.rowHeight * 0.4)
        : sizes.rowHeight,
      justifyContent: "center",
      // Нет нижней границы для последней строки
    },
    dataRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      minHeight: isPreview
        ? Math.max(8, sizes.rowHeight * 0.4)
        : sizes.rowHeight,
    },
    dataRowLast: {
      flexDirection: "row",
      minHeight: isPreview
        ? Math.max(8, sizes.rowHeight * 0.4)
        : sizes.rowHeight,
      // Нет нижней границы для последней строки
    },
    labelColumn: {
      flex: 2,
      padding: isPreview ? 1 : sizes.cellPadding,
      justifyContent: "center",
      borderRightWidth: 1,
      borderRightColor: "#ddd",
      alignItems: "flex-start",
    },
    dateColumn: {
      flex: 1,
      padding: isPreview ? 0.5 : sizes.cellPadding,
      alignItems: "center",
      justifyContent: "center",
      borderRightWidth: 1,
      borderRightColor: "#ddd",
    },
    dateColumnLast: {
      flex: 1,
      padding: isPreview ? 0.5 : sizes.cellPadding,
      alignItems: "center",
      justifyContent: "center",
      // Нет правой границы для последней колонки
    },
    dataCell: {
      flex: 1,
      padding: isPreview ? 0.5 : sizes.cellPadding,
      alignItems: "center",
      justifyContent: "center",
      borderRightWidth: 1,
      borderRightColor: "#eee",
    },
    dataCellLast: {
      flex: 1,
      padding: isPreview ? 0.5 : sizes.cellPadding,
      alignItems: "center",
      justifyContent: "center",
      // Нет правой границы для последней колонки
    },
    dayOfWeek: {
      fontSize: isPreview
        ? Math.max(4, sizes.dayOfWeekFontSize * 0.6)
        : sizes.dayOfWeekFontSize,
      fontWeight: "bold",
      color: "#666",
      textAlign: "center",
    },
    dayOfMonth: {
      fontSize: isPreview
        ? Math.max(5, sizes.dayOfMonthFontSize * 0.6)
        : sizes.dayOfMonthFontSize,
      fontWeight: "bold",
      color: "#333",
      textAlign: "center",
      marginTop: 1,
    },
    headerText: {
      fontSize: isPreview
        ? Math.max(4, sizes.headerFontSize * 0.6)
        : sizes.headerFontSize,
      fontWeight: "bold",
      color: "#333",
    },
    sectionTitle: {
      fontSize: isPreview
        ? Math.max(5, sizes.sectionTitleFontSize * 0.6)
        : sizes.sectionTitleFontSize,
      fontWeight: "bold",
      color: "#495057",
    },
    labelText: {
      fontSize: isPreview
        ? Math.max(4, sizes.labelFontSize * 0.6)
        : sizes.labelFontSize,
      color: "#333",
      lineHeight: isPreview
        ? Math.max(5, sizes.labelFontSize * 0.6 * 1.2)
        : sizes.labelFontSize * 1.2,
      flexWrap: "wrap",
      textAlign: "left",
    },
    cellText: {
      fontSize: isPreview
        ? Math.max(4, sizes.cellFontSize * 0.6)
        : sizes.cellFontSize,
      color: "#666",
      textAlign: "center",
    },
  };

  return (
    <View style={dynamicStyles.container}>
      {/* Заголовок */}
      <Text style={dynamicStyles.title}>Дневниковая карточка</Text>
      
      {/* Объединенная строка с датами и управлением */}
      <Text style={dynamicStyles.dateAndControlLine}>{formatDateAndControlLine()}</Text>

      {/* Единая таблица */}
      <View style={styles.table}>
        {allRows.map((row, rowIndex) => {
          const isLastRow = rowIndex === allRows.length - 1;
          if (row.type === "header") {
            return (
              <View key={rowIndex} style={dynamicStyles.headerRow}>
                <View style={dynamicStyles.labelColumn}>
                  <Text style={dynamicStyles.headerText}></Text>
                </View>
                {row.cells.map((cell, cellIndex) => {
                  const isLastColumn = cellIndex === row.cells.length - 1;
                  return (
                    <View
                      key={cellIndex}
                      style={
                        isLastColumn
                          ? dynamicStyles.dateColumnLast
                          : dynamicStyles.dateColumn
                      }
                    >
                      <Text style={dynamicStyles.dayOfWeek}>
                        {cell.dayOfWeek}
                      </Text>
                      <Text style={dynamicStyles.dayOfMonth}>
                        {cell.dayOfMonth}
                      </Text>
                    </View>
                  );
                })}
              </View>
            );
          } else if (row.type === "section") {
            return (
              <View
                key={rowIndex}
                style={
                  isLastRow
                    ? dynamicStyles.sectionHeaderRowLast
                    : dynamicStyles.sectionHeaderRow
                }
              >
                <Text style={dynamicStyles.sectionTitle}>{row.label}</Text>
              </View>
            );
          } else {
            return (
              <View
                key={rowIndex}
                style={
                  isLastRow ? dynamicStyles.dataRowLast : dynamicStyles.dataRow
                }
              >
                <View style={dynamicStyles.labelColumn}>
                  <Text style={dynamicStyles.labelText}>{row.label}</Text>
                </View>
                {row.cells.map((cell, cellIndex) => {
                  const isLastColumn = cellIndex === row.cells.length - 1;
                  return (
                    <View
                      key={cellIndex}
                      style={
                        isLastColumn
                          ? dynamicStyles.dataCellLast
                          : dynamicStyles.dataCell
                      }
                    >
                      <Text style={dynamicStyles.cellText}>{cell}</Text>
                    </View>
                  );
                })}
              </View>
            );
          }
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
  },
});

export default DiaryTable;
