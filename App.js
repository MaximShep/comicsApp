import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
} from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const App = () => {
  // Состояния для линий, текущей линии, выбранного инструмента, цвета, толщины и прозрачности
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [tool, setTool] = useState('pencil'); // 'pencil', 'marker', 'eraser', 'fill'
  const [color, setColor] = useState('black');
  const [width, setWidth] = useState(5);
  const [opacity, setOpacity] = useState(1);

  // Состояния для модальных окон выбора толщины и цвета
  const [widthSelectionVisible, setWidthSelectionVisible] = useState(false);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  // Функция для переключения инструмента. Если выбран тот же инструмент (кроме fill),
  // то открываем модальное окно для выбора толщины.
  const switchTool = (selectedTool) => {
    if (selectedTool !== 'fill' && tool === selectedTool) {
      setWidthSelectionVisible(true);
    } else {
      setTool(selectedTool);
      // При смене инструмента можно сбрасывать толщину до значения по умолчанию
      if (selectedTool === 'pencil') setWidth(5);
      if (selectedTool === 'marker') setWidth(20);
      if (selectedTool === 'eraser') setWidth(20);
    }
  };

  // Обработчики переключения инструментов
  const switchToPencil = () => switchTool('pencil');
  const switchToMarker = () => switchTool('marker');
  const switchToEraser = () => switchTool('eraser');
  const switchToFill = () => setTool('fill');

  // Обработчик начала касания по холсту
  const handleTouchStart = (event) => {
    const { locationX, locationY } = event.nativeEvent;

    if (tool === 'fill') {
      handleFill(locationX, locationY);
      return;
    }

    // Для инструментов выбираем цвет, толщину и прозрачность.
    // Для карандаша и маркера используем выбранный пользователем цвет,
    // для ластика всегда белый.
    let newColor = tool === 'eraser' ? 'white' : color;
    let newWidth = width;
    let newOpacity = 1;
    if (tool === 'marker') newOpacity = 0.5;

    // Начинаем новую линию
    setCurrentLine({
      path: `M${locationX},${locationY}`,
      color: newColor,
      width: newWidth,
      opacity: newOpacity,
      type: 'stroke',
    });
  };

  // Обработчик перемещения пальца по холсту
  const handleTouchMove = (event) => {
    if (!currentLine || tool === 'fill') return;
    const { locationX, locationY } = event.nativeEvent;
    setCurrentLine((prevLine) => ({
      ...prevLine,
      path: `${prevLine.path} L${locationX},${locationY}`,
    }));
  };

  // Обработчик завершения касания
  const handleTouchEnd = () => {
    if (currentLine && tool !== 'fill') {
      setLines((prevLines) => [...prevLines, currentLine]);
      setCurrentLine(null);
    }
  };

  // Функция очистки холста
  const clearCanvas = () => {
    setLines([]);
  };

  // Простейшая функция для проверки, находится ли точка (x, y) внутри пути.
  // Работает корректно только для замкнутых областей, нарисованных одним штрихом.
  const isPointInsidePath = (x, y, path) => {
    const commands = path.split(' ').filter(Boolean);
    let inside = false;

    for (let i = 0; i < commands.length - 1; i++) {
      const matchStart = commands[i].match(/([ML])([\d.]+),([\d.]+)/);
      const matchEnd = commands[i + 1].match(/([ML])([\d.]+),([\d.]+)/);
      if (!matchStart || !matchEnd) continue;

      const startX = parseFloat(matchStart[2]);
      const startY = parseFloat(matchStart[3]);
      const endX = parseFloat(matchEnd[2]);
      const endY = parseFloat(matchEnd[3]);

      if (((startY > y) !== (endY > y)) &&
          (x < ((endX - startX) * (y - startY)) / (endY - startY) + startX)) {
        inside = !inside;
      }
    }

    return inside;
  };

  // Функция заливки области
  const handleFill = (x, y) => {
    let foundClosedArea = false;
    // Перебираем все линии и проверяем, находится ли точка внутри нарисованного пути
    lines.forEach((line) => {
      // Для заливки обрабатываем только линии типа 'stroke'
      if (line.type === 'stroke' && isPointInsidePath(x, y, line.path)) {
        // Добавляем заливку: используем путь с закрытием (Z) и выбранный цвет
        setLines((prevLines) => [
          ...prevLines,
          { type: 'fill', path: `${line.path} Z`, fill: color },
        ]);
        foundClosedArea = true;
      }
    });

    if (!foundClosedArea) {
      Alert.alert('Ошибка', 'Точка находится вне замкнутой области.');
    }
  };

  // Обработчик выбора толщины из модального окна
  const handleWidthSelect = (selectedWidth) => {
    setWidth(selectedWidth);
    setWidthSelectionVisible(false);
  };

  // Обработчик выбора цвета
  const handleColorSelect = (selectedColor) => {
    setColor(selectedColor);
    setColorPickerVisible(false);
  };

  // Наборы толщин для разных инструментов
  const widthOptions = {
    pencil: [2, 5, 10],
    marker: [10, 20, 30],
    eraser: [10, 20, 30],
  };

  // Набор предустановленных цветов
  const colorOptions = ['black', 'red', 'blue', 'green', 'purple', 'orange'];

  return (
    <View style={styles.container}>
      <Svg
        style={styles.canvas}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <G>
          {lines.map((line, index) => {
            if (line.type === 'fill') {
              return (
                <Path
                  key={index}
                  d={line.path}
                  fill={line.fill}
                  stroke="none"
                />
              );
            }
            return (
              <Path
                key={index}
                d={line.path}
                stroke={line.color}
                strokeWidth={line.width}
                strokeLinecap="round"
                fill="none"
                strokeOpacity={line.opacity}
              />
            );
          })}
          {currentLine && tool !== 'fill' && (
            <Path
              d={currentLine.path}
              stroke={currentLine.color}
              strokeWidth={currentLine.width}
              strokeLinecap="round"
              fill="none"
              strokeOpacity={currentLine.opacity}
            />
          )}
        </G>
      </Svg>

      {/* Панель инструментов */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolButton, tool === 'pencil' && styles.activeTool]}
          onPress={switchToPencil}
        >
          <Text style={styles.toolButtonText}>Карандаш</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolButton, tool === 'marker' && styles.activeTool]}
          onPress={switchToMarker}
        >
          <Text style={styles.toolButtonText}>Маркер</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolButton, tool === 'eraser' && styles.activeTool]}
          onPress={switchToEraser}
        >
          <Text style={styles.toolButtonText}>Ластик</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolButton, tool === 'fill' && styles.activeTool]}
          onPress={switchToFill}
        >
          <Text style={styles.toolButtonText}>Заливка</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearCanvas}
        >
          <Text style={styles.clearButtonText}>×</Text>
        </TouchableOpacity>
        {/* Кнопка выбора цвета (кружок) */}
        <TouchableOpacity
          style={[styles.colorPickerButton, { backgroundColor: color }]}
          onPress={() => setColorPickerVisible(true)}
        />
      </View>

      {/* Модальное окно выбора толщины (не для инструмента fill) */}
      <Modal
        visible={widthSelectionVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWidthSelectionVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Выберите толщину</Text>
            <View style={styles.optionsRow}>
              {widthOptions[tool]?.map((w) => (
                <TouchableOpacity
                  key={w}
                  style={[
                    styles.optionButton,
                    width === w && styles.selectedOption,
                  ]}
                  onPress={() => handleWidthSelect(w)}
                >
                  <Text style={styles.optionText}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setWidthSelectionVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Модальное окно выбора цвета */}
      <Modal
        visible={colorPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setColorPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Выберите цвет</Text>
            <View style={styles.optionsRow}>
              {colorOptions.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorOption,
                    { backgroundColor: c },
                    color === c && styles.selectedColorOption,
                  ]}
                  onPress={() => handleColorSelect(c)}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setColorPickerVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: '90%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  toolbar: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
  },
  toolButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginRight: 5,
  },
  activeTool: {
    backgroundColor: '#aaa',
  },
  toolButtonText: {
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: 'red',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  colorPickerButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  optionButton: {
    padding: 10,
    backgroundColor: '#eee',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#000',
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#555',
  },
});

export default App;
