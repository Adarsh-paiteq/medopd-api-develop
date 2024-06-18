import { LoggedInUser } from '@core/configs/jwt.strategy';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator<LoggedInUser>(
  (data: unknown, contex: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(contex);
    const graphqlCtx = ctx.getContext();
    const request = graphqlCtx.req ?? graphqlCtx.request;
    return request.user ?? graphqlCtx.user;
  },
);
