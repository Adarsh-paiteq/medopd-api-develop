import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Notification {
  id: string;
  senderId: string | null;
  receiverId: string;
  body: string;
  page: string | null;
  title: string;
  isRead: boolean;
  updatedAt: Date;
  createdAt: Date;
}

@ObjectType()
export class GetNotificationsOutput {
  @Field(() => [Notification], { nullable: 'items' })
  notifications: Notification[];
  hasMore: boolean;
}
