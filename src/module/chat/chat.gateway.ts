import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Socket,Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection,OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}
@WebSocketServer() server :Server
  // listening to event and specify the pattern of thhe event wew ill listening
  // socket.on
  // first method using messageBody()
  // @SubscribeMessage('createChat')
  // create(@MessageBody() createChatDto: CreateChatDto) {
  //   return this.chatService.create(createChatDto);
  // }

  // handle connection 
  handleConnection(client: Socket, ...args: any[]) {
    console.log("connected user",client.id)
       this.server.emit('user-joined', {
        message:`new user joined the chat ${client.id}`
       });
  }

  handleDisconnect(client: Socket) {
    console.log("disconnected user ",client.id)
      this.server.emit('user-left', {
        message: `user left the chat ${client.id}`,
      });
  }


  // using second method emit which mean to send message 
  @SubscribeMessage('createChat')
  create(client:Socket,message:any) {
    client.broadcast.emit("you have joine dthe chat")
    this.server.emit('reply', 'this is broadcasting ');
    return this.chatService.create(client,message);
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
