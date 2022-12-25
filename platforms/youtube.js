const ytdl = require("ytdl-core"),
	ytpl = require("ytpl");

module.exports={
	name:"youtube",
	execute(context){
		if(context.message.text.match(/\/playlist/)){
			ytpl(context.update.message.text).then(urls=>{
				urls.items.map(async item=>{
					ytdl.getInfo(item.shortUrl)
						.then(async info => {
							if (info.videoDetails.lengthSeconds > 1800) return context.reply("Video SOOOOO THICK!\nTry found out the __song__")
							await context.replyWithAudio({
								source: ytdl(item.shortUrl, {filter: 'audioonly'})
							}, {
								performer: info.player_response.videoDetails.author.replace(/ - Topic$/, ""),
								title: info.player_response.videoDetails.title.replace(/ ?\((\w)*.? ? (\w?[А-Яа-я]?,? ?)*\)/ui, "")
							})
						})
				})
			})

		}else {
			ytdl.getInfo(context.update.message.text)
				.then(async info => {
					if (info.videoDetails.lengthSeconds > 1800) return context.reply("Video SOOOOO THICK!\nTry found out the __song__")
					await context.replyWithAudio({
						source: ytdl(context.update.message.text, {filter: 'audioonly'})
					}, {
						performer: info.player_response.videoDetails.author.replace(/ - Topic$/, ""),
						title: info.player_response.videoDetails.title.replace(/ ?\((\w)*.? ? (\w?[А-Яа-я]?,? ?)*\)/ui, "")
					})
				})
		}
	}
}