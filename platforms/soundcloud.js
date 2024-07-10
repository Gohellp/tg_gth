const {sc_client_id} = require('../config.json');
const scdl = require("soundcloud-downloader").create({
  clientID: sc_client_id
});


async function sendTrack(ctx, info) {
  let stream = await scdl.download(info.permalink_url);
  let _ = await ctx.sendAudio(
    {
      source: stream
    },
    {
      performer: info.publisher_metadata.artist,
      title: info.title,
      thumbnail: { URL: info.artwork_url }
    }
  );
}

module.exports={
	name:"soundcloud",
	regex: /soundcloud/,
  fullRegex: /(?:https?\:\/\/)(?:soundcloud\.com)\/(?:[^\s]+)\/(?:[^\s]+)/gmi,
  matchStrings: ["soundcloud"],
	async execute(ctx, link){
  	if(scdl.isPlaylistURL(link)) {
      await ctx.reply("I can't work with playlists");
      return;
    } else {
      let info = await scdl.getInfo(link);
      await sendTrack(ctx, info);
    }
	}
}
