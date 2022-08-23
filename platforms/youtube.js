const ytdl = require("ytdl-core");

module.exports={
	name:"youtube",
	execute(context){
		ytdl.getInfo(context.update.message.text)
			.then(async info=>{
				if(info.videoDetails.lengthSeconds>1800)return context.reply("Wrong youtube video.")//мб стоит добавить проверку на категорию, но хз. Не все песни имеют категорию "музыка"
				await context.replyWithAudio({
					source:ytdl(context.update.message.text, { filter: 'audioonly' })
				},{
					performer: info.player_response.videoDetails.author.replace(/ - Topic$/,""),
					title: info.player_response.videoDetails.title.replace(/ ?\((\w)*.? ? (\w?[А-Яа-я]?,? ?)*\)/ui,"")
				})
			})
	}
}