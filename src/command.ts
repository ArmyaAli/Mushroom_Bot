import { BitFieldResolvable, Client, Message, PermissionString } from "discord.js";

export interface Command {
    name: string
    description: string
    requiredPermissions: BitFieldResolvable<PermissionString>
    roleExclusions?: string[],
    execute(client: Client, message: Message, args?: string[]): void
}