const ytdl = require("@distube/ytdl-core");
const ytpl = require("@distube/ytpl");


async function sendTrack(ctx, info) {
  let _ = await ctx.replyWithAudio(
    {
      source: ytdl(info.video_url, { filter: 'audioonly' })
    },
    {
      performer: info.author.name.replace(/ - Topic$/, ""),
      title: info.title.replace(/ ?\((\w)*.? ? (\w?[А-Яа-я]?,? ?)*\)/i, ""),
      thumbnail: { url: info.thumbnails[0].url }
    }
  );
};

module.exports={
	name:"youtube",
	regex: /(?:youtu\.?be)(?:\.com)?/,
	fullRegex: /(?:https?\:\/\/)(?:(?:music)?\.?(?:youtube)(?:\.com)\/(?:watch\?v)?(?:playlist\?list)?\=|(?:youtu\.be)\/(?:watch\?v\=)?)(?:[^\s]+)/gmi,
	matchStrings: ["youtube.com", "youtu.be"],
	async execute(ctx, link) {
		if(link.match(/\/playlist/)) {
      let playlist = await ytpl(link);

      let thickVideo = playlist.items.find(i => {
        Number.parseInt(i.duration) > 1800
      });

      if (thickVideo !== undefined) {
        await ctx.reply(`Video ${thickVideo.url_simple} SOOOOO THICK!\nTry found out the __song__`)
        return;
      }

      playlist.items.forEach(async (i) => {
        let info = (await ytdl.getInfo(i.url)).videoDetails;

        await sendTrack(ctx, info);
      });
		} else {
      let info = (await ytdl.getInfo(link)).videoDetails;

      if (Number.parseInt(info.lengthSeconds) > 1800) {
        await ctx.reply("Video SOOOOO THICK!\nTry found out the __song__")
        return;
      }

      await sendTrack(ctx, info);
		}

	}
}
