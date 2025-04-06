import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { WebSocketServer } from '@nestjs/websockets';
import {Server} from "socket.io"
@Injectable()
export class ChatService {
 @WebSocketServer() server :Server
  // create(createChatDto: CreateChatDto) {
  //   console.log('this action adds a new chat');
  //   return 'This action adds a new chat';
  // }


  // socket.emit send message to one single client while server.emit or io.emit()send message to all clients
  create(client,message) {
    client.emit("reply","this is a reply for dorcas ibrahim")
    
    console.log(message);
    return 'This action adds a new chat';
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
