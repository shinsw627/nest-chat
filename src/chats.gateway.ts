import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { userInfo } from 'os';
import { Socket } from 'socket.io';
import { Chatting } from './chats/models/chattings.model';
import { Socket as SocketModel } from './chats/models/sockets.model';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {
    this.logger.log('constructor');
  }

  private logger = new Logger('chat');

  afterInit(server: any) {
    this.logger.log('chat init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(
      `소켓 연결됨 | socket.id : ${socket.id}, nsp.name : ${socket.nsp.name}`,
    );
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user = await this.socketModel.findOne({ id: socket.id });
    if (user) {
      socket.broadcast.emit('user_disconnected', user.username);
      await user.delete();
    }
    this.logger.log(
      `소켓 연결 해제 | socket.id : ${socket.id}, nsp.name: ${socket.nsp.name}`,
    );
  }

  @SubscribeMessage('new_user')
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const exist = await this.socketModel.exists({ username });
    if (exist) {
      username = `${username} #${Math.floor(Math.random() * 100)}`;
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    } else {
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    }

    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('disconnecting')
  handleLeftUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {}

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const socketObject = await this.socketModel.findOne({ id: socket.id });

    await this.chattingModel.create({
      user: socketObject,
      chat: chat,
    });
    socket.broadcast.emit('new_chat', {
      chat,
      username: socketObject.username,
    });
  }
}
