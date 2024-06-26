const path = require('node:path'),
	fs = require('node:fs'),
	platforms_path = path.join(__dirname, 'platforms'),
	platformsFiles = fs.readdirSync(platforms_path).filter(file => file.endsWith('.js')),
	{ getLyrics } = require("genius-lyrics-api"),
	{Collection} = require("@discordjs/collection"),
	{token_tg, test_tgtk} = require("./config.json"),
	{Telegraf} = require ("telegraf"),
	bot = new Telegraf(process.argv[2]==="test"?test_tgtk:token_tg);
bot.platforms = new Collection();

for(const file of platformsFiles){
	const file_path = path.join(platforms_path, file);
	const platforms = require(file_path);
	bot.platforms.set(platforms.name, platforms)
}

bot.start(ctx=>ctx.reply("I'm the part of project_gth\n\nSend me url on song on youtube and i send you audio file!\nSend me audio file and i try to find lyrics!"))
bot.url(ctx => {
	let Links = ctx.update.message.text.match(/(?:http(?:s)?:\/\/)(?:(?:(?:www.|music.)?youtu.?be(?:.com)?)|(?:soundcloud.?(?:com)?)).*$/gmi)

	if (Links.length === 0) {
		return ctx.reply("I think this isn't souncloud or youtube url. Try again ;)")
	}
	for (let i = 0; i < Links.length; i++) {
		if (Links[i].match(/.?youtu.?be(.com)?\//))
			bot.platforms.get("youtube").execute(ctx,Links[i])
		else if (Links[i].match(/soundcloud.?[com]?/))
			bot.platforms.get("soundcloud").execute(ctx,Links[i])
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
		ctx.reply(lyrics?lyrics.replace(/\[(«?[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}]*-*?\s*?\d*?»?)*?\]/ug, "").slice(0, 4093):"Sorry this song doesnt have lyrics mb.")
	})
})
bot.on("channel_post",ctx=>{
	if(!ctx.update.channel_post.audio)return;
	getLyrics({
		apiKey:"zNKzOgm4D7WbbpuCj0-1K3deuhNWyMuZXHlNt-fJJOaKPuY6czgAXAqDgs7R75SC",
		artist:ctx.update.channel_post.audio.performer.replace(/ ?\((\w)*.? ? (\w?[А-Яа-я]?)*\)/ui,""),
		title:ctx.update.channel_post.audio.title.replace(/ ?\((\w)*.? ? (\w?[А-Яа-я]?)*\)/ui,""),
		optimizeQuery: true
	}).then(lyrics=>{
		ctx.reply(lyrics.replace(/\[(«?[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}]*-*?\s*?\d*?»?)*?\]/ug,"").slice(0,4093))
	})
})
bot.on('text',ctx=>{
	if(ctx.update.message.chat.id===1887223327){
		const cmd = ctx.update.message.text.split(" ")[0],
			args = ctx.update.message.text.split(" ").slice(1)
		switch(cmd){
			case"/send":
				ctx.copyMessage(args[0]?args[0]:-1001464640870,{
					message_id:ctx.update.message.reply_to_message.message_id,
					from_chat_id:ctx.update.message.reply_to_message.chat.id
				})
				break
		}
	}
})
bot.launch().then(()=>{
	console.log(`[] ${bot.botInfo.first_name}`)
})

