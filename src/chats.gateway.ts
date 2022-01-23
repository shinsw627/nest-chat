import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  afterInit(server: any) {
    this.logger.log('chat init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(
      `소켓 연결됨 | socket.id : ${socket.id}, nsp.name : ${socket.nsp.name}`,
    );
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(
      `소켓 연결 해제 | socket.id : ${socket.id}, nsp.name: ${socket.nsp.name}`,
    );
  }

  @SubscribeMessage('new_user')
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('disconnecting')
  handleLeftUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.emit('user_disconnected', username);
    return username;
  }

  @SubscribeMessage('submit_chat')
  handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.emit('new_chat', {
      chat,
      username: socket.id,
    });
  }
}
