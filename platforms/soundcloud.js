const scdl = require('soundcloud-downloader').default,
	{token_sc} = require('../config.json');;

module.exports={
	name:"soundcloud",
	execute(context){
		if(scdl.isPlaylistURL(context.update.message.text))return context.reply("I can't work with playlists")
		scdl.getInfo(context.update.message.text, token_sc)
			.then(async info=>{
				scdl.download(context.update.message.text, token_sc)
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
