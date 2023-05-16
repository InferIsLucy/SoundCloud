import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    addComment:{
        paddingHorizontal: 20,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    input:{
        height: 40,
        width: '85%',
        backgroundColor: '#F3F3F3',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 20,
        paddingHorizontal: 20
    },
    iconWrapper:{
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10
    },
})

export default styles;