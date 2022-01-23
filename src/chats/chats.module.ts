import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatting, ChattingSchema } from './models/chattings.model';
import { Socket as SocketModel, SocketSchema } from './models/sockets.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatting.name, schema: ChattingSchema },
      { name: SocketModel.name, schema: SocketSchema },
    ]),
  ],
})
export class ChatsModule {}
