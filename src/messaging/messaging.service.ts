import { Injectable } from '@nestjs/common';
import { isArray } from 'util';

@Injectable()
export class MessagingService {

  static readonly SUBJECT__TECHNICAL: string = 'Technical';
  static readonly SUBJECT__NOTICES: string = 'Notices';

  /**
   * The registered users
   */
  protected messagingUsers: IMessagingUser[] = [];

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

  subscribeToSubject(client: IClientMessaging, subject: string) {
    this.messagingUsers.forEach((e) => {
      if (e.client === client) {
        e.subjects.push(subject);
      }
    });
  }

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
  sendMessage(to: number[]|'*', subject: string|'*', message: any) {
    let hadSentMessage: boolean = false;
    const users: number[] = isArray(to) ? to : this.getAllUsers();
    this.messagingUsers.forEach((messagingUser: IMessagingUser) => {
      if (
        users.includes(messagingUser.user) &&
        (
          subject === '*' ||
          messagingUser.subjects.includes(subject)
        )
      ) {
        messagingUser.client.send(JSON.stringify({
          to,
          subject,
          message,
        }));
        hadSentMessage = true;
      }
    });
    return hadSentMessage;
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
