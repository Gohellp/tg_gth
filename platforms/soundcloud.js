const scdl = require('soundcloud-downloader').default,
	{token_sc} = require('../config.json');;

module.exports={
	name:"soundcloud",
	execute(context){
		scdl.getInfo(context.update.message.text, token_sc)
			.then(async info=>{
				scdl.download(context.update.message.text, token_sc)
				.then(async stream=>{
					console.log(info.artwork_url)
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
