import React, {useState, useEffect} from "react";
import {FlatList,View,Text,TextInput, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, Image,  } from "react-native";



const SearchScreen = () => {
    const [filterdData, setfilterdData]= useState([]);
    const [masterData, setmasterData]= useState([]);
    const [search, setsearch] = useState('');
    useEffect (()=>{
        fetchPosts();
        return () => {

        }
    }, [])
    const fetchPosts = () => {
        const apiURL = 'https://jsonplaceholder.typicode.com/posts';
        fetch(apiURL)
        .then((response) => response.json())
        .then((responseJson) => {
            setfilterdData(responseJson);
            setmasterData(responseJson);
        }).catch((error) => {
            console.error(error);
        })
    }

    const searchFilter = (text) =>{
        if (text) {
            const newData=masterData.filter((item) =>{
                const itemData=item.title? item.title.toUpperCase()
                : ''.toLowerCase();
            const textData=text.toUpperCase();
            return itemData.indexOf(textData) > -1;
            });
            setfilterdData(newData);
            setsearch(text);
        }else {
            setfilterdData(masterData);
            setsearch(text);
        }
    }
    const ItemView = ({item}) => {
        return(
            <TouchableOpacity style={styles.itemStyle} onPress={null}>
            <View style={styles.itemContainer}>
                <View style={styles.itemLogo}>
                <Image
                style= {styles.itemImage}
                source={{url: 'https://tse3.mm.bing.net/th?id=OIP.8GxBli-8O0IoBUMkyA3u6wHaHa&pid=Api&P=0'}}
                />
                </View>
                <View style={styles.itemBody}>
                <Text style={styles.itemName}>{item.id}{'. '}{item.title.toUpperCase()}</Text>
                </View>
                <View style={styles.option}>
                
                </View>
            </View>
            </TouchableOpacity>
        )
    }
    const ItemSeparatorView = () =>{
        return(
            <View style={{height : 0.8, 
                width :'100%', 
                backgroundColor: '#332222'}}/>
        )
    }
    return (
        <SafeAreaView style={{flex:1}}>
            <View style={styles.container}>
            <TextInput
                style={styles.textInputStyle}
                value={search}
                placeholder='search here'
                underlineColorAndroid="transparent"
                onChangeText={(text)=> searchFilter(text)}
            />
            <FlatList
            data={filterdData}
            keyExtractor= {(item, index) =>index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
                />
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor:'white',
    },
    itemStyle:{
        padding:10  
    },
    textInputStyle:{
        height:50,
        borderWidth:1,
        paddingLeft:20,
        margin:5,
        borderColor:'#009688',
        backgroundColor:'white',
    },
    btnTab: {
        width: Dimensions.get('window').width/3.5,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor:'#EBEBEB',
        padding: 10,
        justifyContent: 'center',
    },
    itemContainer:{
        flexDirection: 'row',
        paddingVertical: 15,
    },
    itemLogo: {
        padding:10,
        width: 50,
        height:50,
    },
    itemBody:{
        flex: 1,
        paddingHorizontal:10,
        justifyContent: 'center',

    },
    itemName:{
        fontWeight: 'bold',
        fontSize: 16
    },
    itemImage: {
        width: 50,
        height:50,
    },
})
export default SearchScreen

