import { Injectable } from '@nestjs/common';
import { isArray } from 'util';
import { LogsService } from '@thefirstspine/logs-nest';

@Injectable()
export class MessagingService {

  /**
   * The registered users
   */
  protected messagingUsers: IMessagingUser[] = [];

  constructor(
    private readonly logService: LogsService,
  ) {}

  /**
   * Add a user the the messaging service
   * @param messagingUser
   */
  addUser(messagingUser: IMessagingUser) {
    this.removeClient(messagingUser.client); // remove potential client first
    this.messagingUsers.push(messagingUser);
  }

  /**
   * Remove a user by its client reference
   * @param client
   */
  removeClient(client: IClientMessaging) {
    this.messagingUsers = this.messagingUsers.filter(e => e.client !== client);
  }

  /**
   * Remove a user by its user ID
   * @param user
   */
  removeUser(user: number) {
    this.messagingUsers = this.messagingUsers.filter(e => e.user !== user);
  }

  /**
   * Subscribes a client to a subject
   * @param client
   * @param subject
   */
  subscribeToSubject(client: IClientMessaging, subject: string) {
    this.messagingUsers.forEach((e) => {
      if (e.client === client) {
        if (!e.subjects.includes(subject)) {
          e.subjects.push(subject);
        }
      }
    });
  }

  /**
   * Removes a subscription from a subject
   * @param client
   * @param subject
   */
  unsubscribeToSubject(client: IClientMessaging, subject: string) {
    this.messagingUsers.forEach((e) => {
      if (e.client === client) {
        e.subjects = e.subjects.filter(s => s !== subject);
      }
    });
  }

  /**
   * Send a message to some users
   * @param to
   * @param message
   */
  sendMessageToClient(to: number[]|'*', subject: string, message: any) {
    let hadSentMessage: boolean = false;
    const users: number[] = isArray(to) ? to : this.getAllUsers();
    this.messagingUsers.forEach((messagingUser: IMessagingUser) => {
      if (
        users.includes(messagingUser.user) &&
        messagingUser.subjects.includes(subject)
      ) {
        const messageToSend = {
          to,
          subject,
          message,
        };
        this.logService.info('Send message', messageToSend);
        messagingUser.client.send(JSON.stringify(messageToSend));
        hadSentMessage = true;
      }
    });
    return to === '*' || hadSentMessage;
  }

  /**
   * Get all users
   */
  getAllUsers(): number[] {
    return this.messagingUsers.map(e => e.user);
  }

}

export interface IClientMessaging {
  send(message: string): void;
}

export interface IMessagingUser {
  client: IClientMessaging;
  user: number;
  subjects: string[];
}
