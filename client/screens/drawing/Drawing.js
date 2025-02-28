import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  Image
} from 'react-native';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import Svg, { Path, G } from 'react-native-svg';
import ColorPicker from '../../src/colorPicker.js';
import PencilIcon from '../../assets/images/pencil.js'
import MarkerIcon from '../../assets/images/marker.js'
import EaserIcon from '../../assets/images/easer.js'
import FillIcon from '../../assets/images/fill.js'
import TextIcon from '../../assets/images/text.js'


// Преобразует строку пути в массив точек: [{x, y}, ...]
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

// Вычисляет пересечение двух отрезков, если оно есть.
// p1, p2, p3, p4 – объекты вида {x, y}
const segmentIntersection = (p1, p2, p3, p4) => {
  const r = { x: p2.x - p1.x, y: p2.y - p1.y };
  const s = { x: p4.x - p3.x, y: p4.y - p3.y };
  const denominator = r.x * s.y - r.y * s.x;
  if (denominator === 0) return null; // параллельны или коллинеарны

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

// Пытается найти первое самопересечение в массиве точек.
const findSelfIntersection = (points) => {
  const n = points.length;
  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 2; j < n - 1; j++) {
      // Исключаем соседние отрезки и случай, когда i==0 и j==n-1
      if (i === 0 && j === n - 1) continue;
      const inter = segmentIntersection(points[i], points[i + 1], points[j], points[j + 1]);
      if (inter) {
        return { intersection: inter, i, j };
      }
    }
  }
  return null;
};

// Определяет замкнутый многоугольник для заливки.
// Если расстояние между первой и последней точкой меньше порога – возвращает весь массив точек.
// Если нет, пытается найти самопересечение и построить замкнутый полигон.
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

// Алгоритм ray-casting для проверки, находится ли точка внутри многоугольника
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

const Drawing = ({navigation}) => {
  /////// for server
  const comicsName = 'Без названия'
  const page = 10
  const pageCount = 10
  const newPage = page/10
  // if ()
  const truncateText = (text) => {
      if (text.length > 17) {
        return text.slice(0, 17) + '...'; // Добавляем многоточие
      }
      return text;
  };
  const name=truncateText(comicsName)

  const [pageCheck, setPageCheck] = useState(false)
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [tool, setTool] = useState('pencil'); // 'pencil', 'marker', 'eraser', 'fill'
  const [color, setColor] = useState('black');
  const [width, setWidth] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [widthSelectionVisible, setWidthSelectionVisible] = useState(false);
  const [colorSelectionVisible, setColorSelectionVisible] = useState(false);
  const [pencilColor, setPencilColor] = useState('#4A92F4')
  const [markerColor, setMarkerColor] = useState('#1f1f1f')
  const [easerColor, setEaserColor] = useState('#1f1f1f')
  const [fillColor, setFillColor] = useState('#1f1f1f')
  const [textColor, setTextColor] = useState('#1f1f1f')


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
    let newOpacity = (tool === 'marker') ? 0.5 : 1;
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

  // Улучшенная функция заливки с учетом самопересечения
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

  // Функция экспорта SVG в формате JSON
  const handleExport = () => {
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
    console.log(JSON.stringify(exportData, null, 2));
    Alert.alert('Экспорт', 'SVG в формате JSON выведен в консоль');
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
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>{
          navigation.goBack()
        }}>
          <Image source={require('../../assets/images/back.png')} style={styles.goBack}/>
        </TouchableOpacity>
        <View style={styles.arrows}>
          <TouchableOpacity>
            <Image source={require('../../assets/images/undo.png')} style={styles.arrow}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../../assets/images/redo.png')} style={styles.arrow}/>
          </TouchableOpacity>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Image source={require('../../assets/images/point.png')} style={styles.point}/>
          <View style={styles.numbers}>
            {pageCheck &&
            <Text style={styles.numberText}>0</Text>
            }
            <Text style={styles.numberText}>{page}/{pageCount}</Text>
            </View>
        </View>
        <TouchableOpacity style={styles.cleanButton} onPress={clearCanvas}>
          <Image source={require('../../assets/images/clean.png')} style={styles.clean}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons}>
        <Image source={require('../../assets/images/plus.png')} style={styles.plus}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons}>
        <Image source={require('../../assets/images/layers.png')} style={styles.layers}/>
        </TouchableOpacity>
      </View>
      <View style={styles.canvasContainer}>
        <View style={styles.svgBack}/>
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
      </View>
    


      {/* Модальное окно выбора толщины */}
      <Modal
        visible={widthSelectionVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWidthSelectionVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent]}>
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
        visible={colorSelectionVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setColorSelectionVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Выберите цвет</Text>
          <View style={styles.colorPickerContainer}>
        <ColorPicker onColorSelected={setColor} />
      </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setColorSelectionVisible(false)}
            >
              <Text style={[styles.modalCloseButtonText]}>Готово</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      
      <View style={[styles.instrumentContainer]}>
        <TouchableOpacity style={styles.instrumentItem} onPress={()=>{
          switchToPencil()
          setPencilColor("#4A92F4")
          setMarkerColor("#1f1f1f")
          setEaserColor("#1f1f1f")
          setFillColor("#1f1f1f")
          setTextColor("#1f1f1f")
        }}>
            <PencilIcon color={pencilColor}/>
            <View style={[styles.instrumentBack, {opacity:0.4, backgroundColor: pencilColor === '#1f1f1f' ? '#ffffff' : pencilColor}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.instrumentItem} onPress={()=>{
          switchToMarker()
          setPencilColor("#1f1f1f")
          setMarkerColor("#4A92F4")
          setEaserColor("#1f1f1f")
          setFillColor("#1f1f1f")
          setTextColor("#1f1f1f")
        }}>
            <MarkerIcon color={markerColor}/>
            <View style={[styles.instrumentBack, {opacity:0.4, backgroundColor: markerColor === '#1f1f1f' ? '#ffffff' : markerColor}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.instrumentItem} onPress={()=>{
          switchToEraser()
          setPencilColor("#1f1f1f")
          setMarkerColor("#1f1f1f")
          setEaserColor("#4A92F4")
          setFillColor("#1f1f1f")
          setTextColor("#1f1f1f")
        }}>
            <EaserIcon color={easerColor}/>
            <View style={[styles.instrumentBack, {opacity:0.4, backgroundColor: easerColor === '#1f1f1f' ? '#ffffff' : easerColor}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.instrumentItem} onPress={()=>{
          switchToFill()
          setPencilColor("#1f1f1f")
          setMarkerColor("#1f1f1f")
          setEaserColor("#1f1f1f")
          setFillColor("#4A92F4")
          setTextColor("#1f1f1f")
        }}>
            <FillIcon color={fillColor}/>
            <View style={[styles.instrumentBack, {opacity:0.4, backgroundColor: fillColor === '#1f1f1f' ? '#ffffff' : fillColor}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.instrumentItem} onPress={()=>{
          // switchToText()
          setPencilColor("#1f1f1f")
          setMarkerColor("#1f1f1f")
          setEaserColor("#1f1f1f")
          setFillColor("#1f1f1f")
          setTextColor("#4A92F4")
        }}>
            <TextIcon color={textColor}/>
            <View style={[styles.instrumentBack, {opacity:0.4, backgroundColor: textColor === '#1f1f1f' ? '#ffffff' : textColor}]}/>
        </TouchableOpacity>
        <Image source={require('../../assets/images/line.png')} style={styles.line}/>
        <TouchableOpacity style={styles.selectedContainer} onPress={()=>{
          setColorSelectionVisible(true)
        }}>
          <Image source={require('../../assets/images/stroke.png')} style={styles.stroke}/>
          <View style={[styles.selectedColor, { backgroundColor: color }]} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../../assets/images/addButton.png')} style={styles.addButton}/>
        </TouchableOpacity>
      </View>
      {/* Кнопка экспорта перемещена вниз */}
      <View style={styles.exportContainer}>
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
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
  },
  header:{
    height:heightPercentageToDP(5.5),
    alignItems:'center',
    width:widthPercentageToDP(93),
    flexDirection:'row'
  },
  canvas: {
    width:widthPercentageToDP(93),
 
    aspectRatio: 3/4.2,
  },
  svgBack:{
    width:widthPercentageToDP(93),
    position:'absolute',
    aspectRatio: 3/4.2,
    alignSelf:'center',
    marginLeft:widthPercentageToDP(3.5),
    backgroundColor:'#fff',

  },
  canvasContainer:{
    backgroundColor:'#F3f3f3',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    height:heightPercentageToDP(75)
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
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily:'font'
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
    fontFamily:'font',
    marginTop:heightPercentageToDP(2)
  },
  instrumentContainer:{
    flexDirection:'row',
    height:heightPercentageToDP(9),
    alignItems:'center',
    width:widthPercentageToDP(93)
  },
  instrumentItem:{
    opacity:1,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:1,
    width:widthPercentageToDP(11),
    height:widthPercentageToDP(11),
  },
  instrumentBack:{
    width:widthPercentageToDP(11),
    height:widthPercentageToDP(11),
    position:'absolute',
    zIndex:-1,
    borderRadius:50,

  },
  selectedColor: {
    width: widthPercentageToDP(8),
    height: widthPercentageToDP(8),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  stroke:{
    width: widthPercentageToDP(8),
    height: widthPercentageToDP(8),
    position:'absolute',
    zIndex:1
  },
  selectedContainer:{
    marginLeft:widthPercentageToDP(3)
  },
  addButton:{
    width: widthPercentageToDP(8),
    height: widthPercentageToDP(8),
    marginLeft:widthPercentageToDP(2)
  },
  line:{
    height:widthPercentageToDP(8),
    with:widthPercentageToDP(0.01),
    marginLeft:widthPercentageToDP(16)
  },
  goBack:{
    width:widthPercentageToDP(3.5),
    height:widthPercentageToDP(3.5)
  },
  arrows:{
    flexDirection:'row',
    marginLeft:widthPercentageToDP(5)
  },
  arrow:{
    width:widthPercentageToDP(3.8),
    height:heightPercentageToDP(2),
    marginLeft:widthPercentageToDP(2)
  },
  info:{
    position:'absolute',
    alignSelf:'center',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    left:'50%',
    transform: [{ translateX: '-50%' }], // Смещение на половину высоты
  },
  name:{
    fontFamily:'font',
    fontSize:widthPercentageToDP(3.6)
  },
  point:{
    width:widthPercentageToDP(0.7),
    aspectRatio: 1,
    margin:widthPercentageToDP(1)
  },
  numberText:{
    color:'#90969F',
    fontFamily:'font',
    fontSize:widthPercentageToDP(2.5)
  },
  clean:{
    width:widthPercentageToDP(5),
    height:widthPercentageToDP(4)
  },
  plus:{
    width:widthPercentageToDP(3),
    height:widthPercentageToDP(3)
  },
  layers:{
    width:widthPercentageToDP(5),
    height:widthPercentageToDP(4)
  },
  cleanButton:{
    marginLeft:widthPercentageToDP(53)
  },
  buttons:{
    marginLeft:widthPercentageToDP(3)
  }
});

export default Drawing;
