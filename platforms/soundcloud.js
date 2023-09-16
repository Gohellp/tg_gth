const scdl = require('soundcloud-downloader').default,
	{token_sc} = require('../config.json');

module.exports={
	name:"soundcloud",
	execute(context,link){
		return context.reply("Sorry currently soundcloud unavailable")
		if(scdl.isPlaylistURL(link))return context.reply("I can't work with playlists")
		scdl.getInfo(link, token_sc)
			.then(async info=>{
				scdl.download(info.permalink_url, token_sc)
				.then(async stream=>{
					await context.replyWithAudio({
						source:stream
					},{
						performer:info.publisher_metadata.artist,
						title:info.title,
						thumb:info.artwork_url
					})
				})
			})
	}
}
