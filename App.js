import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Svg, { Path, G, Rect } from 'react-native-svg';

const App = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [tool, setTool] = useState('pencil'); // 'pencil', 'marker', 'eraser', или 'fill'
  const [color, setColor] = useState('black');
  const [width, setWidth] = useState(5);
  const [opacity, setOpacity] = useState(1); // Прозрачность линии

  const handleTouchStart = (event) => {
    const { locationX, locationY } = event.nativeEvent;

    if (tool === 'fill') {
      handleFill(locationX, locationY);
      return;
    }

    if (tool === 'pencil') {
      setColor('black');
      setWidth(5);
      setOpacity(1);
    } else if (tool === 'marker') {
      setColor('red');
      setWidth(20);
      setOpacity(0.5);
    } else if (tool === 'eraser') {
      setColor('white');
      setWidth(20);
      setOpacity(1);
    }

    setCurrentLine({ path: `M${locationX},${locationY}`, color, width, opacity });
  };

  const handleTouchMove = (event) => {
    if (!currentLine || tool === 'fill') return;

    const { locationX, locationY } = event.nativeEvent;
    setCurrentLine((prevLine) => ({
      ...prevLine,
      path: `${prevLine.path} L${locationX},${locationY}`,
    }));
  };

  const handleTouchEnd = () => {
    if (currentLine && tool !== 'fill') {
      setLines((prevLines) => [...prevLines, currentLine]);
      setCurrentLine(null);
    }
  };

  const clearCanvas = () => {
    setLines([]);
  };

  const switchToPencil = () => {
    setTool('pencil');
  };

  const switchToMarker = () => {
    setTool('marker');
  };

  const switchToEraser = () => {
    setTool('eraser');
  };

  const switchToFill = () => {
    setTool('fill');
  };

  const handleFill = (x, y) => {
    // Проверяем, находится ли точка внутри замкнутой области
    const isInsideClosedArea = lines.some((line) => {
      const path = line.path.split(' ');
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;

      // Определяем границы области
      for (let i = 0; i < path.length; i++) {
        const command = path[i];
        if (command.startsWith('M')) {
          const [_, startX, startY] = command.match(/M([\d.]+),([\d.]+)/).map(Number);
          minX = Math.min(minX, startX);
          maxX = Math.max(maxX, startX);
          minY = Math.min(minY, startY);
          maxY = Math.max(maxY, startY);
        } else if (command.startsWith('L')) {
          const [_, endX, endY] = command.match(/L([\d.]+),([\d.]+)/).map(Number);
          minX = Math.min(minX, endX);
          maxX = Math.max(maxX, endX);
          minY = Math.min(minY, endY);
          maxY = Math.max(maxY, endY);
        }
      }

      // Проверяем, находится ли точка внутри границ
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        return true;
      }
      return false;
    });

    if (isInsideClosedArea) {
      // Добавляем заливку
      setLines((prevLines) => [
        ...prevLines,
        { type: 'fill', x, y, width: 50, height: 50, color: 'blue' },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Svg style={styles.canvas} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <G>
          {lines.map((line, index) => {
            if (line.type === 'fill') {
              return (
                <Rect
                  key={index}
                  x={line.x - 25}
                  y={line.y - 25}
                  width={line.width}
                  height={line.height}
                  fill={line.color}
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

      {/* Кнопки управления */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={[styles.toolButton, tool === 'pencil' && styles.activeTool]} onPress={switchToPencil}>
          <Text style={styles.toolButtonText}>Карандаш</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolButton, tool === 'marker' && styles.activeTool]} onPress={switchToMarker}>
          <Text style={styles.toolButtonText}>Маркер</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolButton, tool === 'eraser' && styles.activeTool]} onPress={switchToEraser}>
          <Text style={styles.toolButtonText}>Ластик</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolButton, tool === 'fill' && styles.activeTool]} onPress={switchToFill}>
          <Text style={styles.toolButtonText}>Заливка</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
          <Text style={styles.clearButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'space-around',
    width: '80%',
  },
  toolButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  activeTool: {
    backgroundColor: '#aaa',
  },
  toolButtonText: {
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    top: 20,
    right: 20,
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
});

export default App;