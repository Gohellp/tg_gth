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
			case"/send":
				ctx.copyMessage(args[0]?args[0]:-1001464640870,{
					message_id:ctx.update.message.reply_to_message.message_id,
					from_chat_id:ctx.update.message.reply_to_message.chat.id
				})
				break
		}
	}
})
bot.command("edit", ctx=>{
	console.log("Fuck")
	if(!ctx.update.message.reply_to_message)return ctx.reply("ERROR\nYou forgor reply to audio!!!")
	//bot.editMessageMedia()
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
bot.launch().then(()=>{
		console.log(`[] ${bot.botInfo.first_name}`)
	})
bot.on("channel_post",ctx=>{
	if(!ctx.update.channel_post.audio)return;
	getLyrics({
		apiKey:"zNKzOgm4D7WbbpuCj0-1K3deuhNWyMuZXHlNt-fJJOaKPuY6czgAXAqDgs7R75SC",
		artist:ctx.update.channel_post.audio.performer.replace(/ ?\((\w)*.? ? (\w?[А-Яа-я]?)*\)/ui,""),
		title:ctx.update.channel_post.audio.title.replace(/ ?\((\w)*.? ? (\w?[А-Яа-я]?)*\)/ui,""),
		optimizeQuery: true
	}).then(lyrics=>{
		if(!lyrics||lyrics.startsWith("What parallel courses did Bloom and Stephen follow returning?")){
			return;
		}
		ctx.reply(lyrics.replace(/\[(«?[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}]*-*?\s*?\d*?»?)*?\]/ug,"").slice(0,4093))
	})
})

