const scdl = require('soundcloud-downloader').default,
	{token_sc} = require('../config.json');;

module.exports={
	name:"soundcloud",
	execute(context){
		if(context.update.message.text.match(/\/sets\//))return context.reply("This is not a track")
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
