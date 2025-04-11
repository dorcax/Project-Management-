// import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { ChatService } from '../chat/chat.service';
// import { CreateChatDto } from '../chat/dto/create-chat.dto';
// import { UpdateChatDto } from '../chat/dto/update-chat.dto';
// import { Socket,Server } from 'socket.io';

// @WebSocketGateway()
// export class ChatGateway implements OnGatewayConnection,OnGatewayDisconnect {
//   constructor(private readonly chatService: ChatService) {}
// @WebSocketServer() server :Server
//   // listening to event and specify the pattern of thhe event wew ill listening
//   // socket.on
//   // first method using messageBody()
//   // @SubscribeMessage('createChat')
//   // create(@MessageBody() createChatDto: CreateChatDto) {
//   //   return this.chatService.create(createChatDto);
//   // }

//   // handle connection 
//   handleConnection(client: Socket, ...args: any[]) {
//     console.log("connected user",client.id)
//        this.server.emit('user-joined', {
//         message:`new user joined the chat ${client.id}`
//        });
//   }

//   handleDisconnect(client: Socket) {
//     console.log("disconnected user ",client.id)
//       this.server.emit('user-left', {
//         message: `user left the chat ${client.id}`,
//       });
//   }


//   // using second method emit which mean to send message 
//   @SubscribeMessage('createChat')
//   create(client:Socket,message:any) {
//     client.broadcast.emit("you have joine dthe chat")
//     this.server.emit('reply', 'this is broadcasting ');
//     return this.chatService.create(client,message);
//   }

//   @SubscribeMessage('findAllChat')
//   findAll() {
//     return this.chatService.findAll();
//   }

//   @SubscribeMessage('findOneChat')
//   findOne(@MessageBody() id: number) {
//     return this.chatService.findOne(id);
//   }

//   @SubscribeMessage('updateChat')
//   update(@MessageBody() updateChatDto: UpdateChatDto) {
//     return this.chatService.update(updateChatDto.id, updateChatDto);
//   }

//   @SubscribeMessage('removeChat')
//   remove(@MessageBody() id: number) {
//     return this.chatService.remove(id);
//   }
// }

// part2
// import { Injectable } from '@nestjs/common';
// import { CreateChatDto } from './dto/create-chat.dto';
// import { UpdateChatDto } from './dto/update-chat.dto';
// import { WebSocketServer } from '@nestjs/websockets';
// import {Server,Socket} from "socket.io"

// import { MemberService } from '../member/member.service';
// import { TokenService } from '../auth/token-verify.service';
// import { PrismaService } from 'src/prisma.services';

// @Injectable()
// export class ChatService {
//    constructor(
//     private readonly prisma:PrismaService,
//       private readonly tokenService:TokenService,
//       private readonly memberService:MemberService
//     ) {}

//  async handleConnection(client){
//    // const token =client.handshake.auth.token
//    const token =
//      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOGY2MGQ0MC05ZmMxLTRlMzUtYWZkZC1jNzdjNzY0MDk4NGIiLCJyb2xlcyI6WyJNRU1CRVIiLCJPV05FUiJdLCJyb2xlUGVybWlzc2lvbnMiOnsiTUVNQkVSIjpbIlZJRVdfT05MWSIsIkNSRUFURV9UQVNLIiwiRURJVF9UQVNLIl0sIk9XTkVSIjpbIkFERF9NRU1CRVIiLCJDSEFOR0VfTUVNQkVSX1JPTEUiLCJSRU1PVkVfTUVNQkVSIiwiQ1JFQVRFX1dPUktTUEFDRSIsIkVESVRfV09SS1NQQUNFIiwiREVMRVRFX1dPUktTUEFDRSIsIk1BTkFHRV9XT1JLU1BBQ0VfU0VUVElOR1MiLCJDUkVBVEVfUFJPSkVDVCIsIkVESVRfUFJPSkVDVCIsIkRFTEVURV9QUk9KRUNUIiwiQ1JFQVRFX1RBU0siLCJFRElUX1RBU0siLCJERUxFVEVfVEFTSyJdfSwiaWF0IjoxNzQzOTg2ODkwLCJleHAiOjE3NDQxNTk2OTB9.jlo8VNiLRNrsciCP4LURuvP9WdH8RiBvQwK9Ke92RLo';
//    // const workspaceIdInfo =client.handshake.auth.workspaceId
//    const workspaceIdInfo = '348c2b45-0a6f-4af0-b632-db98fa96c65e';
//    // verify the token
//    const user = await this.tokenService.verifyToken(token);
//    if (!user) return client.disconnect();

//    // verify membership
//    const isMember = await this.memberService.findOne(user.sub, workspaceIdInfo);
//    if (!isMember) return client.disconnect();

//    //  save the token and workspaceId to avoid reverifying every time a client send message
//    client.data.user = user;
//    client.data.workspaceIdInfo = workspaceIdInfo;
//    client.join(`workspace=${workspaceIdInfo}`);
//    console.log('client data after connection:', client.data); //

//    console.log('client', client.data.workspaceIdInfo);
   
//  }

  // socket.emit send message to one single client while server.emit or io.emit()send message to all clients


//   async handleSendMessage(createChatDto: CreateChatDto, client, server: Server) {
    // const { content, type } = createChatDto;
    // console.log(createChatDto)
    // // Ensure client.data is set
    //  console.log('client data in handleSendMessage:', client);
     // console.log("uuuuujj",client.data)
     // const user = client.data.user;
     // const workspaceId = client.data.workspaceIdInfo

    // // Check if client.data is available
    // if (!user || !workspaceId) {
    //   console.error('User or workspaceId is missing');
      
    //   // client.emit('error', 'You must be authenticated and joined to a workspace');
    //   // return;
    // }

    // Log the user and workspace to debug
    // console.log("SendMessage - User:", user, "WorkspaceId:", workspaceId);

    // Save the message to the database
    // const message = await this.prisma.chatMessages.create({
    //   data: {
    //     content,
    //     type,
    //     senderId: user.id, // Assuming 'user' has an 'id' field
    //     workspaceId: workspaceId, // Assuming 'workspaceId' is set in client.data
    //   },
    // });

    // Emit the message to the correct room
    // server.to(`workspace-${workspaceId}`).emit('receive-message', {
    //   sender: user.name, // Assuming 'user' has a 'name' field
    //   content,
    //   type,
    //   timestamp: message.createdAt, // Assuming you want to send the timestamp
    // });

    // console.log("Message sent to workspace", workspaceId);
//   }


//   async handleTyping(client){
//     const{workspaceIdInfo,user} =client.data
//     client.broadcast.to(`workspace -${workspaceIdInfo}`).emit("typing",{
//       user:user.name
//     })

//   }
//   findAll() {
//     return `This action returns all chat`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} chat`;
//   }

//   update(id: number, updateChatDto: UpdateChatDto) {
//     return `This action updates a #${id} chat`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} chat`;
//   }
// }
