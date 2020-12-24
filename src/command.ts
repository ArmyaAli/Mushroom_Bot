import { BitFieldResolvable, Client, Message, PermissionString } from "discord.js";

export interface Command {
    name: string
    description: string
    requiredPermissions: BitFieldResolvable<PermissionString>
    execute(client: Client, message: Message, args?: string[]): void
}