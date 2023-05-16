import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import styles from './CommentScr.component.style'
import { AntDesign } from '@expo/vector-icons';
import Comment from './comment/index'
import Footer from './footer/index'

export default function App() {
  const [listComment, setListComment] = useState([]);
  const handleAddComment = (comment) => {
    setListComment([...listComment, comment]) //Cú pháp  ...pressingdex?? có thể hiểu là copy lại toàn bộ array cũ 
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.sub_header}>
            <View style={styles.currentComments}>
                <TouchableOpacity><View style={styles.closeBtn}><AntDesign name="close" size={24} color="black" /></View></TouchableOpacity>
                <Text style={styles.totalComment}>3245 Comments</Text>
            </View>
            <View style={styles.currentSong}>
                <View style={styles.Image}><Image source={require('./../../../assets/singtoyou.png')} style={styles.songImage}/></View>
                <View style={styles.songInfor}>
                    <Text style={styles.songName} numberOfLines={1}>Sing to You (FEAT. Shiloh Dynasty) *ALSO ON SPOTIFY*</Text>
                    <Text style={styles.artis}>Monty Datta</Text>
                </View>
            </View>
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {
              listComment.map((item, index) => {
                return <Comment key={index} title={item}/>
              })
            }
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Footer onAddComment={handleAddComment}/>
      </View>
    </View>
  )
}