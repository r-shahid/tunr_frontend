import React, {useEffect, useState} from 'react'
import axios from 'axios'

const Playlist = () =>{
    const [songs, setSongs] = useState([])
    const [updateFave, setUpdateFave] = useState(false)
    const [faves, setFaves] = useState([])

    useEffect(() => {
        const songAPI = async () => {
            try {
                const res = await fetch('https://rs-tunr-backend.herokuapp.com/playlists/1/songs')
                const json = await res.json()
                setSongs(json)
            }catch (error){
                console.log(error)
            }
        }
        songAPI()
    }, [])

    const faveTrue= (song) => {
        axios({
            url: `https://rs-tunr-backend.herokuapp.com/playlists/1/songs/${song.id}`,
            method: "PUT",
            data: {isFavorite: true},
        })
        setUpdateFave(true)
          window.location.reload()
    }

    let displaySongs = ''
    if (songs[0]) {
        displaySongs = songs.map((song) => {
            return(
                <div className='each-song'>
                    <p className='title'>{song.title}</p>
                    <p className='artist'>{song.artist}</p>
                    <p className='time'>{song.time}</p>
                    <button onClick={() => faveTrue(song)}>Fave</button>
                </div>
            )
        })
    }

    useEffect(() => {
        const faveAPI = async () => {
            try {
                // im using rosters for faves --> there's no separate faves model and idk how to make a faves route from what i already have
                const res = await fetch('https://rs-tunr-backend.herokuapp.com/rosters')
                const json = await res.json()
                setFaves(json)
            }catch (error){
                console.log(error)
            }
        }
        faveAPI()
    }, [])

    let faveSongs = ''
    if (songs[0]) {
        faveSongs = faves.map((song) => {
            return(
                <div className='each-song'>
                    <p className='title'>{song.title}</p>
                    <p className='artist'>{song.artist}</p>
                    <p className='time'>{song.time}</p>
                    {/* <button onClick={() => faveTrue(song)}>Fave</button> */}
                </div>
            )
        })
    }

    return(
        <>
        <h2>Playlist</h2>
            {displaySongs}
        <h2>Favorites</h2>
            {faveSongs}
        </>
    )
}

export default Playlist