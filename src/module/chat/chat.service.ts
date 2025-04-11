import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { WebSocketServer } from '@nestjs/websockets';
import {Server,Socket} from "socket.io"
import { PrismaService } from 'src/prisma.services';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }
  async handleConnection(client) {

    const { user } = client.data;
    console.log(client.data)

    // this.server.emit('user-status', {  status: 'online' });
    console.log('client data after connection:', client.data); //

    console.log('client', client.data.workspaceIdInfo);
  }

  async handleDisconnection(client) {
    const { user } = client.data;
    this.server.emit('user-status', { user, status: 'offline' });
  }

  // socket.emit send message to one single client while server.emit or io.emit()send message to all clients

  async handleSendMessage(
    createChatDto: CreateChatDto,
    client,
    server: Server,
  ) {
    const { content, type } = createChatDto;

    // // Ensure client.data is set
    console.log('client data in handleSendMessage:', client);

    const { user, workspaceIdInfo } = client.data;

    // Save the message to the database
    const message = await this.prisma.chatMessages.create({
      data: {
        content,
        type,
        senderId: client.data.user.sub,
        workspaceId: client.data.workspaceIdInfo,
      },
    });

    // Emit the message to the correct room
    server.to(`workspace-${workspaceIdInfo}`).emit('receive-message', {
      sender: user.sub,
      content,
      type,
      timestamp: message.createdAt,
    });

    console.log('Message sent to workspace', workspaceIdInfo);
  }

  async handleTyping(client) {
    const { workspaceIdInfo, user } = client.data;
    client.broadcast.to(`workspace -${workspaceIdInfo}`).emit('typing', {
      user: user.name,
    });
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
