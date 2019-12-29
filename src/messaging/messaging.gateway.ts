import {
  WebSocketGateway,
  SubscribeMessage,
  WsException,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { MessagingService } from '../messaging/messaging.service';
import { AuthService } from '../@shared/auth-shared/auth.service';

@WebSocketGateway()
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly authService: AuthService,
    private readonly messagingService: MessagingService,
  ) {}

  async handleConnection(client: any) {
    // Don't do anyting
  }

  async handleDisconnect(client: any) {
    this.messagingService.removeClient(client);
  }

  @SubscribeMessage('login')
  async login(client: any, data: any) {
    const user: number|null = await this.authService.login(data.jwt);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }

    this.messagingService.addUser({
      client,
      user,
      subjects: [
        MessagingService.SUBJECT__NOTICES,
        MessagingService.SUBJECT__TECHNICAL,
      ],
    });

    client.send(JSON.stringify({
      logged: user,
    }));
  }

  @SubscribeMessage('subscribeToSubject')
  async subscribeToSubject(client: any, data: any) {
    await this.messagingService.subscribeToSubject(
      client,
      data.subject,
    );
    client.send(JSON.stringify({
      subscribed: data.subject,
    }));
  }

  @SubscribeMessage('unsubscribeToSubject')
  async unsubscribeToSubject(client: any, data: any) {
    this.messagingService.unsubscribeToSubject(
      client,
      data.subject,
    );
    client.send(JSON.stringify({
      unsubscribed: data.subject,
    }));
  }

}
