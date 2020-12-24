import { Client, Message } from "discord.js";

export interface Command {
    name: string
    description: string
    requiredPermissions: string[]
    execute(client: Client, message: Message, args?: string[]): void
}