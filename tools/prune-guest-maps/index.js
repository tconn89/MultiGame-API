// Lamp
console.log(`Started @ ${Date()}`);
(async function(){
	var {MongoClient} = require("mongodb");
	var client = await MongoClient.connect("mongodb://localhost:27017");
	var db = client.db("passport_local_mongoose_express4");
	var collection = db.collection("binaryfiles");
	var cursor = collection.find({
		guest: true,
		created_at: {$lt: new Date((new Date()) - 1000*60*60*24*7)}
	});

	var Discord = require("discord.js");
	var webhook = new Discord.WebhookClient("417052022496559104","cLb7UXBUhO0ZcvfGILa83exjxSwdABZE1MYFuf7NBb1SRKbaxpx83M0iHObaIKL0Ku20");
	var fs = require("fs");
	var zlib = require("zlib");

	while (await cursor.hasNext()) {
		let document = await cursor.next();
		let file_name = document.path.split("/").pop();
		let exists = fs.existsSync(document.path);
		let attachment = exists ? new Discord.Attachment(fs.createReadStream(document.path).pipe(zlib.createGzip()), file_name + ".gz") : undefined;
		await webhook.send(JSON.stringify(document), {
			file: attachment,
			split: {char:"", maxLength:2000}
		});
		await collection.deleteOne(document);
		if (exists) fs.unlinkSync(document.path);
		console.log("Deleted", document.map_name);
	}
	
	console.log('Done');
	client.close();
	process.exit();

})().catch(error => {
	console.error(error.stack);
	process.exit(1);
});
