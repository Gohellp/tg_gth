const ytdl = require("ytdl-core");

module.exports={
	name:"youtube",
	execute(context){
		ytdl.getInfo(context.update.message.text)
			.then(async info=>{
				if(info.videoDetails.lengthSeconds>1800)return context.reply("Video SOOOOO THICK!\nTry found out the __song__")
				await context.replyWithAudio({
					source:ytdl(context.update.message.text, { filter: 'audioonly' })
				},{
					performer: info.player_response.videoDetails.author.replace(/ - Topic$/,""),
					title: info.player_response.videoDetails.title.replace(/ ?\((\w)*.? ? (\w?[А-Яа-я]?,? ?)*\)/ui,"")
				})
			})
	}
}