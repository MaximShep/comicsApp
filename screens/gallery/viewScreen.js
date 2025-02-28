import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  Image,
  SafeAreaView
} from 'react-native';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import Svg, { Path, G } from 'react-native-svg';

const ViewScreen = ({navigation}) => {
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
  // Добавляем новые состояния для истории и redo-стека
  const [history, setHistory] = useState([]); // история изменений (максимум 10)
  const [redoStack, setRedoStack] = useState([]);


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

  // Обновляем handleTouchEnd, чтобы сохранять состояние в history
const handleTouchEnd = () => {
  if (currentLine && tool !== 'fill') {
    const newLines = [...lines, currentLine];
    setLines(newLines);
    // Сохраняем снимок состояния в history, ограничивая размер 10
    setHistory(prev => {
      const updated = [...prev, newLines];
      if (updated.length > 10) {
        updated.shift(); // удаляем самый ранний снимок
      }
      return updated;
    });
    setCurrentLine(null);
    // При новом действии очищаем redo-стек
    setRedoStack([]);
  }
};
// Функция Undo: возвращаемся к предыдущему состоянию
const handleUndo = () => {
  if (history.length > 0) {
    // Сохраняем текущее состояние в redo-стек
    setRedoStack(prev => [...prev, lines]);
    // Извлекаем последнее состояние из history и устанавливаем его как текущее
    setHistory(prev => {
      const updated = [...prev];
      const lastState = updated.pop();
      setLines(lastState);
      return updated;
    });
  }
};
const handleRedo = () => {
  if (redoStack.length > 0) {
    // Сохраняем текущее состояние в history
    setHistory(prev => [...prev, lines]);
    // Извлекаем последнее состояние из redoStack и устанавливаем его как текущее
    setRedoStack(prev => {
      const updated = [...prev];
      const lastState = updated.pop();
      setLines(lastState);
      return updated;
    });
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>{
          navigation.goBack()
        }}>
          <Image source={require('../../assets/images/back.png')} style={styles.goBack}/>
        </TouchableOpacity>
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
      </View>
      <View style={styles.canvasContainer}>
        <View style={styles.svgBack}/>
        <Image style={styles.canvas}/>
      </View>
    


     
      <View style={[styles.instrumentContainer]}>
        <TouchableOpacity style={styles.instrumentItem} onPress={()=>{
            //назад
        }}>
            <Image source={require('../../assets/images/back.png')} style={styles.arrow}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.instrumentItem} onPress={()=>{
            //вперед
        }}>
                       <Image source={require('../../assets/images/next.png')} style={styles.arrow}/>

        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    height:heightPercentageToDP(70)
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
    width:widthPercentageToDP(93),
    justifyContent:'center'
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

export default ViewScreen;
