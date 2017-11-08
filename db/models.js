var models = {
    song: require('../models/song').Song,
    playlist: require('../models/playlist').Playlist,
    songPlaylist: require('../models/songPlaylist').SongPlaylist,
    user: require('../models/user').User

};

models.song.belongsToMany(models.playlist, {
    through: models.songPlaylist,
    foreignKey: 'song_id',
    constraints: false
});

models.playlist.belongsToMany(models.song, {
    through: models.songPlaylist,
    foreignKey: 'playlist_id',
    constraints: false
});

module.exports.song = models.song;
module.exports.playlist = models.playlist;
module.exports.user = models.user;