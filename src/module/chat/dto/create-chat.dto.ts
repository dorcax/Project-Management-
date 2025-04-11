import { MessageType } from "@prisma/client"



export class CreateChatDto {
    type:MessageType
    content:string
}
