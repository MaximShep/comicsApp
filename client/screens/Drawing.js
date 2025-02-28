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
import ColorPicker from '../src/colorPicker.js';
import { getAllImage, saveImage } from '../database';

// Функция для разбора строки пути в массив точек
const parsePathPoints = (path) => {
  const tokens = path.trim().split(' ').filter(Boolean);
  const points = [];
  tokens.forEach((token) => {
    const command = token[0];
    if (command === 'M' || command === 'L') {
      const coords = token.substring(1).split(',');
      if (coords.length === 2) {
        const x = parseFloat(coords[0]);
        const y = parseFloat(coords[1]);
        if (!isNaN(x) && !isNaN(y)) {
          points.push({ x, y });
        }
      }
    }
  });
  return points;
};

// Преобразует массив точек в строку пути для SVG
const pointsToPath = (points) => {
  if (points.length === 0) return '';
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L${points[i].x},${points[i].y}`;
  }
  return d + ' Z';
};

const segmentIntersection = (p1, p2, p3, p4) => {
  const r = { x: p2.x - p1.x, y: p2.y - p1.y };
  const s = { x: p4.x - p3.x, y: p4.y - p3.y };
  const denominator = r.x * s.y - r.y * s.x;
  if (denominator === 0) return null;
  const uNumerator = (p3.x - p1.x) * r.y - (p3.y - p1.y) * r.x;
  const tNumerator = (p3.x - p1.x) * s.y - (p3.y - p1.y) * s.x;
  const t = tNumerator / denominator;
  const u = uNumerator / denominator;
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: p1.x + t * r.x,
      y: p1.y + t * r.y,
    };
  }
  return null;
};

const findSelfIntersection = (points) => {
  const n = points.length;
  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 2; j < n - 1; j++) {
      if (i === 0 && j === n - 1) continue;
      const inter = segmentIntersection(points[i], points[i + 1], points[j], points[j + 1]);
      if (inter) {
        return { intersection: inter, i, j };
      }
    }
  }
  return null;
};

const getClosedPolygonPoints = (points, threshold = 10) => {
  if (points.length < 3) return null;
  const first = points[0];
  const last = points[points.length - 1];
  if (Math.hypot(last.x - first.x, last.y - first.y) <= threshold) {
    return points;
  }
  const interData = findSelfIntersection(points);
  if (interData) {
    const { intersection, i, j } = interData;
    const poly = [intersection, ...points.slice(i + 1, j + 1), intersection];
    return poly;
  }
  return null;
};

const isPointInsidePolygon = (x, y, polyPoints) => {
  let inside = false;
  for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
    const xi = polyPoints[i].x, yi = polyPoints[i].y;
    const xj = polyPoints[j].x, yj = polyPoints[j].y;
    const intersect =
      ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const Drawing = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [tool, setTool] = useState('pencil'); // 'pencil', 'marker', 'eraser', 'fill'
  const [color, setColor] = useState('black');
  const [width, setWidth] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [widthSelectionVisible, setWidthSelectionVisible] = useState(false);

  const switchTool = (selectedTool) => {
    if (selectedTool !== 'fill' && tool === selectedTool) {
      setWidthSelectionVisible(true);
    } else {
      setTool(selectedTool);
      if (selectedTool === 'pencil') setWidth(5);
      if (selectedTool === 'marker') setWidth(20);
      if (selectedTool === 'eraser') setWidth(20);
    }
  };

  const switchToPencil = () => switchTool('pencil');
  const switchToMarker = () => switchTool('marker');
  const switchToEraser = () => switchTool('eraser');
  const switchToFill = () => setTool('fill');

  const handleTouchStart = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    if (tool === 'fill') {
      handleFill(locationX, locationY);
      return;
    }
    const newColor = tool === 'eraser' ? 'white' : color;
    const newOpacity = (tool === 'marker') ? 0.5 : 1;
    setCurrentLine({
      path: `M${locationX},${locationY}`,
      color: newColor,
      width,
      opacity: newOpacity,
      type: 'stroke',
    });
  };

  const handleTouchMove = (event) => {
    if (!currentLine || tool === 'fill') return;
    const { locationX, locationY } = event.nativeEvent;
    setCurrentLine(prev => ({
      ...prev,
      path: `${prev.path} L${locationX},${locationY}`,
    }));
  };

  const handleTouchEnd = () => {
    if (currentLine && tool !== 'fill') {
      setLines(prev => [...prev, currentLine]);
      setCurrentLine(null);
    }
  };

  const clearCanvas = () => {
    setLines([]);
  };

  const handleFill = (x, y) => {
    let found = false;
    for (const line of lines) {
      if (line.type !== 'stroke') continue;
      const points = parsePathPoints(line.path);
      const polyPoints = getClosedPolygonPoints(points);
      if (!polyPoints) continue;
      if (isPointInsidePolygon(x, y, polyPoints)) {
        const fillPath = pointsToPath(polyPoints);
        setLines(prev => [
          ...prev,
          { type: 'fill', path: fillPath, fill: color },
        ]);
        found = true;
        break;
      }
    }
    if (!found) {
      Alert.alert('Ошибка', 'Нет замкнутой области для заливки или точка вне фигуры.');
    }
  };

  // Функция сохранения изображения в базу данных
  const handleSave = async () => {
    try {
      // Формируем объект SVG данных
      const exportData = {
        svg: {
          xmlns: "http://www.w3.org/2000/svg",
          width: 500,
          height: 500,
          paths: lines.map(line => {
            if (line.type === 'fill') {
              return {
                d: line.path,
                fill: line.fill,
                stroke: "none"
              };
            }
            return {
              d: line.path,
              stroke: line.color,
              strokeWidth: line.width,
              strokeLinecap: "round",
              fill: "none",
              strokeOpacity: line.opacity
            };
          }),
        }
      };

      // Преобразуем объект в строку
      const svgString = JSON.stringify(exportData);
      await saveImage(svgString);
      Alert.alert("Сохранено", "Рисунок успешно сохранен в базу данных!");
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось сохранить рисунок");
      console.error(error);
    }
  };

  const handleWidthSelect = (selectedWidth) => {
    setWidth(selectedWidth);
    setWidthSelectionVisible(false);
  };

  const widthOptions = {
    pencil: [2, 5, 10],
    marker: [10, 20, 30],
    eraser: [10, 20, 30],
  };

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
        <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
          <Text style={styles.clearButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.colorPickerContainer}>
        <ColorPicker onColorSelected={setColor} />
      </View>

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

      <View style={styles.exportContainer}>
        <TouchableOpacity style={styles.exportButton} onPress={handleSave}>
          <Text style={styles.exportButtonText}>Вывести</Text>
        </TouchableOpacity>
      </View>
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
  colorPickerContainer: {
    marginTop: 20,
  },
  exportContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  exportButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
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
});

export default Drawing;
