import React, { useEffect, useRef, useState } from 'react';
import { 
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    FlatList,
    Animated,
 } from 'react-native';
 import TrackPlayer,{
    Capability,
    Event,
    RepeatMode,
    State,
    usePlaybackState,
    useProgress,
    useTrackPlayerEvents,
 } from 'react-native-track-player';
 import Ionicons from 'react-native-vector-icons/Ionicons'
 //import Ionicons from 'react-native-vector-icons';

 import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
 import Slider from '@react-native-community/slider';
 const songs = [
    {
        title: "Aya_Nakamura_-_Copines__Slowed__Reverb",
        artist: "123",
        artwork: require("../../assets/artwork/111.png"),
        url: require("../../assets/songs/Aya_Nakamura_-_Copines__Slowed__Reverb.mp3"),
        id:1,
       // duration:311,
    },
    {
        title: "SING-OF_TIKTOK_OF__TAREK_SIS_SEMONGKO_viral_2020",
        artist: "1223",
        artwork: require("../../assets/artwork/222.jpg"),
        url: require("../../assets/songs/SING-OF_TIKTOK_OF__TAREK_SIS_SEMONGKO_viral_2020.mp3"),
        id:2,
    }
]

const {width, height} = Dimensions.get('window');

const setupPlayer = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
        capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
        ]
    });
    await TrackPlayer.add(songs);
}

const togglePlayback = async (playbackState) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();

    if (currentTrack !== null ){
         if (playbackState == State.Paused){
            await TrackPlayer.play();
         }else{
            await TrackPlayer.pause();
         }
    }
}

const MusicPlayer = () => {
    const playbackState = usePlaybackState();
    const progress = useProgress();

    const [trackArtwork, setTrackArtwork] = useState();
    const [trackArtist, setTrackArtist] = useState();
    const [trackTitle, setTrackTitle] = useState();

    const scrollX = useRef(new Animated.Value(0)).current;
    const [songIndex, setSongIndex] = useState(0);
    const [repeatMode, setRepeatMode] = useState('off');
    const songSlider =useRef(null);

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null ) {
           const track = await TrackPlayer.getTrack(event.nextTrack);
           const {title, artwork, artist,} = track;
           setTrackArtwork(artwork);
           setTrackTitle(title);     
           setTrackArtist(artist); 
        }
    })

    const repeatIcon = () => {
        if ( repeatMode == 'off'){
            return 'repeat-off';
        }
        if ( repeatMode == 'track'){
            return 'repeat-once';
        }
        if ( repeatMode == 'repeat'){
            return 'repeat';
        }
    }

    const changeRepeatMode = () => {
        if (repeatMode == 'off') {
            TrackPlayer.setRepeatMode(RepeatMode.Track);
            setRepeatMode('track');
        }
        if (repeatMode == 'track') {
            TrackPlayer.setRepeatMode(RepeatMode.Queue);
            setRepeatMode('repeat');
        }
        if (repeatMode == 'repeat') {
            TrackPlayer.setRepeatMode(RepeatMode.Off);
            setRepeatMode('off');
        }
    }

    const skipTo = async (trackId) =>{
        await TrackPlayer.skip(trackId);
    } 

    useEffect(() =>{
        setupPlayer();

        scrollX.addListener(({value})=>{
            const index = Math.round(value / width);
            skipTo(index);
            setSongIndex(index);
        });
        return() => {
            scrollX.removeListeners();
        }
    },[]);

    const skipToNext = () => {
        songSlider.current.scrollToOffset({
            offset: (songIndex + 1)* width,
        });
    }
    const skipToPrevious = () => {
        songSlider.current.scrollToOffset({
            offset: (songIndex - 1)* width,
        });
    }

    const renderSongs = ({index, item})=> {
        return (
            <Animated.View style = {{
                width: width,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <View style = {styles.artworkWrapper}>
            <Image
                source={trackArtwork}
                style={styles.artworkImg}
            />
            </View>
            </Animated.View>
        );
    }
        return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContainer}>
                <View style={{width: width,}}>
                    <Animated.FlatList
                        ref={songSlider}
                        data={songs}
                        renderItem={renderSongs}
                        keyExtractor={(item)=> item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator = {false}
                        scrollEventThrottle={16}
                        onScroll={Animated.event(
                            [{nativeEvent: {
                                contentOffset: {x: scrollX}
                            } }],
                            {useNativeDriver: true}
                        )}
                    />
                </View>

                <View>
                    <Text style={styles.title}>{trackTitle}</Text>
                    <Text style={styles.artist}>{trackArtist}</Text>
                </View>

                <View>
                    <Slider
                        style={styles.progressContainer}
                        value={progress.position}
                        minimumValue={0}
                        maximumValue={progress.duration}
                        thumbTintColor="#FFD396"
                        minimumTrackTintColor="#ffd396"
                        maximumTrackTintColor="#fff"
                        onSlidingComplete={async(value)=>{
                            await TrackPlayer.seekTo(value);
                        }}
                    />
                    <View style={styles.progressLabelContainer}>
                        <Text style={styles.progressLabelTxt}>
                            {new Date(progress.position * 1000).toISOString().substr(14, 5)}
                        </Text>
                        <Text style={styles.progressLabelTxt}>
                            {new Date((progress.duration - progress.position) * 1000).toISOString().substr(14, 5)}
                        </Text>
                    </View>
                </View>

                <View style={styles.musicControls}>
                    <TouchableOpacity onPress={skipToPrevious}>
                        <Ionicons name="play-skip-back-outline" size={35} color="#FFD396" style={{marginTop: 25}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>togglePlayback(playbackState)}>
                        <Ionicons name={playbackState == State.Playing?"ios-pause-circle": "ios-play-circle"} size={75} color="#FFD396" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={skipToNext}>
                        <Ionicons name="play-skip-forward-outline" size={35} color="#FFD396" style={{marginTop: 25}}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.bottomControl}>
                <TouchableOpacity onPress={()=>{}}>
                    <Ionicons name = "heart-outline" size={30} color="#777777"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={changeRepeatMode}>
                    <MaterialCommunityIcons name = {'${repeatIcon()}'} size={30} color={repeatMode !=='off'? "#FFD396" : "#777777"}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{}}>
                    <Ionicons name = "share-outline" size={30} color="#777777"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{}}>
                    <Ionicons name = "ellipsis-horizontal" size={30} color="#777777"/>
                </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222831'
    },
    mainContainer: {
        flex: 1,
        alignItems : "center",
        justifyContent : "center",
    },
    artworkWrapper: {
        width: 300,
        height: 340,
        marginBottom:25,
        shadowColor:"#000",
        shadowOffset:{
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,

        elevation: 5,
    },
    artworkImg: {
        width: '100%', height: '100%',
        borderRadius: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: '#EEEEEE'
    },
    artist: {
        fontSize:16,
        fontWeight: '200',
        textAlign: 'center',
        color: '#EEEEEE'
    },
    progressContainer: {
        width: 350,
        height:40,
        marginTop: 25,
        flexDirection: 'row',
    },
    musicControls: {
        flexDirection: 'row',
        width: "60%",
        justifyContent: 'space-between',
        marginTop: 15,
    },
    progressLabelContainer: {
        width:340,
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    progressLabelTxt: {
        color: '#fff',
    },
    bottomContainer: {
        borderTopColor: "#393E46",
        borderTopWidth: 1,
        width: width,
        alignItems: "center",
        paddingVertical: 15
    },
    bottomControl: {
        flexDirection: 'now', 
        justifyContent:'space-between', 
        width: '80%'}
})

export default MusicPlayer