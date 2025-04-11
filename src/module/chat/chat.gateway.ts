import { ConnectedSocket,WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Socket,Server } from 'socket.io';
import { Req } from '@nestjs/common';
import { createSocketAuthMiddleware } from './middleware/createsocket.io.middleware';
import { TokenService } from '../auth/token-verify.service';

import { MemberService } from '../member/member.service';



@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly chatService: ChatService,
    private readonly tokenService: TokenService,
    private readonly memberService: MemberService,
  ) {}
  @WebSocketServer() server: Server;
  afterInit(server: Server) {
    const authMiddleware = createSocketAuthMiddleware(
      this.tokenService,
      this.memberService,
    );
    server.use(authMiddleware);
  }
  // handle connection
  async handleConnection(client: Socket) {
    return this.chatService.handleConnection(client);
  }

  // using second method emit which mean to send message
  @SubscribeMessage('createChat')
  async create(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
    server: Server,
  ) {
     const { user, workspaceIdInfo } = client.data;
    //  this.server.to(`workspace-${workspaceIdInfo}`).emit('receive-message', {
    //    sender: user.sub
    //  });

  return  this.chatService.handleSendMessage(createChatDto, client, this.server);
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket) {
    return this.chatService.handleTyping(client);
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
