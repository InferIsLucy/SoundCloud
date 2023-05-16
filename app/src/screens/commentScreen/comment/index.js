import { View, Text, TouchableOpacity, Keyboard } from 'react-native'
import React, { useState } from 'react' 
import styles from './style'
import { Avatar } from "react-native-paper";
import { Entypo } from '@expo/vector-icons';
import Comment from '../footer/index'

const comment = (props) => {
    const [isReplyComment, setIsReplyComment] = useState(styles.container);
    const handleOpenReplyComment = () => {
        setIsReplyComment(styles.containerReply);
    }

  return (
    <View style={isReplyComment}>
        <View style={styles.userImage}><Avatar.Image size={35} source={require('./../../../../assets/useravatar.png')} /></View>
        <View style={styles.body}>
            <View style={styles.commentInfor}>
                <View><Text style={styles.userName}>Daniel Clark</Text></View>
                <View style={styles.commentRecordedTime}>
                    <Text style={styles.time}>at 0:39 <Entypo name="dot-single" size={15} color="#898989" /> 2w </Text>
                </View>
            </View>
            <View style={styles.content}>
                <Text numberOfLines={2}>{props.title}</Text>
            </View>
            <View style={styles.moreOption}>
                <TouchableOpacity style={styles.reply} onPress={handleOpenReplyComment}>
                    <Text style={styles.replyText}>Reply</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Entypo name="dots-three-vertical" size={17} color="black" style={styles.replyText}/>
                </TouchableOpacity>
            </View> 
        </View>
    </View>
  )
}

export default comment