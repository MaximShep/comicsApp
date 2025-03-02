import React, { useEffect, useState } from 'react';
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
import { SvgXml } from 'react-native-svg';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import Svg, { Path, G } from 'react-native-svg';
import { Buffer } from 'buffer';



const base64ToSvg = (base64String) => {
  const svgString = Buffer.from(base64String, 'base64').toString('utf-8');
  return JSON.parse(svgString); // или другой способ преобразования, в зависимости от структуры SVG
};
const ViewScreen = ({navigation}) => {
  /////// for server
  const comicsName = 'Без названия'
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
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(()=>{
    console.log("From base64:")
    console.log(global.base64Array);
    console.log("to svg")
    console.log(global.base64Array.map(base64ToSvg));
    const svgArray = global.base64Array.map(base64ToSvg);
    setPages(svgArray);
    console.log(pages)
    
    setPage(1);
    loadPage(1);
  }, [])

  const saveCurrentPage = () => {
    setPages(prevPages => {
      const newPages = [...prevPages];
      newPages[currentPage] = lines;
      return newPages;
    });
  };

  const loadPage = (pageIndex) => {
    const pageData = pages[pageIndex-1];
    setLines(pageData && pageData.length ? pageData : []);
    setCurrentLine(pages[pageIndex-1]);
  };

  const handleUndoPress = () => {
    if (currentPage > 1) {
      const newIndex = currentPage - 1;
      setPage(newIndex);
      setCurrentPage(newIndex);
      loadPage(newIndex);
    }
  };
  
  const handleRedoPress = () => {
    if (currentPage < pageCount) {
      const newIndex = currentPage + 1;
      setPage(newIndex);
      setCurrentPage(newIndex);
      loadPage(newIndex);
    }
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
          <Svg style={styles.canvas}>
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
            </G>
          </Svg>
          </View>


     
      <View style={[styles.instrumentContainer]}>
        <TouchableOpacity style={styles.instrumentItem} onPress={()=>{
            handleUndoPress();
        }}>
            <Image source={require('../../assets/images/back.png')} style={styles.arrow}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.instrumentItem} onPress={()=>{
            handleRedoPress();
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
    flexDirection:'row',
    marginTop:heightPercentageToDP(4)
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
