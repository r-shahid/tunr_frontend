import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Playlist = () => {
	const [songs, setSongs] = useState([]);
	const [updateFave, setUpdateFave] = useState(false);
	const [faves, setFaves] = useState([]);
	const [formData, setFormData] = useState({
		title: '',
		artist: '',
		time: '',
		isFavorite: false,
	});

	const songAPI = async () => {
		try {
			const res = await fetch(
				'https://rs-tunr-backend.herokuapp.com/playlists/1/songs'
			);
			const json = await res.json();
			setSongs(json);
		} catch (error) {
			console.log(error);
		}
	};

	const faveAPI = async () => {
		try {
			// im using rosters for faves --> there's no separate faves model and idk how to make a faves route from what i already have
			// should have used a FILTER omg
			const res = await fetch('https://rs-tunr-backend.herokuapp.com/rosters');
			const json = await res.json();
			setFaves(json);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		songAPI();
	}, [faves, songs, updateFave]);

	const faveTrue = (song) => {
		axios({
			url: `https://rs-tunr-backend.herokuapp.com/playlists/1/songs/${song.id}`,
			method: 'PUT',
			data: { isFavorite: true },
		});
		setUpdateFave(true);
		faveAPI()
		// window.location.reload();
	};

	const faveFalse = (song) => {
		axios({
			url: `https://rs-tunr-backend.herokuapp.com/playlists/1/songs/${song.id}`,
			method: 'PUT',
			data: { isFavorite: false },
		});
		setUpdateFave(false);
		faveAPI()
		// window.location.reload();
	};

	const handleDelete = (song) =>{
		axios({
			url: `https://rs-tunr-backend.herokuapp.com/playlists/1/songs/${song.id}`,
			method: 'DELETE',
		});
		songAPI();
		// window.location.reload();
	}

	let displaySongs = '';
	if (songs[0]) {
		displaySongs = songs.map((song) => {
			if (song.isFavorite == true){
				var name = (<div className='name'><p>{song.title}</p><i class='fas fa-heart'></i></div>);
			}else {
				var name = (
					<div className='name'>
						<p>{song.title}</p>
					</div>
				);
			}
			return (
				<div className='each-song'>
					<div className='song-info'>
						<p className='title'>{name}</p>
						<p className='artist'>{song.artist}</p>
						<p className='time'>{song.time}</p>
					</div>
					<div className='buttons'>
						<button onClick={() => faveTrue(song)}>
							<i class='far fa-heart fa-2x'></i>
						</button>
						<button onClick={() => handleDelete(song)}>
							<i class='fas fa-trash fa-2x'></i>
						</button>
					</div>
				</div>
			);
		});
	}

	useEffect(() => {
		faveAPI();
	}, [updateFave, faves]);

	let faveSongs = '';
	if (songs[0]) {
		faveSongs = faves.map((song) => {
			return (
				<div className='each-song'>
					<div className='song-info'>
						<p className='title'>{song.title}</p>
						<p className='artist'>{song.artist}</p>
						<p className='time'>{song.time}</p>
					</div>
					<div className='buttons'>
						<button onClick={() => faveFalse(song)}>
							<i class='fas fa-times fa-2x'></i>
						</button>
					</div>
				</div>
			);
		});
	}

	const handleChange = (e) => {
		console.log(e.target.name, e.target.value);
		e.preventDefault();
		setFormData({ ...formData, [e.target.name]: e.target.value });
		console.log(formData);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
		try {
			axios({
				url: 'https://rs-tunr-backend.herokuapp.com/playlists/1/songs',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				data: JSON.stringify(formData),
			});
		} catch (error) {
			console.log(error);
		}
		setFormData({
			title: '',
			artist: '',
			time: '',
			isFavorite: false,
		});
		// songAPI();
		// window.location.reload();
	};

	return (
		<div className='playlist'>
			<h2>All Songs</h2>
			{displaySongs}
			<h2>Favorites</h2>
			{faveSongs}
			<h3>Add a New Song</h3>
			<form>
				<input
					placeholder='Title'
					name='title'
					value={formData.title}
					onChange={handleChange}
				/>
				<input
					placeholder='Artist'
					name='artist'
					value={formData.artist}
					onChange={handleChange}
				/>
				<input
					placeholder='Time'
					name='time'
					value={formData.time}
					onChange={handleChange}
				/>
			</form>
			<button className='submit' onClick={handleSubmit}>SUBMIT</button>
		</div>
	);
};

export default Playlist;
