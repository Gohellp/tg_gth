const path = require('node:path'),
	fs = require('node:fs'),
	platforms_path = path.join(__dirname, 'platforms'),
	platformsFiles = fs.readdirSync(platforms_path).filter(file => file.endsWith('.js')),
	{ getLyrics } = require("genius-lyrics-api"),
	{Collection} = require("@discordjs/collection"),
	{token_tg} = require("./config.json"),
	{Telegraf} = require ("telegraf"),
	bot = new Telegraf(token_tg);
bot.platforms = new Collection();

for(const file of platformsFiles){
	const file_path = path.join(platforms_path, file);
	const platforms = require(file_path);
	bot.platforms.set(platforms.name, platforms)
}

bot.start(ctx=>ctx.reply("I'm the part of project_gth\n\nSend me url on song on youtube and i send you audio file!\nSend me audio file and i try to find lyrics!"))
bot.url(ctx=>{
	if(ctx.update.message.text.match(/.?youtu.?be(.com)?\//))
		return bot.platforms.get("youtube").execute(ctx)
	else if(ctx.update.message.text.match(/soundcloud.?[com]?/))
		return  bot.platforms.get("soundcloud").execute(ctx)
	else return ctx.reply("This's not youtube url");
})
bot.on('text',ctx=>{
	if(ctx.update.message.chat.id===1887223327){
		const cmd = ctx.update.message.text.split(" ")[0],
			args = ctx.update.message.text.split(" ").slice(1)
		switch(cmd){
			case"/test":
				console.log(ctx.update.message)
				break
			case"/send":
				if(args[1]||!isNaN(args[0]))
					ctx.telegram.sendMessage(args[0]?args[0]:"-1001464640870", args.slice(1).join(" "))
				if(ctx.update.message.reply_to_message?ctx.update.message.reply_to_message.audio:0)
					ctx.telegram.sendAudio(args[0]?args[0]:"-1001464640870", ctx.update.message.reply_to_message.audio.file_id)
				break
		}
	}
})
bot.on("audio",ctx=>{
	if(!ctx.update.message.audio.performer)return ctx.reply("Wrong audio file")
	getLyrics({
		apiKey:"zNKzOgm4D7WbbpuCj0-1K3deuhNWyMuZXHlNt-fJJOaKPuY6czgAXAqDgs7R75SC",
		artist:ctx.update.message.audio.performer.replace(/ ?\((\w)*.? ? (\w?[А-Яа-я]?)*\)/ui,""),
		title:ctx.update.message.audio.title.replace(/ ?\((\w)*.? ? (\w?[А-Яа-я]?)*\)/ui,""),
		optimizeQuery: true
	}).then(lyrics=>{
		if(!lyrics||lyrics.startsWith("What parallel courses did Bloom and Stephen follow returning?")){
			return ctx.reply("I can't find lyrics for this song on genius.com or file has wrong artist/title")
		}
		ctx.reply(lyrics.replace(/\[(\w*|[А-Яа-я]*) ?-?(\w*|[А-Яа-я]*:?)?\d?( «?"?(([А-Яа-я])* *)*»? *?(\w*|[А-Яа-я]*.?)*?"?)?\]\n\n?/ug,"").slice(0,4093))
	})
})
bot.launch().then(()=>{
		console.log(`[] ${bot.botInfo.first_name}`)
	})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))