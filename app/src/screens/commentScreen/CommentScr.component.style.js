import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    header:{
        flex: 9,
        justifyContent: 'space-between'
    },
    sub_header:{
        marginTop: 40,
    },
    currentComments:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    closeBtn:{
        width: 40,
        height: 40,
        backgroundColor: '#F3F3F3',
        borderRadius: 30,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    close:{
        fontSize: 25
    },
    totalComment:{
        fontSize: 20,
        fontWeight: 'bold',
        width: '80%'
    },
    currentSong:{
        flexDirection: 'row',
        marginHorizontal: 15,
        marginVertical: 10,
        alignItems: 'center',
    },
    Image:{
        padding: 0.1,
        borderWidth: 0.5,
        marginRight: 10,
        borderColor: '#898989'
    },
    songImage:{
        width: 50,
        height: 50,
    },
    songInfor:{
        margin: 10,
        alignItems: 'center',
    },
    songName:{
      marginRight: 10, //Không thể xuống dòng được
      fontWeight: 'bold',
    },
    artis:{
      color: '#898989',
    },

    body:{
        marginHorizontal: 25
    },
    comment:{

    },
    footer:{
       marginBottom: 15
    }

})

export default styles;