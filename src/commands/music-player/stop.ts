import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { EventEmitter } from 'events';
import { Command } from "../../command";

const command: Command = {
  name: "stop",
  description: "stops the currently playing song",
  requiredPermissions: [],
  async execute(client: Client, message: Message, args: string[]) {
    const query = args.join(" ");
    try {
      const em = new EventEmitter();
      em.emit('STOP', 'stop event has been emitted');
    } catch (error) {
      console.log(error);
    }
  },
};

export = command;
