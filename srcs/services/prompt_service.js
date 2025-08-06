const fs = require("node:fs");
const path = require("node:path");

function randomPrompt(guildId) {
	const filepath = path.join(process.cwd(), `./guilds/${guildId}/_prompts_${guildId}.json`);
	const Rdata = fs.readFileSync(filepath);
	const jsonprompt = JSON.parse(Rdata);

	return jsonprompt[Math.floor(Math.random() * jsonprompt.length)];
}

function getPromptByIndex(index, guild) {
	const filepath = path.join(process.cwd(), `./guilds/${guild.id}/_prompts_${guild.id}.json`);
	const Rdata = fs.readFileSync(filepath);
	const jsonprompt = JSON.parse(Rdata);
	
	if (index < 1 || index > jsonprompt.length) {
		throw new Error("Index invalide");
	}

	return jsonprompt[index - 1];
}

function addit(tag, dpprompt, guild) {
// Read content of Json
	const filepath = path.join(process.cwd(), `./guilds/${guild.id}/_prompts_${guild.id}.json`);
	const Rdata = fs.readFileSync(filepath);
	const jsonprompt = JSON.parse(Rdata);

// Modify the JavaScript object by adding new data
	jsonprompt.push({
		num: jsonprompt.length + 1,
		tag: tag,
		Pprompt: dpprompt,
	});

// Convert the JavaScript object back into a JSON string
	const jsonString = JSON.stringify(jsonprompt, null, 4);
	fs.writeFileSync(filepath, jsonString, "utf-8", (err) => {
	if (err) throw err;
	console.log("Error while writing the new prompt");
	});
}

function change_it(Pnum, dpprompt, guild) {
	const filepath = path.join(process.cwd(), `./guilds/${guild.id}/_prompts_${guild.id}.json`);
	const Rdata = fs.readFileSync(filepath);
	const jsonprompt = JSON.parse(Rdata);
	const index = Pnum - 1;

	if (index >= 0 && index < jsonprompt.length) {
		jsonprompt[index].Pprompt = dpprompt;

		const jsonString = JSON.stringify(jsonprompt, null, 4);
		fs.writeFileSync(filepath, jsonString, "utf-8", (err) => {
			if (err) throw err;
			console.log("Prompt modified with success");
		});
	} else console.log("Error while trying to modify the prompt");
}

module.exports = {
	randomPrompt,
	getPromptByIndex,
	addit,
	change_it
};