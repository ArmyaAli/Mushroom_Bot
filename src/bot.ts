import Discord, { GuildChannel, TextChannel } from "discord.js";
import path from "path";
import config, { Command, readCommandsRecursive } from "./botconfig";

const client = new Discord.Client();

const commands: Discord.Collection<string, Command> = new Discord.Collection();

const commandContext = path.join(__dirname, "commands");
let commandFiles: string[] = [];

client.once("ready", async () => {
  readCommandsRecursive(commandContext, commandFiles);
  commandFiles = commandFiles.filter((fileName) => fileName.endsWith(".ts"));
  for (const filePath of commandFiles) {
    const command = require(filePath);
    commands.set(command.name, command);
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on("message", async (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift()!.toLowerCase();

  if (!commands.get(command)) {
    message.channel.send("That is an invalid command");
    return;
  }

  commands.get(command)!.execute(client, message, args);
});

// sends a welcome message if a user joins
client.on("guildMemberAdd", (member) => {
  const channel = member.guild.channels.cache.find(
    (ch) => ch.id == `143853351103102976`
  );
  if (!channel) return;
  (channel as TextChannel).send(
    "Welcome to the Mushroom Cave" + " " + member.displayName + "!"
  );
});

client.login(config.token);
