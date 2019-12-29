import { Injectable } from '@nestjs/common';
import { isArray } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagingService {

  static readonly SUBJECT__TECHNICAL: string = 'Technical';
  static readonly SUBJECT__NOTICES: string = 'Notices';

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

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

  /**
   * Subscribes a client to a subject
   * @param client
   * @param subject
   */
  async subscribeToSubject(client: IClientMessaging, subject: string) {
    this.messagingUsers.forEach((e) => {
      if (e.client === client) {
        e.subjects.push(subject);
      }
    });
    await this.sendPendingMessages();
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

  async registerMessage(to: number[]|'*', subject: string, message: any) {
    await this.messageRepository.insert({
      message: JSON.stringify(message),
      subject,
      to: JSON.stringify(to),
    });
  }

  async sendPendingMessages() {
    const messages: Message[] = await this.messageRepository.find({sent: false});
    const sentIds: number[] = messages.map((pendingMessage: Message) => {
      const to: number[]|'*' = JSON.parse(pendingMessage.to);
      const subject: string = pendingMessage.subject;
      const message: any = JSON.parse(pendingMessage.message);
      return this.sendMessageToClient(to, subject, message) ? pendingMessage.message_id : -1;
    }).filter((id) => id > 0);
    if (sentIds.length > 0) {
      await this.messageRepository.update(sentIds, {sent: true});
    }
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
        messagingUser.client.send(JSON.stringify({
          to,
          subject,
          message,
        }));
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
