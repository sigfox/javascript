import { ValidationOptions, AnySchema } from 'joi';
import { Context, Middleware } from 'koa';

type SchemaFunction = (ctx: Context) => AnySchema;

declare const koaJoiValidate: (schemasOrFunc: AnySchema | SchemaFunction, options?: ValidationOptions) => {
    (ctx: Context, next: () => Promise<void>): Middleware;
};

export { koaJoiValidate };
