const fs = require("node:fs");
const path = require("node:path");
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const { getLyrics } = require("genius-lyrics-api");
const { Collection } = require("@discordjs/collection");
const { test_tgtk, token_tg, genius_tk } = require("./config.json");

const platformsPath = path.join(__dirname, 'platforms'),
  platformsFiles = fs.readdirSync(platformsPath).filter(file => file.endsWith('.js')),
  bot = new Telegraf(process.argv[2] === "test" ? test_tgtk : token_tg);
bot.platforms = new Collection();

for(const file of platformsFiles){
	const file_path = path.join(platformsPath, file);
	const platforms = require(file_path);
	bot.platforms.set(platforms.name, platforms)
}

const megaRegex = new RegExp(bot.platforms.map(p => p.fullRegex.source).join("|"),"gmi");

bot.start(ctx => {
  ctx.reply("Send me url on song on YouTube or SoundCloud and i send you audio file!\nSend me audio file and i try to find lyrics!");
});
bot.url(megaRegex, async (ctx) =>{
  let links = ctx.update.message.text.match(megaRegex);

  if (links.length === 0) {
		return ctx.reply("I think this isn't souncloud or youtube url. Try again ;)")
	}

  for (let i = 0; i < links.length; i++) {
    let platform = bot.platforms.find(p => links[i].match(p.regex));

    if (!platform) continue;

    await platform.execute(ctx, links[i]);
  }
})
bot.on(message("audio"), async (ctx) => {
  if (!ctx.message.audio.performer || !ctx.message.audio.title)
    return await ctx.reply("Wrong audio file");

  let lyrics = await getLyrics({
    apiKey: genius_tk,
    artist: ctx.message.audio.performer.replace(/ ?\((\w)*.? ? (\w?[А-Яа-я]?)*\)/ui, ""),
    title: ctx.message.audio.title.replace(/ ?\((\w)*.? ? (\w?[А-Яа-я]?)*\)/ui, ""),
    optimizeQuery: true
  });

  await ctx.reply(lyrics.replace(/\[(«?[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}]*-*?\s*?\d*?»?)*?\]/ug, "").slice(0, 4093));
})
bot.launch(() => { console.log(`[] ${bot.botInfo.first_name}`); });
