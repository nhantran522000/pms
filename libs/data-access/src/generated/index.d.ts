
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Tenant
 * Tenant - Root entity for multi-tenancy
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model User
 * User - Authentication and profile
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model AiProviderConfig
 * AiProviderConfig - AI provider configuration per tenant
 */
export type AiProviderConfig = $Result.DefaultSelection<Prisma.$AiProviderConfigPayload>
/**
 * Model AiPromptCache
 * AiPromptCache - Cache AI responses for 24h
 */
export type AiPromptCache = $Result.DefaultSelection<Prisma.$AiPromptCachePayload>
/**
 * Model AiUsageLog
 * AiUsageLog - Track AI usage for analytics and budgeting
 */
export type AiUsageLog = $Result.DefaultSelection<Prisma.$AiUsageLogPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Tenants
 * const tenants = await prisma.tenant.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiProviderConfig`: Exposes CRUD operations for the **AiProviderConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiProviderConfigs
    * const aiProviderConfigs = await prisma.aiProviderConfig.findMany()
    * ```
    */
  get aiProviderConfig(): Prisma.AiProviderConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiPromptCache`: Exposes CRUD operations for the **AiPromptCache** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiPromptCaches
    * const aiPromptCaches = await prisma.aiPromptCache.findMany()
    * ```
    */
  get aiPromptCache(): Prisma.AiPromptCacheDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiUsageLog`: Exposes CRUD operations for the **AiUsageLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiUsageLogs
    * const aiUsageLogs = await prisma.aiUsageLog.findMany()
    * ```
    */
  get aiUsageLog(): Prisma.AiUsageLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.5.0
   * Query Engine version: 280c870be64f457428992c43c1f6d557fab6e29e
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Tenant: 'Tenant',
    User: 'User',
    AiProviderConfig: 'AiProviderConfig',
    AiPromptCache: 'AiPromptCache',
    AiUsageLog: 'AiUsageLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "tenant" | "user" | "aiProviderConfig" | "aiPromptCache" | "aiUsageLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      AiProviderConfig: {
        payload: Prisma.$AiProviderConfigPayload<ExtArgs>
        fields: Prisma.AiProviderConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiProviderConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiProviderConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiProviderConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiProviderConfigPayload>
          }
          findFirst: {
            args: Prisma.AiProviderConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiProviderConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiProviderConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiProviderConfigPayload>
          }
          findMany: {
            args: Prisma.AiProviderConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiProviderConfigPayload>[]
          }
          create: {
            args: Prisma.AiProviderConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiProviderConfigPayload>
          }
          createMany: {
            args: Prisma.AiProviderConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiProviderConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiProviderConfigPayload>[]
          }
          delete: {
            args: Prisma.AiProviderConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiProviderConfigPayload>
          }
          update: {
            args: Prisma.AiProviderConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiProviderConfigPayload>
          }
          deleteMany: {
            args: Prisma.AiProviderConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiProviderConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiProviderConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiProviderConfigPayload>[]
          }
          upsert: {
            args: Prisma.AiProviderConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiProviderConfigPayload>
          }
          aggregate: {
            args: Prisma.AiProviderConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiProviderConfig>
          }
          groupBy: {
            args: Prisma.AiProviderConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiProviderConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiProviderConfigCountArgs<ExtArgs>
            result: $Utils.Optional<AiProviderConfigCountAggregateOutputType> | number
          }
        }
      }
      AiPromptCache: {
        payload: Prisma.$AiPromptCachePayload<ExtArgs>
        fields: Prisma.AiPromptCacheFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiPromptCacheFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptCachePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiPromptCacheFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptCachePayload>
          }
          findFirst: {
            args: Prisma.AiPromptCacheFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptCachePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiPromptCacheFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptCachePayload>
          }
          findMany: {
            args: Prisma.AiPromptCacheFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptCachePayload>[]
          }
          create: {
            args: Prisma.AiPromptCacheCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptCachePayload>
          }
          createMany: {
            args: Prisma.AiPromptCacheCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiPromptCacheCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptCachePayload>[]
          }
          delete: {
            args: Prisma.AiPromptCacheDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptCachePayload>
          }
          update: {
            args: Prisma.AiPromptCacheUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptCachePayload>
          }
          deleteMany: {
            args: Prisma.AiPromptCacheDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiPromptCacheUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiPromptCacheUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptCachePayload>[]
          }
          upsert: {
            args: Prisma.AiPromptCacheUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptCachePayload>
          }
          aggregate: {
            args: Prisma.AiPromptCacheAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiPromptCache>
          }
          groupBy: {
            args: Prisma.AiPromptCacheGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiPromptCacheGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiPromptCacheCountArgs<ExtArgs>
            result: $Utils.Optional<AiPromptCacheCountAggregateOutputType> | number
          }
        }
      }
      AiUsageLog: {
        payload: Prisma.$AiUsageLogPayload<ExtArgs>
        fields: Prisma.AiUsageLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiUsageLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiUsageLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>
          }
          findFirst: {
            args: Prisma.AiUsageLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiUsageLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>
          }
          findMany: {
            args: Prisma.AiUsageLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>[]
          }
          create: {
            args: Prisma.AiUsageLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>
          }
          createMany: {
            args: Prisma.AiUsageLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiUsageLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>[]
          }
          delete: {
            args: Prisma.AiUsageLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>
          }
          update: {
            args: Prisma.AiUsageLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>
          }
          deleteMany: {
            args: Prisma.AiUsageLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiUsageLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiUsageLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>[]
          }
          upsert: {
            args: Prisma.AiUsageLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>
          }
          aggregate: {
            args: Prisma.AiUsageLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiUsageLog>
          }
          groupBy: {
            args: Prisma.AiUsageLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiUsageLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiUsageLogCountArgs<ExtArgs>
            result: $Utils.Optional<AiUsageLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    tenant?: TenantOmit
    user?: UserOmit
    aiProviderConfig?: AiProviderConfigOmit
    aiPromptCache?: AiPromptCacheOmit
    aiUsageLog?: AiUsageLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    users: number
    aiProviderConfigs: number
    aiPromptCache: number
    aiUsageLogs: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | TenantCountOutputTypeCountUsersArgs
    aiProviderConfigs?: boolean | TenantCountOutputTypeCountAiProviderConfigsArgs
    aiPromptCache?: boolean | TenantCountOutputTypeCountAiPromptCacheArgs
    aiUsageLogs?: boolean | TenantCountOutputTypeCountAiUsageLogsArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountAiProviderConfigsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiProviderConfigWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountAiPromptCacheArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiPromptCacheWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountAiUsageLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiUsageLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TenantMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    users?: boolean | Tenant$usersArgs<ExtArgs>
    aiProviderConfigs?: boolean | Tenant$aiProviderConfigsArgs<ExtArgs>
    aiPromptCache?: boolean | Tenant$aiPromptCacheArgs<ExtArgs>
    aiUsageLogs?: boolean | Tenant$aiUsageLogsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TenantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["tenant"]>
  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Tenant$usersArgs<ExtArgs>
    aiProviderConfigs?: boolean | Tenant$aiProviderConfigsArgs<ExtArgs>
    aiPromptCache?: boolean | Tenant$aiPromptCacheArgs<ExtArgs>
    aiUsageLogs?: boolean | Tenant$aiUsageLogsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TenantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      aiProviderConfigs: Prisma.$AiProviderConfigPayload<ExtArgs>[]
      aiPromptCache: Prisma.$AiPromptCachePayload<ExtArgs>[]
      aiUsageLogs: Prisma.$AiUsageLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tenants and returns the data saved in the database.
     * @param {TenantCreateManyAndReturnArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants and returns the data updated in the database.
     * @param {TenantUpdateManyAndReturnArgs} args - Arguments to update many Tenants.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Tenant$usersArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    aiProviderConfigs<T extends Tenant$aiProviderConfigsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$aiProviderConfigsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiProviderConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    aiPromptCache<T extends Tenant$aiPromptCacheArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$aiPromptCacheArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiPromptCachePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    aiUsageLogs<T extends Tenant$aiUsageLogsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$aiUsageLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tenant model
   */
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'String'>
    readonly name: FieldRef<"Tenant", 'String'>
    readonly createdAt: FieldRef<"Tenant", 'DateTime'>
    readonly updatedAt: FieldRef<"Tenant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant createManyAndReturn
   */
  export type TenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant updateManyAndReturn
   */
  export type TenantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to delete.
     */
    limit?: number
  }

  /**
   * Tenant.users
   */
  export type Tenant$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Tenant.aiProviderConfigs
   */
  export type Tenant$aiProviderConfigsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiProviderConfig
     */
    select?: AiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiProviderConfig
     */
    omit?: AiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderConfigInclude<ExtArgs> | null
    where?: AiProviderConfigWhereInput
    orderBy?: AiProviderConfigOrderByWithRelationInput | AiProviderConfigOrderByWithRelationInput[]
    cursor?: AiProviderConfigWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AiProviderConfigScalarFieldEnum | AiProviderConfigScalarFieldEnum[]
  }

  /**
   * Tenant.aiPromptCache
   */
  export type Tenant$aiPromptCacheArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptCache
     */
    select?: AiPromptCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptCache
     */
    omit?: AiPromptCacheOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptCacheInclude<ExtArgs> | null
    where?: AiPromptCacheWhereInput
    orderBy?: AiPromptCacheOrderByWithRelationInput | AiPromptCacheOrderByWithRelationInput[]
    cursor?: AiPromptCacheWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AiPromptCacheScalarFieldEnum | AiPromptCacheScalarFieldEnum[]
  }

  /**
   * Tenant.aiUsageLogs
   */
  export type Tenant$aiUsageLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageLogInclude<ExtArgs> | null
    where?: AiUsageLogWhereInput
    orderBy?: AiUsageLogOrderByWithRelationInput | AiUsageLogOrderByWithRelationInput[]
    cursor?: AiUsageLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AiUsageLogScalarFieldEnum | AiUsageLogScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    emailVerified: boolean | null
    verificationToken: string | null
    verificationTokenExpires: Date | null
    passwordResetToken: string | null
    passwordResetTokenExpires: Date | null
    tenantId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    emailVerified: boolean | null
    verificationToken: string | null
    verificationTokenExpires: Date | null
    passwordResetToken: string | null
    passwordResetTokenExpires: Date | null
    tenantId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    name: number
    emailVerified: number
    verificationToken: number
    verificationTokenExpires: number
    passwordResetToken: number
    passwordResetTokenExpires: number
    tenantId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    emailVerified?: true
    verificationToken?: true
    verificationTokenExpires?: true
    passwordResetToken?: true
    passwordResetTokenExpires?: true
    tenantId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    emailVerified?: true
    verificationToken?: true
    verificationTokenExpires?: true
    passwordResetToken?: true
    passwordResetTokenExpires?: true
    tenantId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    emailVerified?: true
    verificationToken?: true
    verificationTokenExpires?: true
    passwordResetToken?: true
    passwordResetTokenExpires?: true
    tenantId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    name: string | null
    emailVerified: boolean
    verificationToken: string | null
    verificationTokenExpires: Date | null
    passwordResetToken: string | null
    passwordResetTokenExpires: Date | null
    tenantId: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    emailVerified?: boolean
    verificationToken?: boolean
    verificationTokenExpires?: boolean
    passwordResetToken?: boolean
    passwordResetTokenExpires?: boolean
    tenantId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    emailVerified?: boolean
    verificationToken?: boolean
    verificationTokenExpires?: boolean
    passwordResetToken?: boolean
    passwordResetTokenExpires?: boolean
    tenantId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    emailVerified?: boolean
    verificationToken?: boolean
    verificationTokenExpires?: boolean
    passwordResetToken?: boolean
    passwordResetTokenExpires?: boolean
    tenantId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    emailVerified?: boolean
    verificationToken?: boolean
    verificationTokenExpires?: boolean
    passwordResetToken?: boolean
    passwordResetTokenExpires?: boolean
    tenantId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "name" | "emailVerified" | "verificationToken" | "verificationTokenExpires" | "passwordResetToken" | "passwordResetTokenExpires" | "tenantId" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      name: string | null
      emailVerified: boolean
      verificationToken: string | null
      verificationTokenExpires: Date | null
      passwordResetToken: string | null
      passwordResetTokenExpires: Date | null
      tenantId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly verificationToken: FieldRef<"User", 'String'>
    readonly verificationTokenExpires: FieldRef<"User", 'DateTime'>
    readonly passwordResetToken: FieldRef<"User", 'String'>
    readonly passwordResetTokenExpires: FieldRef<"User", 'DateTime'>
    readonly tenantId: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model AiProviderConfig
   */

  export type AggregateAiProviderConfig = {
    _count: AiProviderConfigCountAggregateOutputType | null
    _avg: AiProviderConfigAvgAggregateOutputType | null
    _sum: AiProviderConfigSumAggregateOutputType | null
    _min: AiProviderConfigMinAggregateOutputType | null
    _max: AiProviderConfigMaxAggregateOutputType | null
  }

  export type AiProviderConfigAvgAggregateOutputType = {
    priority: number | null
  }

  export type AiProviderConfigSumAggregateOutputType = {
    priority: number | null
  }

  export type AiProviderConfigMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    provider: string | null
    modelName: string | null
    isEnabled: boolean | null
    priority: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiProviderConfigMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    provider: string | null
    modelName: string | null
    isEnabled: boolean | null
    priority: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiProviderConfigCountAggregateOutputType = {
    id: number
    tenantId: number
    provider: number
    modelName: number
    isEnabled: number
    priority: number
    config: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AiProviderConfigAvgAggregateInputType = {
    priority?: true
  }

  export type AiProviderConfigSumAggregateInputType = {
    priority?: true
  }

  export type AiProviderConfigMinAggregateInputType = {
    id?: true
    tenantId?: true
    provider?: true
    modelName?: true
    isEnabled?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiProviderConfigMaxAggregateInputType = {
    id?: true
    tenantId?: true
    provider?: true
    modelName?: true
    isEnabled?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiProviderConfigCountAggregateInputType = {
    id?: true
    tenantId?: true
    provider?: true
    modelName?: true
    isEnabled?: true
    priority?: true
    config?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AiProviderConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiProviderConfig to aggregate.
     */
    where?: AiProviderConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiProviderConfigs to fetch.
     */
    orderBy?: AiProviderConfigOrderByWithRelationInput | AiProviderConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiProviderConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiProviderConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiProviderConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiProviderConfigs
    **/
    _count?: true | AiProviderConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiProviderConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiProviderConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiProviderConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiProviderConfigMaxAggregateInputType
  }

  export type GetAiProviderConfigAggregateType<T extends AiProviderConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateAiProviderConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiProviderConfig[P]>
      : GetScalarType<T[P], AggregateAiProviderConfig[P]>
  }




  export type AiProviderConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiProviderConfigWhereInput
    orderBy?: AiProviderConfigOrderByWithAggregationInput | AiProviderConfigOrderByWithAggregationInput[]
    by: AiProviderConfigScalarFieldEnum[] | AiProviderConfigScalarFieldEnum
    having?: AiProviderConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiProviderConfigCountAggregateInputType | true
    _avg?: AiProviderConfigAvgAggregateInputType
    _sum?: AiProviderConfigSumAggregateInputType
    _min?: AiProviderConfigMinAggregateInputType
    _max?: AiProviderConfigMaxAggregateInputType
  }

  export type AiProviderConfigGroupByOutputType = {
    id: string
    tenantId: string
    provider: string
    modelName: string
    isEnabled: boolean
    priority: number
    config: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: AiProviderConfigCountAggregateOutputType | null
    _avg: AiProviderConfigAvgAggregateOutputType | null
    _sum: AiProviderConfigSumAggregateOutputType | null
    _min: AiProviderConfigMinAggregateOutputType | null
    _max: AiProviderConfigMaxAggregateOutputType | null
  }

  type GetAiProviderConfigGroupByPayload<T extends AiProviderConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiProviderConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiProviderConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiProviderConfigGroupByOutputType[P]>
            : GetScalarType<T[P], AiProviderConfigGroupByOutputType[P]>
        }
      >
    >


  export type AiProviderConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    provider?: boolean
    modelName?: boolean
    isEnabled?: boolean
    priority?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiProviderConfig"]>

  export type AiProviderConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    provider?: boolean
    modelName?: boolean
    isEnabled?: boolean
    priority?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiProviderConfig"]>

  export type AiProviderConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    provider?: boolean
    modelName?: boolean
    isEnabled?: boolean
    priority?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiProviderConfig"]>

  export type AiProviderConfigSelectScalar = {
    id?: boolean
    tenantId?: boolean
    provider?: boolean
    modelName?: boolean
    isEnabled?: boolean
    priority?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AiProviderConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "provider" | "modelName" | "isEnabled" | "priority" | "config" | "createdAt" | "updatedAt", ExtArgs["result"]["aiProviderConfig"]>
  export type AiProviderConfigInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type AiProviderConfigIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type AiProviderConfigIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $AiProviderConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiProviderConfig"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      provider: string
      modelName: string
      isEnabled: boolean
      priority: number
      config: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["aiProviderConfig"]>
    composites: {}
  }

  type AiProviderConfigGetPayload<S extends boolean | null | undefined | AiProviderConfigDefaultArgs> = $Result.GetResult<Prisma.$AiProviderConfigPayload, S>

  type AiProviderConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiProviderConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiProviderConfigCountAggregateInputType | true
    }

  export interface AiProviderConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiProviderConfig'], meta: { name: 'AiProviderConfig' } }
    /**
     * Find zero or one AiProviderConfig that matches the filter.
     * @param {AiProviderConfigFindUniqueArgs} args - Arguments to find a AiProviderConfig
     * @example
     * // Get one AiProviderConfig
     * const aiProviderConfig = await prisma.aiProviderConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiProviderConfigFindUniqueArgs>(args: SelectSubset<T, AiProviderConfigFindUniqueArgs<ExtArgs>>): Prisma__AiProviderConfigClient<$Result.GetResult<Prisma.$AiProviderConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiProviderConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiProviderConfigFindUniqueOrThrowArgs} args - Arguments to find a AiProviderConfig
     * @example
     * // Get one AiProviderConfig
     * const aiProviderConfig = await prisma.aiProviderConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiProviderConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, AiProviderConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiProviderConfigClient<$Result.GetResult<Prisma.$AiProviderConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiProviderConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiProviderConfigFindFirstArgs} args - Arguments to find a AiProviderConfig
     * @example
     * // Get one AiProviderConfig
     * const aiProviderConfig = await prisma.aiProviderConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiProviderConfigFindFirstArgs>(args?: SelectSubset<T, AiProviderConfigFindFirstArgs<ExtArgs>>): Prisma__AiProviderConfigClient<$Result.GetResult<Prisma.$AiProviderConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiProviderConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiProviderConfigFindFirstOrThrowArgs} args - Arguments to find a AiProviderConfig
     * @example
     * // Get one AiProviderConfig
     * const aiProviderConfig = await prisma.aiProviderConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiProviderConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, AiProviderConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiProviderConfigClient<$Result.GetResult<Prisma.$AiProviderConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiProviderConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiProviderConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiProviderConfigs
     * const aiProviderConfigs = await prisma.aiProviderConfig.findMany()
     * 
     * // Get first 10 AiProviderConfigs
     * const aiProviderConfigs = await prisma.aiProviderConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiProviderConfigWithIdOnly = await prisma.aiProviderConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiProviderConfigFindManyArgs>(args?: SelectSubset<T, AiProviderConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiProviderConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiProviderConfig.
     * @param {AiProviderConfigCreateArgs} args - Arguments to create a AiProviderConfig.
     * @example
     * // Create one AiProviderConfig
     * const AiProviderConfig = await prisma.aiProviderConfig.create({
     *   data: {
     *     // ... data to create a AiProviderConfig
     *   }
     * })
     * 
     */
    create<T extends AiProviderConfigCreateArgs>(args: SelectSubset<T, AiProviderConfigCreateArgs<ExtArgs>>): Prisma__AiProviderConfigClient<$Result.GetResult<Prisma.$AiProviderConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiProviderConfigs.
     * @param {AiProviderConfigCreateManyArgs} args - Arguments to create many AiProviderConfigs.
     * @example
     * // Create many AiProviderConfigs
     * const aiProviderConfig = await prisma.aiProviderConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiProviderConfigCreateManyArgs>(args?: SelectSubset<T, AiProviderConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiProviderConfigs and returns the data saved in the database.
     * @param {AiProviderConfigCreateManyAndReturnArgs} args - Arguments to create many AiProviderConfigs.
     * @example
     * // Create many AiProviderConfigs
     * const aiProviderConfig = await prisma.aiProviderConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiProviderConfigs and only return the `id`
     * const aiProviderConfigWithIdOnly = await prisma.aiProviderConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiProviderConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, AiProviderConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiProviderConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiProviderConfig.
     * @param {AiProviderConfigDeleteArgs} args - Arguments to delete one AiProviderConfig.
     * @example
     * // Delete one AiProviderConfig
     * const AiProviderConfig = await prisma.aiProviderConfig.delete({
     *   where: {
     *     // ... filter to delete one AiProviderConfig
     *   }
     * })
     * 
     */
    delete<T extends AiProviderConfigDeleteArgs>(args: SelectSubset<T, AiProviderConfigDeleteArgs<ExtArgs>>): Prisma__AiProviderConfigClient<$Result.GetResult<Prisma.$AiProviderConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiProviderConfig.
     * @param {AiProviderConfigUpdateArgs} args - Arguments to update one AiProviderConfig.
     * @example
     * // Update one AiProviderConfig
     * const aiProviderConfig = await prisma.aiProviderConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiProviderConfigUpdateArgs>(args: SelectSubset<T, AiProviderConfigUpdateArgs<ExtArgs>>): Prisma__AiProviderConfigClient<$Result.GetResult<Prisma.$AiProviderConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiProviderConfigs.
     * @param {AiProviderConfigDeleteManyArgs} args - Arguments to filter AiProviderConfigs to delete.
     * @example
     * // Delete a few AiProviderConfigs
     * const { count } = await prisma.aiProviderConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiProviderConfigDeleteManyArgs>(args?: SelectSubset<T, AiProviderConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiProviderConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiProviderConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiProviderConfigs
     * const aiProviderConfig = await prisma.aiProviderConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiProviderConfigUpdateManyArgs>(args: SelectSubset<T, AiProviderConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiProviderConfigs and returns the data updated in the database.
     * @param {AiProviderConfigUpdateManyAndReturnArgs} args - Arguments to update many AiProviderConfigs.
     * @example
     * // Update many AiProviderConfigs
     * const aiProviderConfig = await prisma.aiProviderConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiProviderConfigs and only return the `id`
     * const aiProviderConfigWithIdOnly = await prisma.aiProviderConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiProviderConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, AiProviderConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiProviderConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiProviderConfig.
     * @param {AiProviderConfigUpsertArgs} args - Arguments to update or create a AiProviderConfig.
     * @example
     * // Update or create a AiProviderConfig
     * const aiProviderConfig = await prisma.aiProviderConfig.upsert({
     *   create: {
     *     // ... data to create a AiProviderConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiProviderConfig we want to update
     *   }
     * })
     */
    upsert<T extends AiProviderConfigUpsertArgs>(args: SelectSubset<T, AiProviderConfigUpsertArgs<ExtArgs>>): Prisma__AiProviderConfigClient<$Result.GetResult<Prisma.$AiProviderConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiProviderConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiProviderConfigCountArgs} args - Arguments to filter AiProviderConfigs to count.
     * @example
     * // Count the number of AiProviderConfigs
     * const count = await prisma.aiProviderConfig.count({
     *   where: {
     *     // ... the filter for the AiProviderConfigs we want to count
     *   }
     * })
    **/
    count<T extends AiProviderConfigCountArgs>(
      args?: Subset<T, AiProviderConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiProviderConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiProviderConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiProviderConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiProviderConfigAggregateArgs>(args: Subset<T, AiProviderConfigAggregateArgs>): Prisma.PrismaPromise<GetAiProviderConfigAggregateType<T>>

    /**
     * Group by AiProviderConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiProviderConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiProviderConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiProviderConfigGroupByArgs['orderBy'] }
        : { orderBy?: AiProviderConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiProviderConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiProviderConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiProviderConfig model
   */
  readonly fields: AiProviderConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiProviderConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiProviderConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiProviderConfig model
   */
  interface AiProviderConfigFieldRefs {
    readonly id: FieldRef<"AiProviderConfig", 'String'>
    readonly tenantId: FieldRef<"AiProviderConfig", 'String'>
    readonly provider: FieldRef<"AiProviderConfig", 'String'>
    readonly modelName: FieldRef<"AiProviderConfig", 'String'>
    readonly isEnabled: FieldRef<"AiProviderConfig", 'Boolean'>
    readonly priority: FieldRef<"AiProviderConfig", 'Int'>
    readonly config: FieldRef<"AiProviderConfig", 'Json'>
    readonly createdAt: FieldRef<"AiProviderConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"AiProviderConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiProviderConfig findUnique
   */
  export type AiProviderConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiProviderConfig
     */
    select?: AiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiProviderConfig
     */
    omit?: AiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderConfigInclude<ExtArgs> | null
    /**
     * Filter, which AiProviderConfig to fetch.
     */
    where: AiProviderConfigWhereUniqueInput
  }

  /**
   * AiProviderConfig findUniqueOrThrow
   */
  export type AiProviderConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiProviderConfig
     */
    select?: AiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiProviderConfig
     */
    omit?: AiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderConfigInclude<ExtArgs> | null
    /**
     * Filter, which AiProviderConfig to fetch.
     */
    where: AiProviderConfigWhereUniqueInput
  }

  /**
   * AiProviderConfig findFirst
   */
  export type AiProviderConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiProviderConfig
     */
    select?: AiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiProviderConfig
     */
    omit?: AiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderConfigInclude<ExtArgs> | null
    /**
     * Filter, which AiProviderConfig to fetch.
     */
    where?: AiProviderConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiProviderConfigs to fetch.
     */
    orderBy?: AiProviderConfigOrderByWithRelationInput | AiProviderConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiProviderConfigs.
     */
    cursor?: AiProviderConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiProviderConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiProviderConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiProviderConfigs.
     */
    distinct?: AiProviderConfigScalarFieldEnum | AiProviderConfigScalarFieldEnum[]
  }

  /**
   * AiProviderConfig findFirstOrThrow
   */
  export type AiProviderConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiProviderConfig
     */
    select?: AiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiProviderConfig
     */
    omit?: AiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderConfigInclude<ExtArgs> | null
    /**
     * Filter, which AiProviderConfig to fetch.
     */
    where?: AiProviderConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiProviderConfigs to fetch.
     */
    orderBy?: AiProviderConfigOrderByWithRelationInput | AiProviderConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiProviderConfigs.
     */
    cursor?: AiProviderConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiProviderConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiProviderConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiProviderConfigs.
     */
    distinct?: AiProviderConfigScalarFieldEnum | AiProviderConfigScalarFieldEnum[]
  }

  /**
   * AiProviderConfig findMany
   */
  export type AiProviderConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiProviderConfig
     */
    select?: AiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiProviderConfig
     */
    omit?: AiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderConfigInclude<ExtArgs> | null
    /**
     * Filter, which AiProviderConfigs to fetch.
     */
    where?: AiProviderConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiProviderConfigs to fetch.
     */
    orderBy?: AiProviderConfigOrderByWithRelationInput | AiProviderConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiProviderConfigs.
     */
    cursor?: AiProviderConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiProviderConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiProviderConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiProviderConfigs.
     */
    distinct?: AiProviderConfigScalarFieldEnum | AiProviderConfigScalarFieldEnum[]
  }

  /**
   * AiProviderConfig create
   */
  export type AiProviderConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiProviderConfig
     */
    select?: AiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiProviderConfig
     */
    omit?: AiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderConfigInclude<ExtArgs> | null
    /**
     * The data needed to create a AiProviderConfig.
     */
    data: XOR<AiProviderConfigCreateInput, AiProviderConfigUncheckedCreateInput>
  }

  /**
   * AiProviderConfig createMany
   */
  export type AiProviderConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiProviderConfigs.
     */
    data: AiProviderConfigCreateManyInput | AiProviderConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiProviderConfig createManyAndReturn
   */
  export type AiProviderConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiProviderConfig
     */
    select?: AiProviderConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiProviderConfig
     */
    omit?: AiProviderConfigOmit<ExtArgs> | null
    /**
     * The data used to create many AiProviderConfigs.
     */
    data: AiProviderConfigCreateManyInput | AiProviderConfigCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderConfigIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiProviderConfig update
   */
  export type AiProviderConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiProviderConfig
     */
    select?: AiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiProviderConfig
     */
    omit?: AiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderConfigInclude<ExtArgs> | null
    /**
     * The data needed to update a AiProviderConfig.
     */
    data: XOR<AiProviderConfigUpdateInput, AiProviderConfigUncheckedUpdateInput>
    /**
     * Choose, which AiProviderConfig to update.
     */
    where: AiProviderConfigWhereUniqueInput
  }

  /**
   * AiProviderConfig updateMany
   */
  export type AiProviderConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiProviderConfigs.
     */
    data: XOR<AiProviderConfigUpdateManyMutationInput, AiProviderConfigUncheckedUpdateManyInput>
    /**
     * Filter which AiProviderConfigs to update
     */
    where?: AiProviderConfigWhereInput
    /**
     * Limit how many AiProviderConfigs to update.
     */
    limit?: number
  }

  /**
   * AiProviderConfig updateManyAndReturn
   */
  export type AiProviderConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiProviderConfig
     */
    select?: AiProviderConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiProviderConfig
     */
    omit?: AiProviderConfigOmit<ExtArgs> | null
    /**
     * The data used to update AiProviderConfigs.
     */
    data: XOR<AiProviderConfigUpdateManyMutationInput, AiProviderConfigUncheckedUpdateManyInput>
    /**
     * Filter which AiProviderConfigs to update
     */
    where?: AiProviderConfigWhereInput
    /**
     * Limit how many AiProviderConfigs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderConfigIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiProviderConfig upsert
   */
  export type AiProviderConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiProviderConfig
     */
    select?: AiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiProviderConfig
     */
    omit?: AiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderConfigInclude<ExtArgs> | null
    /**
     * The filter to search for the AiProviderConfig to update in case it exists.
     */
    where: AiProviderConfigWhereUniqueInput
    /**
     * In case the AiProviderConfig found by the `where` argument doesn't exist, create a new AiProviderConfig with this data.
     */
    create: XOR<AiProviderConfigCreateInput, AiProviderConfigUncheckedCreateInput>
    /**
     * In case the AiProviderConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiProviderConfigUpdateInput, AiProviderConfigUncheckedUpdateInput>
  }

  /**
   * AiProviderConfig delete
   */
  export type AiProviderConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiProviderConfig
     */
    select?: AiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiProviderConfig
     */
    omit?: AiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderConfigInclude<ExtArgs> | null
    /**
     * Filter which AiProviderConfig to delete.
     */
    where: AiProviderConfigWhereUniqueInput
  }

  /**
   * AiProviderConfig deleteMany
   */
  export type AiProviderConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiProviderConfigs to delete
     */
    where?: AiProviderConfigWhereInput
    /**
     * Limit how many AiProviderConfigs to delete.
     */
    limit?: number
  }

  /**
   * AiProviderConfig without action
   */
  export type AiProviderConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiProviderConfig
     */
    select?: AiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiProviderConfig
     */
    omit?: AiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderConfigInclude<ExtArgs> | null
  }


  /**
   * Model AiPromptCache
   */

  export type AggregateAiPromptCache = {
    _count: AiPromptCacheCountAggregateOutputType | null
    _avg: AiPromptCacheAvgAggregateOutputType | null
    _sum: AiPromptCacheSumAggregateOutputType | null
    _min: AiPromptCacheMinAggregateOutputType | null
    _max: AiPromptCacheMaxAggregateOutputType | null
  }

  export type AiPromptCacheAvgAggregateOutputType = {
    tokensUsed: number | null
  }

  export type AiPromptCacheSumAggregateOutputType = {
    tokensUsed: number | null
  }

  export type AiPromptCacheMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    promptHash: string | null
    taskType: string | null
    tokensUsed: number | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type AiPromptCacheMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    promptHash: string | null
    taskType: string | null
    tokensUsed: number | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type AiPromptCacheCountAggregateOutputType = {
    id: number
    tenantId: number
    promptHash: number
    taskType: number
    response: number
    tokensUsed: number
    createdAt: number
    expiresAt: number
    _all: number
  }


  export type AiPromptCacheAvgAggregateInputType = {
    tokensUsed?: true
  }

  export type AiPromptCacheSumAggregateInputType = {
    tokensUsed?: true
  }

  export type AiPromptCacheMinAggregateInputType = {
    id?: true
    tenantId?: true
    promptHash?: true
    taskType?: true
    tokensUsed?: true
    createdAt?: true
    expiresAt?: true
  }

  export type AiPromptCacheMaxAggregateInputType = {
    id?: true
    tenantId?: true
    promptHash?: true
    taskType?: true
    tokensUsed?: true
    createdAt?: true
    expiresAt?: true
  }

  export type AiPromptCacheCountAggregateInputType = {
    id?: true
    tenantId?: true
    promptHash?: true
    taskType?: true
    response?: true
    tokensUsed?: true
    createdAt?: true
    expiresAt?: true
    _all?: true
  }

  export type AiPromptCacheAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiPromptCache to aggregate.
     */
    where?: AiPromptCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiPromptCaches to fetch.
     */
    orderBy?: AiPromptCacheOrderByWithRelationInput | AiPromptCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiPromptCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiPromptCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiPromptCaches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiPromptCaches
    **/
    _count?: true | AiPromptCacheCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiPromptCacheAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiPromptCacheSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiPromptCacheMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiPromptCacheMaxAggregateInputType
  }

  export type GetAiPromptCacheAggregateType<T extends AiPromptCacheAggregateArgs> = {
        [P in keyof T & keyof AggregateAiPromptCache]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiPromptCache[P]>
      : GetScalarType<T[P], AggregateAiPromptCache[P]>
  }




  export type AiPromptCacheGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiPromptCacheWhereInput
    orderBy?: AiPromptCacheOrderByWithAggregationInput | AiPromptCacheOrderByWithAggregationInput[]
    by: AiPromptCacheScalarFieldEnum[] | AiPromptCacheScalarFieldEnum
    having?: AiPromptCacheScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiPromptCacheCountAggregateInputType | true
    _avg?: AiPromptCacheAvgAggregateInputType
    _sum?: AiPromptCacheSumAggregateInputType
    _min?: AiPromptCacheMinAggregateInputType
    _max?: AiPromptCacheMaxAggregateInputType
  }

  export type AiPromptCacheGroupByOutputType = {
    id: string
    tenantId: string
    promptHash: string
    taskType: string
    response: JsonValue
    tokensUsed: number
    createdAt: Date
    expiresAt: Date
    _count: AiPromptCacheCountAggregateOutputType | null
    _avg: AiPromptCacheAvgAggregateOutputType | null
    _sum: AiPromptCacheSumAggregateOutputType | null
    _min: AiPromptCacheMinAggregateOutputType | null
    _max: AiPromptCacheMaxAggregateOutputType | null
  }

  type GetAiPromptCacheGroupByPayload<T extends AiPromptCacheGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiPromptCacheGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiPromptCacheGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiPromptCacheGroupByOutputType[P]>
            : GetScalarType<T[P], AiPromptCacheGroupByOutputType[P]>
        }
      >
    >


  export type AiPromptCacheSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    promptHash?: boolean
    taskType?: boolean
    response?: boolean
    tokensUsed?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiPromptCache"]>

  export type AiPromptCacheSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    promptHash?: boolean
    taskType?: boolean
    response?: boolean
    tokensUsed?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiPromptCache"]>

  export type AiPromptCacheSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    promptHash?: boolean
    taskType?: boolean
    response?: boolean
    tokensUsed?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiPromptCache"]>

  export type AiPromptCacheSelectScalar = {
    id?: boolean
    tenantId?: boolean
    promptHash?: boolean
    taskType?: boolean
    response?: boolean
    tokensUsed?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }

  export type AiPromptCacheOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "promptHash" | "taskType" | "response" | "tokensUsed" | "createdAt" | "expiresAt", ExtArgs["result"]["aiPromptCache"]>
  export type AiPromptCacheInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type AiPromptCacheIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type AiPromptCacheIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $AiPromptCachePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiPromptCache"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      promptHash: string
      taskType: string
      response: Prisma.JsonValue
      tokensUsed: number
      createdAt: Date
      expiresAt: Date
    }, ExtArgs["result"]["aiPromptCache"]>
    composites: {}
  }

  type AiPromptCacheGetPayload<S extends boolean | null | undefined | AiPromptCacheDefaultArgs> = $Result.GetResult<Prisma.$AiPromptCachePayload, S>

  type AiPromptCacheCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiPromptCacheFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiPromptCacheCountAggregateInputType | true
    }

  export interface AiPromptCacheDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiPromptCache'], meta: { name: 'AiPromptCache' } }
    /**
     * Find zero or one AiPromptCache that matches the filter.
     * @param {AiPromptCacheFindUniqueArgs} args - Arguments to find a AiPromptCache
     * @example
     * // Get one AiPromptCache
     * const aiPromptCache = await prisma.aiPromptCache.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiPromptCacheFindUniqueArgs>(args: SelectSubset<T, AiPromptCacheFindUniqueArgs<ExtArgs>>): Prisma__AiPromptCacheClient<$Result.GetResult<Prisma.$AiPromptCachePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiPromptCache that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiPromptCacheFindUniqueOrThrowArgs} args - Arguments to find a AiPromptCache
     * @example
     * // Get one AiPromptCache
     * const aiPromptCache = await prisma.aiPromptCache.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiPromptCacheFindUniqueOrThrowArgs>(args: SelectSubset<T, AiPromptCacheFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiPromptCacheClient<$Result.GetResult<Prisma.$AiPromptCachePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiPromptCache that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPromptCacheFindFirstArgs} args - Arguments to find a AiPromptCache
     * @example
     * // Get one AiPromptCache
     * const aiPromptCache = await prisma.aiPromptCache.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiPromptCacheFindFirstArgs>(args?: SelectSubset<T, AiPromptCacheFindFirstArgs<ExtArgs>>): Prisma__AiPromptCacheClient<$Result.GetResult<Prisma.$AiPromptCachePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiPromptCache that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPromptCacheFindFirstOrThrowArgs} args - Arguments to find a AiPromptCache
     * @example
     * // Get one AiPromptCache
     * const aiPromptCache = await prisma.aiPromptCache.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiPromptCacheFindFirstOrThrowArgs>(args?: SelectSubset<T, AiPromptCacheFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiPromptCacheClient<$Result.GetResult<Prisma.$AiPromptCachePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiPromptCaches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPromptCacheFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiPromptCaches
     * const aiPromptCaches = await prisma.aiPromptCache.findMany()
     * 
     * // Get first 10 AiPromptCaches
     * const aiPromptCaches = await prisma.aiPromptCache.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiPromptCacheWithIdOnly = await prisma.aiPromptCache.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiPromptCacheFindManyArgs>(args?: SelectSubset<T, AiPromptCacheFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiPromptCachePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiPromptCache.
     * @param {AiPromptCacheCreateArgs} args - Arguments to create a AiPromptCache.
     * @example
     * // Create one AiPromptCache
     * const AiPromptCache = await prisma.aiPromptCache.create({
     *   data: {
     *     // ... data to create a AiPromptCache
     *   }
     * })
     * 
     */
    create<T extends AiPromptCacheCreateArgs>(args: SelectSubset<T, AiPromptCacheCreateArgs<ExtArgs>>): Prisma__AiPromptCacheClient<$Result.GetResult<Prisma.$AiPromptCachePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiPromptCaches.
     * @param {AiPromptCacheCreateManyArgs} args - Arguments to create many AiPromptCaches.
     * @example
     * // Create many AiPromptCaches
     * const aiPromptCache = await prisma.aiPromptCache.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiPromptCacheCreateManyArgs>(args?: SelectSubset<T, AiPromptCacheCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiPromptCaches and returns the data saved in the database.
     * @param {AiPromptCacheCreateManyAndReturnArgs} args - Arguments to create many AiPromptCaches.
     * @example
     * // Create many AiPromptCaches
     * const aiPromptCache = await prisma.aiPromptCache.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiPromptCaches and only return the `id`
     * const aiPromptCacheWithIdOnly = await prisma.aiPromptCache.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiPromptCacheCreateManyAndReturnArgs>(args?: SelectSubset<T, AiPromptCacheCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiPromptCachePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiPromptCache.
     * @param {AiPromptCacheDeleteArgs} args - Arguments to delete one AiPromptCache.
     * @example
     * // Delete one AiPromptCache
     * const AiPromptCache = await prisma.aiPromptCache.delete({
     *   where: {
     *     // ... filter to delete one AiPromptCache
     *   }
     * })
     * 
     */
    delete<T extends AiPromptCacheDeleteArgs>(args: SelectSubset<T, AiPromptCacheDeleteArgs<ExtArgs>>): Prisma__AiPromptCacheClient<$Result.GetResult<Prisma.$AiPromptCachePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiPromptCache.
     * @param {AiPromptCacheUpdateArgs} args - Arguments to update one AiPromptCache.
     * @example
     * // Update one AiPromptCache
     * const aiPromptCache = await prisma.aiPromptCache.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiPromptCacheUpdateArgs>(args: SelectSubset<T, AiPromptCacheUpdateArgs<ExtArgs>>): Prisma__AiPromptCacheClient<$Result.GetResult<Prisma.$AiPromptCachePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiPromptCaches.
     * @param {AiPromptCacheDeleteManyArgs} args - Arguments to filter AiPromptCaches to delete.
     * @example
     * // Delete a few AiPromptCaches
     * const { count } = await prisma.aiPromptCache.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiPromptCacheDeleteManyArgs>(args?: SelectSubset<T, AiPromptCacheDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiPromptCaches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPromptCacheUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiPromptCaches
     * const aiPromptCache = await prisma.aiPromptCache.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiPromptCacheUpdateManyArgs>(args: SelectSubset<T, AiPromptCacheUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiPromptCaches and returns the data updated in the database.
     * @param {AiPromptCacheUpdateManyAndReturnArgs} args - Arguments to update many AiPromptCaches.
     * @example
     * // Update many AiPromptCaches
     * const aiPromptCache = await prisma.aiPromptCache.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiPromptCaches and only return the `id`
     * const aiPromptCacheWithIdOnly = await prisma.aiPromptCache.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiPromptCacheUpdateManyAndReturnArgs>(args: SelectSubset<T, AiPromptCacheUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiPromptCachePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiPromptCache.
     * @param {AiPromptCacheUpsertArgs} args - Arguments to update or create a AiPromptCache.
     * @example
     * // Update or create a AiPromptCache
     * const aiPromptCache = await prisma.aiPromptCache.upsert({
     *   create: {
     *     // ... data to create a AiPromptCache
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiPromptCache we want to update
     *   }
     * })
     */
    upsert<T extends AiPromptCacheUpsertArgs>(args: SelectSubset<T, AiPromptCacheUpsertArgs<ExtArgs>>): Prisma__AiPromptCacheClient<$Result.GetResult<Prisma.$AiPromptCachePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiPromptCaches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPromptCacheCountArgs} args - Arguments to filter AiPromptCaches to count.
     * @example
     * // Count the number of AiPromptCaches
     * const count = await prisma.aiPromptCache.count({
     *   where: {
     *     // ... the filter for the AiPromptCaches we want to count
     *   }
     * })
    **/
    count<T extends AiPromptCacheCountArgs>(
      args?: Subset<T, AiPromptCacheCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiPromptCacheCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiPromptCache.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPromptCacheAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiPromptCacheAggregateArgs>(args: Subset<T, AiPromptCacheAggregateArgs>): Prisma.PrismaPromise<GetAiPromptCacheAggregateType<T>>

    /**
     * Group by AiPromptCache.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPromptCacheGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiPromptCacheGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiPromptCacheGroupByArgs['orderBy'] }
        : { orderBy?: AiPromptCacheGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiPromptCacheGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiPromptCacheGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiPromptCache model
   */
  readonly fields: AiPromptCacheFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiPromptCache.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiPromptCacheClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiPromptCache model
   */
  interface AiPromptCacheFieldRefs {
    readonly id: FieldRef<"AiPromptCache", 'String'>
    readonly tenantId: FieldRef<"AiPromptCache", 'String'>
    readonly promptHash: FieldRef<"AiPromptCache", 'String'>
    readonly taskType: FieldRef<"AiPromptCache", 'String'>
    readonly response: FieldRef<"AiPromptCache", 'Json'>
    readonly tokensUsed: FieldRef<"AiPromptCache", 'Int'>
    readonly createdAt: FieldRef<"AiPromptCache", 'DateTime'>
    readonly expiresAt: FieldRef<"AiPromptCache", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiPromptCache findUnique
   */
  export type AiPromptCacheFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptCache
     */
    select?: AiPromptCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptCache
     */
    omit?: AiPromptCacheOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptCacheInclude<ExtArgs> | null
    /**
     * Filter, which AiPromptCache to fetch.
     */
    where: AiPromptCacheWhereUniqueInput
  }

  /**
   * AiPromptCache findUniqueOrThrow
   */
  export type AiPromptCacheFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptCache
     */
    select?: AiPromptCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptCache
     */
    omit?: AiPromptCacheOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptCacheInclude<ExtArgs> | null
    /**
     * Filter, which AiPromptCache to fetch.
     */
    where: AiPromptCacheWhereUniqueInput
  }

  /**
   * AiPromptCache findFirst
   */
  export type AiPromptCacheFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptCache
     */
    select?: AiPromptCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptCache
     */
    omit?: AiPromptCacheOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptCacheInclude<ExtArgs> | null
    /**
     * Filter, which AiPromptCache to fetch.
     */
    where?: AiPromptCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiPromptCaches to fetch.
     */
    orderBy?: AiPromptCacheOrderByWithRelationInput | AiPromptCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiPromptCaches.
     */
    cursor?: AiPromptCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiPromptCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiPromptCaches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiPromptCaches.
     */
    distinct?: AiPromptCacheScalarFieldEnum | AiPromptCacheScalarFieldEnum[]
  }

  /**
   * AiPromptCache findFirstOrThrow
   */
  export type AiPromptCacheFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptCache
     */
    select?: AiPromptCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptCache
     */
    omit?: AiPromptCacheOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptCacheInclude<ExtArgs> | null
    /**
     * Filter, which AiPromptCache to fetch.
     */
    where?: AiPromptCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiPromptCaches to fetch.
     */
    orderBy?: AiPromptCacheOrderByWithRelationInput | AiPromptCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiPromptCaches.
     */
    cursor?: AiPromptCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiPromptCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiPromptCaches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiPromptCaches.
     */
    distinct?: AiPromptCacheScalarFieldEnum | AiPromptCacheScalarFieldEnum[]
  }

  /**
   * AiPromptCache findMany
   */
  export type AiPromptCacheFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptCache
     */
    select?: AiPromptCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptCache
     */
    omit?: AiPromptCacheOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptCacheInclude<ExtArgs> | null
    /**
     * Filter, which AiPromptCaches to fetch.
     */
    where?: AiPromptCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiPromptCaches to fetch.
     */
    orderBy?: AiPromptCacheOrderByWithRelationInput | AiPromptCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiPromptCaches.
     */
    cursor?: AiPromptCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiPromptCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiPromptCaches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiPromptCaches.
     */
    distinct?: AiPromptCacheScalarFieldEnum | AiPromptCacheScalarFieldEnum[]
  }

  /**
   * AiPromptCache create
   */
  export type AiPromptCacheCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptCache
     */
    select?: AiPromptCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptCache
     */
    omit?: AiPromptCacheOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptCacheInclude<ExtArgs> | null
    /**
     * The data needed to create a AiPromptCache.
     */
    data: XOR<AiPromptCacheCreateInput, AiPromptCacheUncheckedCreateInput>
  }

  /**
   * AiPromptCache createMany
   */
  export type AiPromptCacheCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiPromptCaches.
     */
    data: AiPromptCacheCreateManyInput | AiPromptCacheCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiPromptCache createManyAndReturn
   */
  export type AiPromptCacheCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptCache
     */
    select?: AiPromptCacheSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptCache
     */
    omit?: AiPromptCacheOmit<ExtArgs> | null
    /**
     * The data used to create many AiPromptCaches.
     */
    data: AiPromptCacheCreateManyInput | AiPromptCacheCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptCacheIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiPromptCache update
   */
  export type AiPromptCacheUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptCache
     */
    select?: AiPromptCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptCache
     */
    omit?: AiPromptCacheOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptCacheInclude<ExtArgs> | null
    /**
     * The data needed to update a AiPromptCache.
     */
    data: XOR<AiPromptCacheUpdateInput, AiPromptCacheUncheckedUpdateInput>
    /**
     * Choose, which AiPromptCache to update.
     */
    where: AiPromptCacheWhereUniqueInput
  }

  /**
   * AiPromptCache updateMany
   */
  export type AiPromptCacheUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiPromptCaches.
     */
    data: XOR<AiPromptCacheUpdateManyMutationInput, AiPromptCacheUncheckedUpdateManyInput>
    /**
     * Filter which AiPromptCaches to update
     */
    where?: AiPromptCacheWhereInput
    /**
     * Limit how many AiPromptCaches to update.
     */
    limit?: number
  }

  /**
   * AiPromptCache updateManyAndReturn
   */
  export type AiPromptCacheUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptCache
     */
    select?: AiPromptCacheSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptCache
     */
    omit?: AiPromptCacheOmit<ExtArgs> | null
    /**
     * The data used to update AiPromptCaches.
     */
    data: XOR<AiPromptCacheUpdateManyMutationInput, AiPromptCacheUncheckedUpdateManyInput>
    /**
     * Filter which AiPromptCaches to update
     */
    where?: AiPromptCacheWhereInput
    /**
     * Limit how many AiPromptCaches to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptCacheIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiPromptCache upsert
   */
  export type AiPromptCacheUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptCache
     */
    select?: AiPromptCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptCache
     */
    omit?: AiPromptCacheOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptCacheInclude<ExtArgs> | null
    /**
     * The filter to search for the AiPromptCache to update in case it exists.
     */
    where: AiPromptCacheWhereUniqueInput
    /**
     * In case the AiPromptCache found by the `where` argument doesn't exist, create a new AiPromptCache with this data.
     */
    create: XOR<AiPromptCacheCreateInput, AiPromptCacheUncheckedCreateInput>
    /**
     * In case the AiPromptCache was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiPromptCacheUpdateInput, AiPromptCacheUncheckedUpdateInput>
  }

  /**
   * AiPromptCache delete
   */
  export type AiPromptCacheDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptCache
     */
    select?: AiPromptCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptCache
     */
    omit?: AiPromptCacheOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptCacheInclude<ExtArgs> | null
    /**
     * Filter which AiPromptCache to delete.
     */
    where: AiPromptCacheWhereUniqueInput
  }

  /**
   * AiPromptCache deleteMany
   */
  export type AiPromptCacheDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiPromptCaches to delete
     */
    where?: AiPromptCacheWhereInput
    /**
     * Limit how many AiPromptCaches to delete.
     */
    limit?: number
  }

  /**
   * AiPromptCache without action
   */
  export type AiPromptCacheDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptCache
     */
    select?: AiPromptCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptCache
     */
    omit?: AiPromptCacheOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptCacheInclude<ExtArgs> | null
  }


  /**
   * Model AiUsageLog
   */

  export type AggregateAiUsageLog = {
    _count: AiUsageLogCountAggregateOutputType | null
    _avg: AiUsageLogAvgAggregateOutputType | null
    _sum: AiUsageLogSumAggregateOutputType | null
    _min: AiUsageLogMinAggregateOutputType | null
    _max: AiUsageLogMaxAggregateOutputType | null
  }

  export type AiUsageLogAvgAggregateOutputType = {
    inputTokens: number | null
    outputTokens: number | null
    latencyMs: number | null
  }

  export type AiUsageLogSumAggregateOutputType = {
    inputTokens: number | null
    outputTokens: number | null
    latencyMs: number | null
  }

  export type AiUsageLogMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    provider: string | null
    model: string | null
    taskType: string | null
    inputTokens: number | null
    outputTokens: number | null
    latencyMs: number | null
    success: boolean | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type AiUsageLogMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    provider: string | null
    model: string | null
    taskType: string | null
    inputTokens: number | null
    outputTokens: number | null
    latencyMs: number | null
    success: boolean | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type AiUsageLogCountAggregateOutputType = {
    id: number
    tenantId: number
    provider: number
    model: number
    taskType: number
    inputTokens: number
    outputTokens: number
    latencyMs: number
    success: number
    errorMessage: number
    createdAt: number
    _all: number
  }


  export type AiUsageLogAvgAggregateInputType = {
    inputTokens?: true
    outputTokens?: true
    latencyMs?: true
  }

  export type AiUsageLogSumAggregateInputType = {
    inputTokens?: true
    outputTokens?: true
    latencyMs?: true
  }

  export type AiUsageLogMinAggregateInputType = {
    id?: true
    tenantId?: true
    provider?: true
    model?: true
    taskType?: true
    inputTokens?: true
    outputTokens?: true
    latencyMs?: true
    success?: true
    errorMessage?: true
    createdAt?: true
  }

  export type AiUsageLogMaxAggregateInputType = {
    id?: true
    tenantId?: true
    provider?: true
    model?: true
    taskType?: true
    inputTokens?: true
    outputTokens?: true
    latencyMs?: true
    success?: true
    errorMessage?: true
    createdAt?: true
  }

  export type AiUsageLogCountAggregateInputType = {
    id?: true
    tenantId?: true
    provider?: true
    model?: true
    taskType?: true
    inputTokens?: true
    outputTokens?: true
    latencyMs?: true
    success?: true
    errorMessage?: true
    createdAt?: true
    _all?: true
  }

  export type AiUsageLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiUsageLog to aggregate.
     */
    where?: AiUsageLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsageLogs to fetch.
     */
    orderBy?: AiUsageLogOrderByWithRelationInput | AiUsageLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiUsageLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsageLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsageLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiUsageLogs
    **/
    _count?: true | AiUsageLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiUsageLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiUsageLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiUsageLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiUsageLogMaxAggregateInputType
  }

  export type GetAiUsageLogAggregateType<T extends AiUsageLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAiUsageLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiUsageLog[P]>
      : GetScalarType<T[P], AggregateAiUsageLog[P]>
  }




  export type AiUsageLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiUsageLogWhereInput
    orderBy?: AiUsageLogOrderByWithAggregationInput | AiUsageLogOrderByWithAggregationInput[]
    by: AiUsageLogScalarFieldEnum[] | AiUsageLogScalarFieldEnum
    having?: AiUsageLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiUsageLogCountAggregateInputType | true
    _avg?: AiUsageLogAvgAggregateInputType
    _sum?: AiUsageLogSumAggregateInputType
    _min?: AiUsageLogMinAggregateInputType
    _max?: AiUsageLogMaxAggregateInputType
  }

  export type AiUsageLogGroupByOutputType = {
    id: string
    tenantId: string
    provider: string
    model: string
    taskType: string
    inputTokens: number
    outputTokens: number
    latencyMs: number
    success: boolean
    errorMessage: string | null
    createdAt: Date
    _count: AiUsageLogCountAggregateOutputType | null
    _avg: AiUsageLogAvgAggregateOutputType | null
    _sum: AiUsageLogSumAggregateOutputType | null
    _min: AiUsageLogMinAggregateOutputType | null
    _max: AiUsageLogMaxAggregateOutputType | null
  }

  type GetAiUsageLogGroupByPayload<T extends AiUsageLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiUsageLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiUsageLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiUsageLogGroupByOutputType[P]>
            : GetScalarType<T[P], AiUsageLogGroupByOutputType[P]>
        }
      >
    >


  export type AiUsageLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    provider?: boolean
    model?: boolean
    taskType?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    latencyMs?: boolean
    success?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiUsageLog"]>

  export type AiUsageLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    provider?: boolean
    model?: boolean
    taskType?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    latencyMs?: boolean
    success?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiUsageLog"]>

  export type AiUsageLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    provider?: boolean
    model?: boolean
    taskType?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    latencyMs?: boolean
    success?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiUsageLog"]>

  export type AiUsageLogSelectScalar = {
    id?: boolean
    tenantId?: boolean
    provider?: boolean
    model?: boolean
    taskType?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    latencyMs?: boolean
    success?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }

  export type AiUsageLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "provider" | "model" | "taskType" | "inputTokens" | "outputTokens" | "latencyMs" | "success" | "errorMessage" | "createdAt", ExtArgs["result"]["aiUsageLog"]>
  export type AiUsageLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type AiUsageLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type AiUsageLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $AiUsageLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiUsageLog"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      provider: string
      model: string
      taskType: string
      inputTokens: number
      outputTokens: number
      latencyMs: number
      success: boolean
      errorMessage: string | null
      createdAt: Date
    }, ExtArgs["result"]["aiUsageLog"]>
    composites: {}
  }

  type AiUsageLogGetPayload<S extends boolean | null | undefined | AiUsageLogDefaultArgs> = $Result.GetResult<Prisma.$AiUsageLogPayload, S>

  type AiUsageLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiUsageLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiUsageLogCountAggregateInputType | true
    }

  export interface AiUsageLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiUsageLog'], meta: { name: 'AiUsageLog' } }
    /**
     * Find zero or one AiUsageLog that matches the filter.
     * @param {AiUsageLogFindUniqueArgs} args - Arguments to find a AiUsageLog
     * @example
     * // Get one AiUsageLog
     * const aiUsageLog = await prisma.aiUsageLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiUsageLogFindUniqueArgs>(args: SelectSubset<T, AiUsageLogFindUniqueArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiUsageLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiUsageLogFindUniqueOrThrowArgs} args - Arguments to find a AiUsageLog
     * @example
     * // Get one AiUsageLog
     * const aiUsageLog = await prisma.aiUsageLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiUsageLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AiUsageLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiUsageLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageLogFindFirstArgs} args - Arguments to find a AiUsageLog
     * @example
     * // Get one AiUsageLog
     * const aiUsageLog = await prisma.aiUsageLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiUsageLogFindFirstArgs>(args?: SelectSubset<T, AiUsageLogFindFirstArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiUsageLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageLogFindFirstOrThrowArgs} args - Arguments to find a AiUsageLog
     * @example
     * // Get one AiUsageLog
     * const aiUsageLog = await prisma.aiUsageLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiUsageLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AiUsageLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiUsageLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiUsageLogs
     * const aiUsageLogs = await prisma.aiUsageLog.findMany()
     * 
     * // Get first 10 AiUsageLogs
     * const aiUsageLogs = await prisma.aiUsageLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiUsageLogWithIdOnly = await prisma.aiUsageLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiUsageLogFindManyArgs>(args?: SelectSubset<T, AiUsageLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiUsageLog.
     * @param {AiUsageLogCreateArgs} args - Arguments to create a AiUsageLog.
     * @example
     * // Create one AiUsageLog
     * const AiUsageLog = await prisma.aiUsageLog.create({
     *   data: {
     *     // ... data to create a AiUsageLog
     *   }
     * })
     * 
     */
    create<T extends AiUsageLogCreateArgs>(args: SelectSubset<T, AiUsageLogCreateArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiUsageLogs.
     * @param {AiUsageLogCreateManyArgs} args - Arguments to create many AiUsageLogs.
     * @example
     * // Create many AiUsageLogs
     * const aiUsageLog = await prisma.aiUsageLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiUsageLogCreateManyArgs>(args?: SelectSubset<T, AiUsageLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiUsageLogs and returns the data saved in the database.
     * @param {AiUsageLogCreateManyAndReturnArgs} args - Arguments to create many AiUsageLogs.
     * @example
     * // Create many AiUsageLogs
     * const aiUsageLog = await prisma.aiUsageLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiUsageLogs and only return the `id`
     * const aiUsageLogWithIdOnly = await prisma.aiUsageLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiUsageLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AiUsageLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiUsageLog.
     * @param {AiUsageLogDeleteArgs} args - Arguments to delete one AiUsageLog.
     * @example
     * // Delete one AiUsageLog
     * const AiUsageLog = await prisma.aiUsageLog.delete({
     *   where: {
     *     // ... filter to delete one AiUsageLog
     *   }
     * })
     * 
     */
    delete<T extends AiUsageLogDeleteArgs>(args: SelectSubset<T, AiUsageLogDeleteArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiUsageLog.
     * @param {AiUsageLogUpdateArgs} args - Arguments to update one AiUsageLog.
     * @example
     * // Update one AiUsageLog
     * const aiUsageLog = await prisma.aiUsageLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiUsageLogUpdateArgs>(args: SelectSubset<T, AiUsageLogUpdateArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiUsageLogs.
     * @param {AiUsageLogDeleteManyArgs} args - Arguments to filter AiUsageLogs to delete.
     * @example
     * // Delete a few AiUsageLogs
     * const { count } = await prisma.aiUsageLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiUsageLogDeleteManyArgs>(args?: SelectSubset<T, AiUsageLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiUsageLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiUsageLogs
     * const aiUsageLog = await prisma.aiUsageLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiUsageLogUpdateManyArgs>(args: SelectSubset<T, AiUsageLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiUsageLogs and returns the data updated in the database.
     * @param {AiUsageLogUpdateManyAndReturnArgs} args - Arguments to update many AiUsageLogs.
     * @example
     * // Update many AiUsageLogs
     * const aiUsageLog = await prisma.aiUsageLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiUsageLogs and only return the `id`
     * const aiUsageLogWithIdOnly = await prisma.aiUsageLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiUsageLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AiUsageLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiUsageLog.
     * @param {AiUsageLogUpsertArgs} args - Arguments to update or create a AiUsageLog.
     * @example
     * // Update or create a AiUsageLog
     * const aiUsageLog = await prisma.aiUsageLog.upsert({
     *   create: {
     *     // ... data to create a AiUsageLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiUsageLog we want to update
     *   }
     * })
     */
    upsert<T extends AiUsageLogUpsertArgs>(args: SelectSubset<T, AiUsageLogUpsertArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiUsageLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageLogCountArgs} args - Arguments to filter AiUsageLogs to count.
     * @example
     * // Count the number of AiUsageLogs
     * const count = await prisma.aiUsageLog.count({
     *   where: {
     *     // ... the filter for the AiUsageLogs we want to count
     *   }
     * })
    **/
    count<T extends AiUsageLogCountArgs>(
      args?: Subset<T, AiUsageLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiUsageLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiUsageLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiUsageLogAggregateArgs>(args: Subset<T, AiUsageLogAggregateArgs>): Prisma.PrismaPromise<GetAiUsageLogAggregateType<T>>

    /**
     * Group by AiUsageLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiUsageLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiUsageLogGroupByArgs['orderBy'] }
        : { orderBy?: AiUsageLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiUsageLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiUsageLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiUsageLog model
   */
  readonly fields: AiUsageLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiUsageLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiUsageLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiUsageLog model
   */
  interface AiUsageLogFieldRefs {
    readonly id: FieldRef<"AiUsageLog", 'String'>
    readonly tenantId: FieldRef<"AiUsageLog", 'String'>
    readonly provider: FieldRef<"AiUsageLog", 'String'>
    readonly model: FieldRef<"AiUsageLog", 'String'>
    readonly taskType: FieldRef<"AiUsageLog", 'String'>
    readonly inputTokens: FieldRef<"AiUsageLog", 'Int'>
    readonly outputTokens: FieldRef<"AiUsageLog", 'Int'>
    readonly latencyMs: FieldRef<"AiUsageLog", 'Int'>
    readonly success: FieldRef<"AiUsageLog", 'Boolean'>
    readonly errorMessage: FieldRef<"AiUsageLog", 'String'>
    readonly createdAt: FieldRef<"AiUsageLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiUsageLog findUnique
   */
  export type AiUsageLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageLogInclude<ExtArgs> | null
    /**
     * Filter, which AiUsageLog to fetch.
     */
    where: AiUsageLogWhereUniqueInput
  }

  /**
   * AiUsageLog findUniqueOrThrow
   */
  export type AiUsageLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageLogInclude<ExtArgs> | null
    /**
     * Filter, which AiUsageLog to fetch.
     */
    where: AiUsageLogWhereUniqueInput
  }

  /**
   * AiUsageLog findFirst
   */
  export type AiUsageLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageLogInclude<ExtArgs> | null
    /**
     * Filter, which AiUsageLog to fetch.
     */
    where?: AiUsageLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsageLogs to fetch.
     */
    orderBy?: AiUsageLogOrderByWithRelationInput | AiUsageLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiUsageLogs.
     */
    cursor?: AiUsageLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsageLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsageLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiUsageLogs.
     */
    distinct?: AiUsageLogScalarFieldEnum | AiUsageLogScalarFieldEnum[]
  }

  /**
   * AiUsageLog findFirstOrThrow
   */
  export type AiUsageLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageLogInclude<ExtArgs> | null
    /**
     * Filter, which AiUsageLog to fetch.
     */
    where?: AiUsageLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsageLogs to fetch.
     */
    orderBy?: AiUsageLogOrderByWithRelationInput | AiUsageLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiUsageLogs.
     */
    cursor?: AiUsageLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsageLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsageLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiUsageLogs.
     */
    distinct?: AiUsageLogScalarFieldEnum | AiUsageLogScalarFieldEnum[]
  }

  /**
   * AiUsageLog findMany
   */
  export type AiUsageLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageLogInclude<ExtArgs> | null
    /**
     * Filter, which AiUsageLogs to fetch.
     */
    where?: AiUsageLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsageLogs to fetch.
     */
    orderBy?: AiUsageLogOrderByWithRelationInput | AiUsageLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiUsageLogs.
     */
    cursor?: AiUsageLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsageLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsageLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiUsageLogs.
     */
    distinct?: AiUsageLogScalarFieldEnum | AiUsageLogScalarFieldEnum[]
  }

  /**
   * AiUsageLog create
   */
  export type AiUsageLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AiUsageLog.
     */
    data: XOR<AiUsageLogCreateInput, AiUsageLogUncheckedCreateInput>
  }

  /**
   * AiUsageLog createMany
   */
  export type AiUsageLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiUsageLogs.
     */
    data: AiUsageLogCreateManyInput | AiUsageLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiUsageLog createManyAndReturn
   */
  export type AiUsageLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * The data used to create many AiUsageLogs.
     */
    data: AiUsageLogCreateManyInput | AiUsageLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiUsageLog update
   */
  export type AiUsageLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AiUsageLog.
     */
    data: XOR<AiUsageLogUpdateInput, AiUsageLogUncheckedUpdateInput>
    /**
     * Choose, which AiUsageLog to update.
     */
    where: AiUsageLogWhereUniqueInput
  }

  /**
   * AiUsageLog updateMany
   */
  export type AiUsageLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiUsageLogs.
     */
    data: XOR<AiUsageLogUpdateManyMutationInput, AiUsageLogUncheckedUpdateManyInput>
    /**
     * Filter which AiUsageLogs to update
     */
    where?: AiUsageLogWhereInput
    /**
     * Limit how many AiUsageLogs to update.
     */
    limit?: number
  }

  /**
   * AiUsageLog updateManyAndReturn
   */
  export type AiUsageLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * The data used to update AiUsageLogs.
     */
    data: XOR<AiUsageLogUpdateManyMutationInput, AiUsageLogUncheckedUpdateManyInput>
    /**
     * Filter which AiUsageLogs to update
     */
    where?: AiUsageLogWhereInput
    /**
     * Limit how many AiUsageLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiUsageLog upsert
   */
  export type AiUsageLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AiUsageLog to update in case it exists.
     */
    where: AiUsageLogWhereUniqueInput
    /**
     * In case the AiUsageLog found by the `where` argument doesn't exist, create a new AiUsageLog with this data.
     */
    create: XOR<AiUsageLogCreateInput, AiUsageLogUncheckedCreateInput>
    /**
     * In case the AiUsageLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiUsageLogUpdateInput, AiUsageLogUncheckedUpdateInput>
  }

  /**
   * AiUsageLog delete
   */
  export type AiUsageLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageLogInclude<ExtArgs> | null
    /**
     * Filter which AiUsageLog to delete.
     */
    where: AiUsageLogWhereUniqueInput
  }

  /**
   * AiUsageLog deleteMany
   */
  export type AiUsageLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiUsageLogs to delete
     */
    where?: AiUsageLogWhereInput
    /**
     * Limit how many AiUsageLogs to delete.
     */
    limit?: number
  }

  /**
   * AiUsageLog without action
   */
  export type AiUsageLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TenantScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    emailVerified: 'emailVerified',
    verificationToken: 'verificationToken',
    verificationTokenExpires: 'verificationTokenExpires',
    passwordResetToken: 'passwordResetToken',
    passwordResetTokenExpires: 'passwordResetTokenExpires',
    tenantId: 'tenantId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AiProviderConfigScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    provider: 'provider',
    modelName: 'modelName',
    isEnabled: 'isEnabled',
    priority: 'priority',
    config: 'config',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AiProviderConfigScalarFieldEnum = (typeof AiProviderConfigScalarFieldEnum)[keyof typeof AiProviderConfigScalarFieldEnum]


  export const AiPromptCacheScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    promptHash: 'promptHash',
    taskType: 'taskType',
    response: 'response',
    tokensUsed: 'tokensUsed',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt'
  };

  export type AiPromptCacheScalarFieldEnum = (typeof AiPromptCacheScalarFieldEnum)[keyof typeof AiPromptCacheScalarFieldEnum]


  export const AiUsageLogScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    provider: 'provider',
    model: 'model',
    taskType: 'taskType',
    inputTokens: 'inputTokens',
    outputTokens: 'outputTokens',
    latencyMs: 'latencyMs',
    success: 'success',
    errorMessage: 'errorMessage',
    createdAt: 'createdAt'
  };

  export type AiUsageLogScalarFieldEnum = (typeof AiUsageLogScalarFieldEnum)[keyof typeof AiUsageLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const TenantOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type TenantOrderByRelevanceFieldEnum = (typeof TenantOrderByRelevanceFieldEnum)[keyof typeof TenantOrderByRelevanceFieldEnum]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const UserOrderByRelevanceFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    verificationToken: 'verificationToken',
    passwordResetToken: 'passwordResetToken',
    tenantId: 'tenantId'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const AiProviderConfigOrderByRelevanceFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    provider: 'provider',
    modelName: 'modelName'
  };

  export type AiProviderConfigOrderByRelevanceFieldEnum = (typeof AiProviderConfigOrderByRelevanceFieldEnum)[keyof typeof AiProviderConfigOrderByRelevanceFieldEnum]


  export const AiPromptCacheOrderByRelevanceFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    promptHash: 'promptHash',
    taskType: 'taskType'
  };

  export type AiPromptCacheOrderByRelevanceFieldEnum = (typeof AiPromptCacheOrderByRelevanceFieldEnum)[keyof typeof AiPromptCacheOrderByRelevanceFieldEnum]


  export const AiUsageLogOrderByRelevanceFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    provider: 'provider',
    model: 'model',
    taskType: 'taskType',
    errorMessage: 'errorMessage'
  };

  export type AiUsageLogOrderByRelevanceFieldEnum = (typeof AiUsageLogOrderByRelevanceFieldEnum)[keyof typeof AiUsageLogOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: StringFilter<"Tenant"> | string
    name?: StringFilter<"Tenant"> | string
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    users?: UserListRelationFilter
    aiProviderConfigs?: AiProviderConfigListRelationFilter
    aiPromptCache?: AiPromptCacheListRelationFilter
    aiUsageLogs?: AiUsageLogListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    users?: UserOrderByRelationAggregateInput
    aiProviderConfigs?: AiProviderConfigOrderByRelationAggregateInput
    aiPromptCache?: AiPromptCacheOrderByRelationAggregateInput
    aiUsageLogs?: AiUsageLogOrderByRelationAggregateInput
    _relevance?: TenantOrderByRelevanceInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    name?: StringFilter<"Tenant"> | string
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    users?: UserListRelationFilter
    aiProviderConfigs?: AiProviderConfigListRelationFilter
    aiPromptCache?: AiPromptCacheListRelationFilter
    aiUsageLogs?: AiUsageLogListRelationFilter
  }, "id">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TenantCountOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tenant"> | string
    name?: StringWithAggregatesFilter<"Tenant"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: BoolFilter<"User"> | boolean
    verificationToken?: StringNullableFilter<"User"> | string | null
    verificationTokenExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    passwordResetToken?: StringNullableFilter<"User"> | string | null
    passwordResetTokenExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    tenantId?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrderInput | SortOrder
    emailVerified?: SortOrder
    verificationToken?: SortOrderInput | SortOrder
    verificationTokenExpires?: SortOrderInput | SortOrder
    passwordResetToken?: SortOrderInput | SortOrder
    passwordResetTokenExpires?: SortOrderInput | SortOrder
    tenantId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: BoolFilter<"User"> | boolean
    verificationToken?: StringNullableFilter<"User"> | string | null
    verificationTokenExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    passwordResetToken?: StringNullableFilter<"User"> | string | null
    passwordResetTokenExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    tenantId?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrderInput | SortOrder
    emailVerified?: SortOrder
    verificationToken?: SortOrderInput | SortOrder
    verificationTokenExpires?: SortOrderInput | SortOrder
    passwordResetToken?: SortOrderInput | SortOrder
    passwordResetTokenExpires?: SortOrderInput | SortOrder
    tenantId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    verificationToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    verificationTokenExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    passwordResetToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    passwordResetTokenExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    tenantId?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AiProviderConfigWhereInput = {
    AND?: AiProviderConfigWhereInput | AiProviderConfigWhereInput[]
    OR?: AiProviderConfigWhereInput[]
    NOT?: AiProviderConfigWhereInput | AiProviderConfigWhereInput[]
    id?: StringFilter<"AiProviderConfig"> | string
    tenantId?: StringFilter<"AiProviderConfig"> | string
    provider?: StringFilter<"AiProviderConfig"> | string
    modelName?: StringFilter<"AiProviderConfig"> | string
    isEnabled?: BoolFilter<"AiProviderConfig"> | boolean
    priority?: IntFilter<"AiProviderConfig"> | number
    config?: JsonNullableFilter<"AiProviderConfig">
    createdAt?: DateTimeFilter<"AiProviderConfig"> | Date | string
    updatedAt?: DateTimeFilter<"AiProviderConfig"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type AiProviderConfigOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    provider?: SortOrder
    modelName?: SortOrder
    isEnabled?: SortOrder
    priority?: SortOrder
    config?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    _relevance?: AiProviderConfigOrderByRelevanceInput
  }

  export type AiProviderConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiProviderConfigWhereInput | AiProviderConfigWhereInput[]
    OR?: AiProviderConfigWhereInput[]
    NOT?: AiProviderConfigWhereInput | AiProviderConfigWhereInput[]
    tenantId?: StringFilter<"AiProviderConfig"> | string
    provider?: StringFilter<"AiProviderConfig"> | string
    modelName?: StringFilter<"AiProviderConfig"> | string
    isEnabled?: BoolFilter<"AiProviderConfig"> | boolean
    priority?: IntFilter<"AiProviderConfig"> | number
    config?: JsonNullableFilter<"AiProviderConfig">
    createdAt?: DateTimeFilter<"AiProviderConfig"> | Date | string
    updatedAt?: DateTimeFilter<"AiProviderConfig"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id">

  export type AiProviderConfigOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    provider?: SortOrder
    modelName?: SortOrder
    isEnabled?: SortOrder
    priority?: SortOrder
    config?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AiProviderConfigCountOrderByAggregateInput
    _avg?: AiProviderConfigAvgOrderByAggregateInput
    _max?: AiProviderConfigMaxOrderByAggregateInput
    _min?: AiProviderConfigMinOrderByAggregateInput
    _sum?: AiProviderConfigSumOrderByAggregateInput
  }

  export type AiProviderConfigScalarWhereWithAggregatesInput = {
    AND?: AiProviderConfigScalarWhereWithAggregatesInput | AiProviderConfigScalarWhereWithAggregatesInput[]
    OR?: AiProviderConfigScalarWhereWithAggregatesInput[]
    NOT?: AiProviderConfigScalarWhereWithAggregatesInput | AiProviderConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiProviderConfig"> | string
    tenantId?: StringWithAggregatesFilter<"AiProviderConfig"> | string
    provider?: StringWithAggregatesFilter<"AiProviderConfig"> | string
    modelName?: StringWithAggregatesFilter<"AiProviderConfig"> | string
    isEnabled?: BoolWithAggregatesFilter<"AiProviderConfig"> | boolean
    priority?: IntWithAggregatesFilter<"AiProviderConfig"> | number
    config?: JsonNullableWithAggregatesFilter<"AiProviderConfig">
    createdAt?: DateTimeWithAggregatesFilter<"AiProviderConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AiProviderConfig"> | Date | string
  }

  export type AiPromptCacheWhereInput = {
    AND?: AiPromptCacheWhereInput | AiPromptCacheWhereInput[]
    OR?: AiPromptCacheWhereInput[]
    NOT?: AiPromptCacheWhereInput | AiPromptCacheWhereInput[]
    id?: StringFilter<"AiPromptCache"> | string
    tenantId?: StringFilter<"AiPromptCache"> | string
    promptHash?: StringFilter<"AiPromptCache"> | string
    taskType?: StringFilter<"AiPromptCache"> | string
    response?: JsonFilter<"AiPromptCache">
    tokensUsed?: IntFilter<"AiPromptCache"> | number
    createdAt?: DateTimeFilter<"AiPromptCache"> | Date | string
    expiresAt?: DateTimeFilter<"AiPromptCache"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type AiPromptCacheOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    promptHash?: SortOrder
    taskType?: SortOrder
    response?: SortOrder
    tokensUsed?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    _relevance?: AiPromptCacheOrderByRelevanceInput
  }

  export type AiPromptCacheWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_promptHash?: AiPromptCacheTenantIdPromptHashCompoundUniqueInput
    AND?: AiPromptCacheWhereInput | AiPromptCacheWhereInput[]
    OR?: AiPromptCacheWhereInput[]
    NOT?: AiPromptCacheWhereInput | AiPromptCacheWhereInput[]
    tenantId?: StringFilter<"AiPromptCache"> | string
    promptHash?: StringFilter<"AiPromptCache"> | string
    taskType?: StringFilter<"AiPromptCache"> | string
    response?: JsonFilter<"AiPromptCache">
    tokensUsed?: IntFilter<"AiPromptCache"> | number
    createdAt?: DateTimeFilter<"AiPromptCache"> | Date | string
    expiresAt?: DateTimeFilter<"AiPromptCache"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "tenantId_promptHash">

  export type AiPromptCacheOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    promptHash?: SortOrder
    taskType?: SortOrder
    response?: SortOrder
    tokensUsed?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    _count?: AiPromptCacheCountOrderByAggregateInput
    _avg?: AiPromptCacheAvgOrderByAggregateInput
    _max?: AiPromptCacheMaxOrderByAggregateInput
    _min?: AiPromptCacheMinOrderByAggregateInput
    _sum?: AiPromptCacheSumOrderByAggregateInput
  }

  export type AiPromptCacheScalarWhereWithAggregatesInput = {
    AND?: AiPromptCacheScalarWhereWithAggregatesInput | AiPromptCacheScalarWhereWithAggregatesInput[]
    OR?: AiPromptCacheScalarWhereWithAggregatesInput[]
    NOT?: AiPromptCacheScalarWhereWithAggregatesInput | AiPromptCacheScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiPromptCache"> | string
    tenantId?: StringWithAggregatesFilter<"AiPromptCache"> | string
    promptHash?: StringWithAggregatesFilter<"AiPromptCache"> | string
    taskType?: StringWithAggregatesFilter<"AiPromptCache"> | string
    response?: JsonWithAggregatesFilter<"AiPromptCache">
    tokensUsed?: IntWithAggregatesFilter<"AiPromptCache"> | number
    createdAt?: DateTimeWithAggregatesFilter<"AiPromptCache"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"AiPromptCache"> | Date | string
  }

  export type AiUsageLogWhereInput = {
    AND?: AiUsageLogWhereInput | AiUsageLogWhereInput[]
    OR?: AiUsageLogWhereInput[]
    NOT?: AiUsageLogWhereInput | AiUsageLogWhereInput[]
    id?: StringFilter<"AiUsageLog"> | string
    tenantId?: StringFilter<"AiUsageLog"> | string
    provider?: StringFilter<"AiUsageLog"> | string
    model?: StringFilter<"AiUsageLog"> | string
    taskType?: StringFilter<"AiUsageLog"> | string
    inputTokens?: IntFilter<"AiUsageLog"> | number
    outputTokens?: IntFilter<"AiUsageLog"> | number
    latencyMs?: IntFilter<"AiUsageLog"> | number
    success?: BoolFilter<"AiUsageLog"> | boolean
    errorMessage?: StringNullableFilter<"AiUsageLog"> | string | null
    createdAt?: DateTimeFilter<"AiUsageLog"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type AiUsageLogOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    taskType?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    latencyMs?: SortOrder
    success?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    _relevance?: AiUsageLogOrderByRelevanceInput
  }

  export type AiUsageLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiUsageLogWhereInput | AiUsageLogWhereInput[]
    OR?: AiUsageLogWhereInput[]
    NOT?: AiUsageLogWhereInput | AiUsageLogWhereInput[]
    tenantId?: StringFilter<"AiUsageLog"> | string
    provider?: StringFilter<"AiUsageLog"> | string
    model?: StringFilter<"AiUsageLog"> | string
    taskType?: StringFilter<"AiUsageLog"> | string
    inputTokens?: IntFilter<"AiUsageLog"> | number
    outputTokens?: IntFilter<"AiUsageLog"> | number
    latencyMs?: IntFilter<"AiUsageLog"> | number
    success?: BoolFilter<"AiUsageLog"> | boolean
    errorMessage?: StringNullableFilter<"AiUsageLog"> | string | null
    createdAt?: DateTimeFilter<"AiUsageLog"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id">

  export type AiUsageLogOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    taskType?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    latencyMs?: SortOrder
    success?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AiUsageLogCountOrderByAggregateInput
    _avg?: AiUsageLogAvgOrderByAggregateInput
    _max?: AiUsageLogMaxOrderByAggregateInput
    _min?: AiUsageLogMinOrderByAggregateInput
    _sum?: AiUsageLogSumOrderByAggregateInput
  }

  export type AiUsageLogScalarWhereWithAggregatesInput = {
    AND?: AiUsageLogScalarWhereWithAggregatesInput | AiUsageLogScalarWhereWithAggregatesInput[]
    OR?: AiUsageLogScalarWhereWithAggregatesInput[]
    NOT?: AiUsageLogScalarWhereWithAggregatesInput | AiUsageLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiUsageLog"> | string
    tenantId?: StringWithAggregatesFilter<"AiUsageLog"> | string
    provider?: StringWithAggregatesFilter<"AiUsageLog"> | string
    model?: StringWithAggregatesFilter<"AiUsageLog"> | string
    taskType?: StringWithAggregatesFilter<"AiUsageLog"> | string
    inputTokens?: IntWithAggregatesFilter<"AiUsageLog"> | number
    outputTokens?: IntWithAggregatesFilter<"AiUsageLog"> | number
    latencyMs?: IntWithAggregatesFilter<"AiUsageLog"> | number
    success?: BoolWithAggregatesFilter<"AiUsageLog"> | boolean
    errorMessage?: StringNullableWithAggregatesFilter<"AiUsageLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AiUsageLog"> | Date | string
  }

  export type TenantCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    aiProviderConfigs?: AiProviderConfigCreateNestedManyWithoutTenantInput
    aiPromptCache?: AiPromptCacheCreateNestedManyWithoutTenantInput
    aiUsageLogs?: AiUsageLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    aiProviderConfigs?: AiProviderConfigUncheckedCreateNestedManyWithoutTenantInput
    aiPromptCache?: AiPromptCacheUncheckedCreateNestedManyWithoutTenantInput
    aiUsageLogs?: AiUsageLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    aiProviderConfigs?: AiProviderConfigUpdateManyWithoutTenantNestedInput
    aiPromptCache?: AiPromptCacheUpdateManyWithoutTenantNestedInput
    aiUsageLogs?: AiUsageLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    aiProviderConfigs?: AiProviderConfigUncheckedUpdateManyWithoutTenantNestedInput
    aiPromptCache?: AiPromptCacheUncheckedUpdateManyWithoutTenantNestedInput
    aiUsageLogs?: AiUsageLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    emailVerified?: boolean
    verificationToken?: string | null
    verificationTokenExpires?: Date | string | null
    passwordResetToken?: string | null
    passwordResetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    emailVerified?: boolean
    verificationToken?: string | null
    verificationTokenExpires?: Date | string | null
    passwordResetToken?: string | null
    passwordResetTokenExpires?: Date | string | null
    tenantId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenantId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    emailVerified?: boolean
    verificationToken?: string | null
    verificationTokenExpires?: Date | string | null
    passwordResetToken?: string | null
    passwordResetTokenExpires?: Date | string | null
    tenantId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenantId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiProviderConfigCreateInput = {
    id?: string
    provider: string
    modelName: string
    isEnabled?: boolean
    priority?: number
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutAiProviderConfigsInput
  }

  export type AiProviderConfigUncheckedCreateInput = {
    id?: string
    tenantId: string
    provider: string
    modelName: string
    isEnabled?: boolean
    priority?: number
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiProviderConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    modelName?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutAiProviderConfigsNestedInput
  }

  export type AiProviderConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    modelName?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiProviderConfigCreateManyInput = {
    id?: string
    tenantId: string
    provider: string
    modelName: string
    isEnabled?: boolean
    priority?: number
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiProviderConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    modelName?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiProviderConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    modelName?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiPromptCacheCreateInput = {
    id?: string
    promptHash: string
    taskType: string
    response: JsonNullValueInput | InputJsonValue
    tokensUsed: number
    createdAt?: Date | string
    expiresAt: Date | string
    tenant: TenantCreateNestedOneWithoutAiPromptCacheInput
  }

  export type AiPromptCacheUncheckedCreateInput = {
    id?: string
    tenantId: string
    promptHash: string
    taskType: string
    response: JsonNullValueInput | InputJsonValue
    tokensUsed: number
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type AiPromptCacheUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    promptHash?: StringFieldUpdateOperationsInput | string
    taskType?: StringFieldUpdateOperationsInput | string
    response?: JsonNullValueInput | InputJsonValue
    tokensUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutAiPromptCacheNestedInput
  }

  export type AiPromptCacheUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    promptHash?: StringFieldUpdateOperationsInput | string
    taskType?: StringFieldUpdateOperationsInput | string
    response?: JsonNullValueInput | InputJsonValue
    tokensUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiPromptCacheCreateManyInput = {
    id?: string
    tenantId: string
    promptHash: string
    taskType: string
    response: JsonNullValueInput | InputJsonValue
    tokensUsed: number
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type AiPromptCacheUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    promptHash?: StringFieldUpdateOperationsInput | string
    taskType?: StringFieldUpdateOperationsInput | string
    response?: JsonNullValueInput | InputJsonValue
    tokensUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiPromptCacheUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    promptHash?: StringFieldUpdateOperationsInput | string
    taskType?: StringFieldUpdateOperationsInput | string
    response?: JsonNullValueInput | InputJsonValue
    tokensUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageLogCreateInput = {
    id?: string
    provider: string
    model: string
    taskType: string
    inputTokens: number
    outputTokens: number
    latencyMs: number
    success: boolean
    errorMessage?: string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutAiUsageLogsInput
  }

  export type AiUsageLogUncheckedCreateInput = {
    id?: string
    tenantId: string
    provider: string
    model: string
    taskType: string
    inputTokens: number
    outputTokens: number
    latencyMs: number
    success: boolean
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AiUsageLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    taskType?: StringFieldUpdateOperationsInput | string
    inputTokens?: IntFieldUpdateOperationsInput | number
    outputTokens?: IntFieldUpdateOperationsInput | number
    latencyMs?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutAiUsageLogsNestedInput
  }

  export type AiUsageLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    taskType?: StringFieldUpdateOperationsInput | string
    inputTokens?: IntFieldUpdateOperationsInput | number
    outputTokens?: IntFieldUpdateOperationsInput | number
    latencyMs?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageLogCreateManyInput = {
    id?: string
    tenantId: string
    provider: string
    model: string
    taskType: string
    inputTokens: number
    outputTokens: number
    latencyMs: number
    success: boolean
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AiUsageLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    taskType?: StringFieldUpdateOperationsInput | string
    inputTokens?: IntFieldUpdateOperationsInput | number
    outputTokens?: IntFieldUpdateOperationsInput | number
    latencyMs?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    taskType?: StringFieldUpdateOperationsInput | string
    inputTokens?: IntFieldUpdateOperationsInput | number
    outputTokens?: IntFieldUpdateOperationsInput | number
    latencyMs?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type AiProviderConfigListRelationFilter = {
    every?: AiProviderConfigWhereInput
    some?: AiProviderConfigWhereInput
    none?: AiProviderConfigWhereInput
  }

  export type AiPromptCacheListRelationFilter = {
    every?: AiPromptCacheWhereInput
    some?: AiPromptCacheWhereInput
    none?: AiPromptCacheWhereInput
  }

  export type AiUsageLogListRelationFilter = {
    every?: AiUsageLogWhereInput
    some?: AiUsageLogWhereInput
    none?: AiUsageLogWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AiProviderConfigOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AiPromptCacheOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AiUsageLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantOrderByRelevanceInput = {
    fields: TenantOrderByRelevanceFieldEnum | TenantOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TenantScalarRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    emailVerified?: SortOrder
    verificationToken?: SortOrder
    verificationTokenExpires?: SortOrder
    passwordResetToken?: SortOrder
    passwordResetTokenExpires?: SortOrder
    tenantId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    emailVerified?: SortOrder
    verificationToken?: SortOrder
    verificationTokenExpires?: SortOrder
    passwordResetToken?: SortOrder
    passwordResetTokenExpires?: SortOrder
    tenantId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    emailVerified?: SortOrder
    verificationToken?: SortOrder
    verificationTokenExpires?: SortOrder
    passwordResetToken?: SortOrder
    passwordResetTokenExpires?: SortOrder
    tenantId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AiProviderConfigOrderByRelevanceInput = {
    fields: AiProviderConfigOrderByRelevanceFieldEnum | AiProviderConfigOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AiProviderConfigCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    provider?: SortOrder
    modelName?: SortOrder
    isEnabled?: SortOrder
    priority?: SortOrder
    config?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiProviderConfigAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type AiProviderConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    provider?: SortOrder
    modelName?: SortOrder
    isEnabled?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiProviderConfigMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    provider?: SortOrder
    modelName?: SortOrder
    isEnabled?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiProviderConfigSumOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AiPromptCacheOrderByRelevanceInput = {
    fields: AiPromptCacheOrderByRelevanceFieldEnum | AiPromptCacheOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AiPromptCacheTenantIdPromptHashCompoundUniqueInput = {
    tenantId: string
    promptHash: string
  }

  export type AiPromptCacheCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    promptHash?: SortOrder
    taskType?: SortOrder
    response?: SortOrder
    tokensUsed?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type AiPromptCacheAvgOrderByAggregateInput = {
    tokensUsed?: SortOrder
  }

  export type AiPromptCacheMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    promptHash?: SortOrder
    taskType?: SortOrder
    tokensUsed?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type AiPromptCacheMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    promptHash?: SortOrder
    taskType?: SortOrder
    tokensUsed?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type AiPromptCacheSumOrderByAggregateInput = {
    tokensUsed?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type AiUsageLogOrderByRelevanceInput = {
    fields: AiUsageLogOrderByRelevanceFieldEnum | AiUsageLogOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AiUsageLogCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    taskType?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    latencyMs?: SortOrder
    success?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AiUsageLogAvgOrderByAggregateInput = {
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    latencyMs?: SortOrder
  }

  export type AiUsageLogMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    taskType?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    latencyMs?: SortOrder
    success?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AiUsageLogMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    taskType?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    latencyMs?: SortOrder
    success?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AiUsageLogSumOrderByAggregateInput = {
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    latencyMs?: SortOrder
  }

  export type UserCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type AiProviderConfigCreateNestedManyWithoutTenantInput = {
    create?: XOR<AiProviderConfigCreateWithoutTenantInput, AiProviderConfigUncheckedCreateWithoutTenantInput> | AiProviderConfigCreateWithoutTenantInput[] | AiProviderConfigUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AiProviderConfigCreateOrConnectWithoutTenantInput | AiProviderConfigCreateOrConnectWithoutTenantInput[]
    createMany?: AiProviderConfigCreateManyTenantInputEnvelope
    connect?: AiProviderConfigWhereUniqueInput | AiProviderConfigWhereUniqueInput[]
  }

  export type AiPromptCacheCreateNestedManyWithoutTenantInput = {
    create?: XOR<AiPromptCacheCreateWithoutTenantInput, AiPromptCacheUncheckedCreateWithoutTenantInput> | AiPromptCacheCreateWithoutTenantInput[] | AiPromptCacheUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AiPromptCacheCreateOrConnectWithoutTenantInput | AiPromptCacheCreateOrConnectWithoutTenantInput[]
    createMany?: AiPromptCacheCreateManyTenantInputEnvelope
    connect?: AiPromptCacheWhereUniqueInput | AiPromptCacheWhereUniqueInput[]
  }

  export type AiUsageLogCreateNestedManyWithoutTenantInput = {
    create?: XOR<AiUsageLogCreateWithoutTenantInput, AiUsageLogUncheckedCreateWithoutTenantInput> | AiUsageLogCreateWithoutTenantInput[] | AiUsageLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AiUsageLogCreateOrConnectWithoutTenantInput | AiUsageLogCreateOrConnectWithoutTenantInput[]
    createMany?: AiUsageLogCreateManyTenantInputEnvelope
    connect?: AiUsageLogWhereUniqueInput | AiUsageLogWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type AiProviderConfigUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<AiProviderConfigCreateWithoutTenantInput, AiProviderConfigUncheckedCreateWithoutTenantInput> | AiProviderConfigCreateWithoutTenantInput[] | AiProviderConfigUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AiProviderConfigCreateOrConnectWithoutTenantInput | AiProviderConfigCreateOrConnectWithoutTenantInput[]
    createMany?: AiProviderConfigCreateManyTenantInputEnvelope
    connect?: AiProviderConfigWhereUniqueInput | AiProviderConfigWhereUniqueInput[]
  }

  export type AiPromptCacheUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<AiPromptCacheCreateWithoutTenantInput, AiPromptCacheUncheckedCreateWithoutTenantInput> | AiPromptCacheCreateWithoutTenantInput[] | AiPromptCacheUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AiPromptCacheCreateOrConnectWithoutTenantInput | AiPromptCacheCreateOrConnectWithoutTenantInput[]
    createMany?: AiPromptCacheCreateManyTenantInputEnvelope
    connect?: AiPromptCacheWhereUniqueInput | AiPromptCacheWhereUniqueInput[]
  }

  export type AiUsageLogUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<AiUsageLogCreateWithoutTenantInput, AiUsageLogUncheckedCreateWithoutTenantInput> | AiUsageLogCreateWithoutTenantInput[] | AiUsageLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AiUsageLogCreateOrConnectWithoutTenantInput | AiUsageLogCreateOrConnectWithoutTenantInput[]
    createMany?: AiUsageLogCreateManyTenantInputEnvelope
    connect?: AiUsageLogWhereUniqueInput | AiUsageLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTenantInput | UserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTenantInput | UserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTenantInput | UserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type AiProviderConfigUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AiProviderConfigCreateWithoutTenantInput, AiProviderConfigUncheckedCreateWithoutTenantInput> | AiProviderConfigCreateWithoutTenantInput[] | AiProviderConfigUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AiProviderConfigCreateOrConnectWithoutTenantInput | AiProviderConfigCreateOrConnectWithoutTenantInput[]
    upsert?: AiProviderConfigUpsertWithWhereUniqueWithoutTenantInput | AiProviderConfigUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AiProviderConfigCreateManyTenantInputEnvelope
    set?: AiProviderConfigWhereUniqueInput | AiProviderConfigWhereUniqueInput[]
    disconnect?: AiProviderConfigWhereUniqueInput | AiProviderConfigWhereUniqueInput[]
    delete?: AiProviderConfigWhereUniqueInput | AiProviderConfigWhereUniqueInput[]
    connect?: AiProviderConfigWhereUniqueInput | AiProviderConfigWhereUniqueInput[]
    update?: AiProviderConfigUpdateWithWhereUniqueWithoutTenantInput | AiProviderConfigUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AiProviderConfigUpdateManyWithWhereWithoutTenantInput | AiProviderConfigUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AiProviderConfigScalarWhereInput | AiProviderConfigScalarWhereInput[]
  }

  export type AiPromptCacheUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AiPromptCacheCreateWithoutTenantInput, AiPromptCacheUncheckedCreateWithoutTenantInput> | AiPromptCacheCreateWithoutTenantInput[] | AiPromptCacheUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AiPromptCacheCreateOrConnectWithoutTenantInput | AiPromptCacheCreateOrConnectWithoutTenantInput[]
    upsert?: AiPromptCacheUpsertWithWhereUniqueWithoutTenantInput | AiPromptCacheUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AiPromptCacheCreateManyTenantInputEnvelope
    set?: AiPromptCacheWhereUniqueInput | AiPromptCacheWhereUniqueInput[]
    disconnect?: AiPromptCacheWhereUniqueInput | AiPromptCacheWhereUniqueInput[]
    delete?: AiPromptCacheWhereUniqueInput | AiPromptCacheWhereUniqueInput[]
    connect?: AiPromptCacheWhereUniqueInput | AiPromptCacheWhereUniqueInput[]
    update?: AiPromptCacheUpdateWithWhereUniqueWithoutTenantInput | AiPromptCacheUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AiPromptCacheUpdateManyWithWhereWithoutTenantInput | AiPromptCacheUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AiPromptCacheScalarWhereInput | AiPromptCacheScalarWhereInput[]
  }

  export type AiUsageLogUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AiUsageLogCreateWithoutTenantInput, AiUsageLogUncheckedCreateWithoutTenantInput> | AiUsageLogCreateWithoutTenantInput[] | AiUsageLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AiUsageLogCreateOrConnectWithoutTenantInput | AiUsageLogCreateOrConnectWithoutTenantInput[]
    upsert?: AiUsageLogUpsertWithWhereUniqueWithoutTenantInput | AiUsageLogUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AiUsageLogCreateManyTenantInputEnvelope
    set?: AiUsageLogWhereUniqueInput | AiUsageLogWhereUniqueInput[]
    disconnect?: AiUsageLogWhereUniqueInput | AiUsageLogWhereUniqueInput[]
    delete?: AiUsageLogWhereUniqueInput | AiUsageLogWhereUniqueInput[]
    connect?: AiUsageLogWhereUniqueInput | AiUsageLogWhereUniqueInput[]
    update?: AiUsageLogUpdateWithWhereUniqueWithoutTenantInput | AiUsageLogUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AiUsageLogUpdateManyWithWhereWithoutTenantInput | AiUsageLogUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AiUsageLogScalarWhereInput | AiUsageLogScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTenantInput | UserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTenantInput | UserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTenantInput | UserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type AiProviderConfigUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AiProviderConfigCreateWithoutTenantInput, AiProviderConfigUncheckedCreateWithoutTenantInput> | AiProviderConfigCreateWithoutTenantInput[] | AiProviderConfigUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AiProviderConfigCreateOrConnectWithoutTenantInput | AiProviderConfigCreateOrConnectWithoutTenantInput[]
    upsert?: AiProviderConfigUpsertWithWhereUniqueWithoutTenantInput | AiProviderConfigUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AiProviderConfigCreateManyTenantInputEnvelope
    set?: AiProviderConfigWhereUniqueInput | AiProviderConfigWhereUniqueInput[]
    disconnect?: AiProviderConfigWhereUniqueInput | AiProviderConfigWhereUniqueInput[]
    delete?: AiProviderConfigWhereUniqueInput | AiProviderConfigWhereUniqueInput[]
    connect?: AiProviderConfigWhereUniqueInput | AiProviderConfigWhereUniqueInput[]
    update?: AiProviderConfigUpdateWithWhereUniqueWithoutTenantInput | AiProviderConfigUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AiProviderConfigUpdateManyWithWhereWithoutTenantInput | AiProviderConfigUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AiProviderConfigScalarWhereInput | AiProviderConfigScalarWhereInput[]
  }

  export type AiPromptCacheUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AiPromptCacheCreateWithoutTenantInput, AiPromptCacheUncheckedCreateWithoutTenantInput> | AiPromptCacheCreateWithoutTenantInput[] | AiPromptCacheUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AiPromptCacheCreateOrConnectWithoutTenantInput | AiPromptCacheCreateOrConnectWithoutTenantInput[]
    upsert?: AiPromptCacheUpsertWithWhereUniqueWithoutTenantInput | AiPromptCacheUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AiPromptCacheCreateManyTenantInputEnvelope
    set?: AiPromptCacheWhereUniqueInput | AiPromptCacheWhereUniqueInput[]
    disconnect?: AiPromptCacheWhereUniqueInput | AiPromptCacheWhereUniqueInput[]
    delete?: AiPromptCacheWhereUniqueInput | AiPromptCacheWhereUniqueInput[]
    connect?: AiPromptCacheWhereUniqueInput | AiPromptCacheWhereUniqueInput[]
    update?: AiPromptCacheUpdateWithWhereUniqueWithoutTenantInput | AiPromptCacheUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AiPromptCacheUpdateManyWithWhereWithoutTenantInput | AiPromptCacheUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AiPromptCacheScalarWhereInput | AiPromptCacheScalarWhereInput[]
  }

  export type AiUsageLogUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AiUsageLogCreateWithoutTenantInput, AiUsageLogUncheckedCreateWithoutTenantInput> | AiUsageLogCreateWithoutTenantInput[] | AiUsageLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AiUsageLogCreateOrConnectWithoutTenantInput | AiUsageLogCreateOrConnectWithoutTenantInput[]
    upsert?: AiUsageLogUpsertWithWhereUniqueWithoutTenantInput | AiUsageLogUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AiUsageLogCreateManyTenantInputEnvelope
    set?: AiUsageLogWhereUniqueInput | AiUsageLogWhereUniqueInput[]
    disconnect?: AiUsageLogWhereUniqueInput | AiUsageLogWhereUniqueInput[]
    delete?: AiUsageLogWhereUniqueInput | AiUsageLogWhereUniqueInput[]
    connect?: AiUsageLogWhereUniqueInput | AiUsageLogWhereUniqueInput[]
    update?: AiUsageLogUpdateWithWhereUniqueWithoutTenantInput | AiUsageLogUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AiUsageLogUpdateManyWithWhereWithoutTenantInput | AiUsageLogUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AiUsageLogScalarWhereInput | AiUsageLogScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutUsersInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    connect?: TenantWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type TenantUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    upsert?: TenantUpsertWithoutUsersInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutUsersInput, TenantUpdateWithoutUsersInput>, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type TenantCreateNestedOneWithoutAiProviderConfigsInput = {
    create?: XOR<TenantCreateWithoutAiProviderConfigsInput, TenantUncheckedCreateWithoutAiProviderConfigsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAiProviderConfigsInput
    connect?: TenantWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TenantUpdateOneRequiredWithoutAiProviderConfigsNestedInput = {
    create?: XOR<TenantCreateWithoutAiProviderConfigsInput, TenantUncheckedCreateWithoutAiProviderConfigsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAiProviderConfigsInput
    upsert?: TenantUpsertWithoutAiProviderConfigsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutAiProviderConfigsInput, TenantUpdateWithoutAiProviderConfigsInput>, TenantUncheckedUpdateWithoutAiProviderConfigsInput>
  }

  export type TenantCreateNestedOneWithoutAiPromptCacheInput = {
    create?: XOR<TenantCreateWithoutAiPromptCacheInput, TenantUncheckedCreateWithoutAiPromptCacheInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAiPromptCacheInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutAiPromptCacheNestedInput = {
    create?: XOR<TenantCreateWithoutAiPromptCacheInput, TenantUncheckedCreateWithoutAiPromptCacheInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAiPromptCacheInput
    upsert?: TenantUpsertWithoutAiPromptCacheInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutAiPromptCacheInput, TenantUpdateWithoutAiPromptCacheInput>, TenantUncheckedUpdateWithoutAiPromptCacheInput>
  }

  export type TenantCreateNestedOneWithoutAiUsageLogsInput = {
    create?: XOR<TenantCreateWithoutAiUsageLogsInput, TenantUncheckedCreateWithoutAiUsageLogsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAiUsageLogsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutAiUsageLogsNestedInput = {
    create?: XOR<TenantCreateWithoutAiUsageLogsInput, TenantUncheckedCreateWithoutAiUsageLogsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAiUsageLogsInput
    upsert?: TenantUpsertWithoutAiUsageLogsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutAiUsageLogsInput, TenantUpdateWithoutAiUsageLogsInput>, TenantUncheckedUpdateWithoutAiUsageLogsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserCreateWithoutTenantInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    emailVerified?: boolean
    verificationToken?: string | null
    verificationTokenExpires?: Date | string | null
    passwordResetToken?: string | null
    passwordResetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutTenantInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    emailVerified?: boolean
    verificationToken?: string | null
    verificationTokenExpires?: Date | string | null
    passwordResetToken?: string | null
    passwordResetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutTenantInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput>
  }

  export type UserCreateManyTenantInputEnvelope = {
    data: UserCreateManyTenantInput | UserCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type AiProviderConfigCreateWithoutTenantInput = {
    id?: string
    provider: string
    modelName: string
    isEnabled?: boolean
    priority?: number
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiProviderConfigUncheckedCreateWithoutTenantInput = {
    id?: string
    provider: string
    modelName: string
    isEnabled?: boolean
    priority?: number
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiProviderConfigCreateOrConnectWithoutTenantInput = {
    where: AiProviderConfigWhereUniqueInput
    create: XOR<AiProviderConfigCreateWithoutTenantInput, AiProviderConfigUncheckedCreateWithoutTenantInput>
  }

  export type AiProviderConfigCreateManyTenantInputEnvelope = {
    data: AiProviderConfigCreateManyTenantInput | AiProviderConfigCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type AiPromptCacheCreateWithoutTenantInput = {
    id?: string
    promptHash: string
    taskType: string
    response: JsonNullValueInput | InputJsonValue
    tokensUsed: number
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type AiPromptCacheUncheckedCreateWithoutTenantInput = {
    id?: string
    promptHash: string
    taskType: string
    response: JsonNullValueInput | InputJsonValue
    tokensUsed: number
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type AiPromptCacheCreateOrConnectWithoutTenantInput = {
    where: AiPromptCacheWhereUniqueInput
    create: XOR<AiPromptCacheCreateWithoutTenantInput, AiPromptCacheUncheckedCreateWithoutTenantInput>
  }

  export type AiPromptCacheCreateManyTenantInputEnvelope = {
    data: AiPromptCacheCreateManyTenantInput | AiPromptCacheCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type AiUsageLogCreateWithoutTenantInput = {
    id?: string
    provider: string
    model: string
    taskType: string
    inputTokens: number
    outputTokens: number
    latencyMs: number
    success: boolean
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AiUsageLogUncheckedCreateWithoutTenantInput = {
    id?: string
    provider: string
    model: string
    taskType: string
    inputTokens: number
    outputTokens: number
    latencyMs: number
    success: boolean
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AiUsageLogCreateOrConnectWithoutTenantInput = {
    where: AiUsageLogWhereUniqueInput
    create: XOR<AiUsageLogCreateWithoutTenantInput, AiUsageLogUncheckedCreateWithoutTenantInput>
  }

  export type AiUsageLogCreateManyTenantInputEnvelope = {
    data: AiUsageLogCreateManyTenantInput | AiUsageLogCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutTenantInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutTenantInput, UserUncheckedUpdateWithoutTenantInput>
    create: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput>
  }

  export type UserUpdateWithWhereUniqueWithoutTenantInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutTenantInput, UserUncheckedUpdateWithoutTenantInput>
  }

  export type UserUpdateManyWithWhereWithoutTenantInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutTenantInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: BoolFilter<"User"> | boolean
    verificationToken?: StringNullableFilter<"User"> | string | null
    verificationTokenExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    passwordResetToken?: StringNullableFilter<"User"> | string | null
    passwordResetTokenExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    tenantId?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type AiProviderConfigUpsertWithWhereUniqueWithoutTenantInput = {
    where: AiProviderConfigWhereUniqueInput
    update: XOR<AiProviderConfigUpdateWithoutTenantInput, AiProviderConfigUncheckedUpdateWithoutTenantInput>
    create: XOR<AiProviderConfigCreateWithoutTenantInput, AiProviderConfigUncheckedCreateWithoutTenantInput>
  }

  export type AiProviderConfigUpdateWithWhereUniqueWithoutTenantInput = {
    where: AiProviderConfigWhereUniqueInput
    data: XOR<AiProviderConfigUpdateWithoutTenantInput, AiProviderConfigUncheckedUpdateWithoutTenantInput>
  }

  export type AiProviderConfigUpdateManyWithWhereWithoutTenantInput = {
    where: AiProviderConfigScalarWhereInput
    data: XOR<AiProviderConfigUpdateManyMutationInput, AiProviderConfigUncheckedUpdateManyWithoutTenantInput>
  }

  export type AiProviderConfigScalarWhereInput = {
    AND?: AiProviderConfigScalarWhereInput | AiProviderConfigScalarWhereInput[]
    OR?: AiProviderConfigScalarWhereInput[]
    NOT?: AiProviderConfigScalarWhereInput | AiProviderConfigScalarWhereInput[]
    id?: StringFilter<"AiProviderConfig"> | string
    tenantId?: StringFilter<"AiProviderConfig"> | string
    provider?: StringFilter<"AiProviderConfig"> | string
    modelName?: StringFilter<"AiProviderConfig"> | string
    isEnabled?: BoolFilter<"AiProviderConfig"> | boolean
    priority?: IntFilter<"AiProviderConfig"> | number
    config?: JsonNullableFilter<"AiProviderConfig">
    createdAt?: DateTimeFilter<"AiProviderConfig"> | Date | string
    updatedAt?: DateTimeFilter<"AiProviderConfig"> | Date | string
  }

  export type AiPromptCacheUpsertWithWhereUniqueWithoutTenantInput = {
    where: AiPromptCacheWhereUniqueInput
    update: XOR<AiPromptCacheUpdateWithoutTenantInput, AiPromptCacheUncheckedUpdateWithoutTenantInput>
    create: XOR<AiPromptCacheCreateWithoutTenantInput, AiPromptCacheUncheckedCreateWithoutTenantInput>
  }

  export type AiPromptCacheUpdateWithWhereUniqueWithoutTenantInput = {
    where: AiPromptCacheWhereUniqueInput
    data: XOR<AiPromptCacheUpdateWithoutTenantInput, AiPromptCacheUncheckedUpdateWithoutTenantInput>
  }

  export type AiPromptCacheUpdateManyWithWhereWithoutTenantInput = {
    where: AiPromptCacheScalarWhereInput
    data: XOR<AiPromptCacheUpdateManyMutationInput, AiPromptCacheUncheckedUpdateManyWithoutTenantInput>
  }

  export type AiPromptCacheScalarWhereInput = {
    AND?: AiPromptCacheScalarWhereInput | AiPromptCacheScalarWhereInput[]
    OR?: AiPromptCacheScalarWhereInput[]
    NOT?: AiPromptCacheScalarWhereInput | AiPromptCacheScalarWhereInput[]
    id?: StringFilter<"AiPromptCache"> | string
    tenantId?: StringFilter<"AiPromptCache"> | string
    promptHash?: StringFilter<"AiPromptCache"> | string
    taskType?: StringFilter<"AiPromptCache"> | string
    response?: JsonFilter<"AiPromptCache">
    tokensUsed?: IntFilter<"AiPromptCache"> | number
    createdAt?: DateTimeFilter<"AiPromptCache"> | Date | string
    expiresAt?: DateTimeFilter<"AiPromptCache"> | Date | string
  }

  export type AiUsageLogUpsertWithWhereUniqueWithoutTenantInput = {
    where: AiUsageLogWhereUniqueInput
    update: XOR<AiUsageLogUpdateWithoutTenantInput, AiUsageLogUncheckedUpdateWithoutTenantInput>
    create: XOR<AiUsageLogCreateWithoutTenantInput, AiUsageLogUncheckedCreateWithoutTenantInput>
  }

  export type AiUsageLogUpdateWithWhereUniqueWithoutTenantInput = {
    where: AiUsageLogWhereUniqueInput
    data: XOR<AiUsageLogUpdateWithoutTenantInput, AiUsageLogUncheckedUpdateWithoutTenantInput>
  }

  export type AiUsageLogUpdateManyWithWhereWithoutTenantInput = {
    where: AiUsageLogScalarWhereInput
    data: XOR<AiUsageLogUpdateManyMutationInput, AiUsageLogUncheckedUpdateManyWithoutTenantInput>
  }

  export type AiUsageLogScalarWhereInput = {
    AND?: AiUsageLogScalarWhereInput | AiUsageLogScalarWhereInput[]
    OR?: AiUsageLogScalarWhereInput[]
    NOT?: AiUsageLogScalarWhereInput | AiUsageLogScalarWhereInput[]
    id?: StringFilter<"AiUsageLog"> | string
    tenantId?: StringFilter<"AiUsageLog"> | string
    provider?: StringFilter<"AiUsageLog"> | string
    model?: StringFilter<"AiUsageLog"> | string
    taskType?: StringFilter<"AiUsageLog"> | string
    inputTokens?: IntFilter<"AiUsageLog"> | number
    outputTokens?: IntFilter<"AiUsageLog"> | number
    latencyMs?: IntFilter<"AiUsageLog"> | number
    success?: BoolFilter<"AiUsageLog"> | boolean
    errorMessage?: StringNullableFilter<"AiUsageLog"> | string | null
    createdAt?: DateTimeFilter<"AiUsageLog"> | Date | string
  }

  export type TenantCreateWithoutUsersInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    aiProviderConfigs?: AiProviderConfigCreateNestedManyWithoutTenantInput
    aiPromptCache?: AiPromptCacheCreateNestedManyWithoutTenantInput
    aiUsageLogs?: AiUsageLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    aiProviderConfigs?: AiProviderConfigUncheckedCreateNestedManyWithoutTenantInput
    aiPromptCache?: AiPromptCacheUncheckedCreateNestedManyWithoutTenantInput
    aiUsageLogs?: AiUsageLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutUsersInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
  }

  export type TenantUpsertWithoutUsersInput = {
    update: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutUsersInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type TenantUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiProviderConfigs?: AiProviderConfigUpdateManyWithoutTenantNestedInput
    aiPromptCache?: AiPromptCacheUpdateManyWithoutTenantNestedInput
    aiUsageLogs?: AiUsageLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiProviderConfigs?: AiProviderConfigUncheckedUpdateManyWithoutTenantNestedInput
    aiPromptCache?: AiPromptCacheUncheckedUpdateManyWithoutTenantNestedInput
    aiUsageLogs?: AiUsageLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutAiProviderConfigsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    aiPromptCache?: AiPromptCacheCreateNestedManyWithoutTenantInput
    aiUsageLogs?: AiUsageLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutAiProviderConfigsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    aiPromptCache?: AiPromptCacheUncheckedCreateNestedManyWithoutTenantInput
    aiUsageLogs?: AiUsageLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutAiProviderConfigsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutAiProviderConfigsInput, TenantUncheckedCreateWithoutAiProviderConfigsInput>
  }

  export type TenantUpsertWithoutAiProviderConfigsInput = {
    update: XOR<TenantUpdateWithoutAiProviderConfigsInput, TenantUncheckedUpdateWithoutAiProviderConfigsInput>
    create: XOR<TenantCreateWithoutAiProviderConfigsInput, TenantUncheckedCreateWithoutAiProviderConfigsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutAiProviderConfigsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutAiProviderConfigsInput, TenantUncheckedUpdateWithoutAiProviderConfigsInput>
  }

  export type TenantUpdateWithoutAiProviderConfigsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    aiPromptCache?: AiPromptCacheUpdateManyWithoutTenantNestedInput
    aiUsageLogs?: AiUsageLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutAiProviderConfigsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    aiPromptCache?: AiPromptCacheUncheckedUpdateManyWithoutTenantNestedInput
    aiUsageLogs?: AiUsageLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutAiPromptCacheInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    aiProviderConfigs?: AiProviderConfigCreateNestedManyWithoutTenantInput
    aiUsageLogs?: AiUsageLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutAiPromptCacheInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    aiProviderConfigs?: AiProviderConfigUncheckedCreateNestedManyWithoutTenantInput
    aiUsageLogs?: AiUsageLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutAiPromptCacheInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutAiPromptCacheInput, TenantUncheckedCreateWithoutAiPromptCacheInput>
  }

  export type TenantUpsertWithoutAiPromptCacheInput = {
    update: XOR<TenantUpdateWithoutAiPromptCacheInput, TenantUncheckedUpdateWithoutAiPromptCacheInput>
    create: XOR<TenantCreateWithoutAiPromptCacheInput, TenantUncheckedCreateWithoutAiPromptCacheInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutAiPromptCacheInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutAiPromptCacheInput, TenantUncheckedUpdateWithoutAiPromptCacheInput>
  }

  export type TenantUpdateWithoutAiPromptCacheInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    aiProviderConfigs?: AiProviderConfigUpdateManyWithoutTenantNestedInput
    aiUsageLogs?: AiUsageLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutAiPromptCacheInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    aiProviderConfigs?: AiProviderConfigUncheckedUpdateManyWithoutTenantNestedInput
    aiUsageLogs?: AiUsageLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutAiUsageLogsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    aiProviderConfigs?: AiProviderConfigCreateNestedManyWithoutTenantInput
    aiPromptCache?: AiPromptCacheCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutAiUsageLogsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    aiProviderConfigs?: AiProviderConfigUncheckedCreateNestedManyWithoutTenantInput
    aiPromptCache?: AiPromptCacheUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutAiUsageLogsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutAiUsageLogsInput, TenantUncheckedCreateWithoutAiUsageLogsInput>
  }

  export type TenantUpsertWithoutAiUsageLogsInput = {
    update: XOR<TenantUpdateWithoutAiUsageLogsInput, TenantUncheckedUpdateWithoutAiUsageLogsInput>
    create: XOR<TenantCreateWithoutAiUsageLogsInput, TenantUncheckedCreateWithoutAiUsageLogsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutAiUsageLogsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutAiUsageLogsInput, TenantUncheckedUpdateWithoutAiUsageLogsInput>
  }

  export type TenantUpdateWithoutAiUsageLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    aiProviderConfigs?: AiProviderConfigUpdateManyWithoutTenantNestedInput
    aiPromptCache?: AiPromptCacheUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutAiUsageLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    aiProviderConfigs?: AiProviderConfigUncheckedUpdateManyWithoutTenantNestedInput
    aiPromptCache?: AiPromptCacheUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type UserCreateManyTenantInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    emailVerified?: boolean
    verificationToken?: string | null
    verificationTokenExpires?: Date | string | null
    passwordResetToken?: string | null
    passwordResetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiProviderConfigCreateManyTenantInput = {
    id?: string
    provider: string
    modelName: string
    isEnabled?: boolean
    priority?: number
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiPromptCacheCreateManyTenantInput = {
    id?: string
    promptHash: string
    taskType: string
    response: JsonNullValueInput | InputJsonValue
    tokensUsed: number
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type AiUsageLogCreateManyTenantInput = {
    id?: string
    provider: string
    model: string
    taskType: string
    inputTokens: number
    outputTokens: number
    latencyMs: number
    success: boolean
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiProviderConfigUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    modelName?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiProviderConfigUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    modelName?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiProviderConfigUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    modelName?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiPromptCacheUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    promptHash?: StringFieldUpdateOperationsInput | string
    taskType?: StringFieldUpdateOperationsInput | string
    response?: JsonNullValueInput | InputJsonValue
    tokensUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiPromptCacheUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    promptHash?: StringFieldUpdateOperationsInput | string
    taskType?: StringFieldUpdateOperationsInput | string
    response?: JsonNullValueInput | InputJsonValue
    tokensUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiPromptCacheUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    promptHash?: StringFieldUpdateOperationsInput | string
    taskType?: StringFieldUpdateOperationsInput | string
    response?: JsonNullValueInput | InputJsonValue
    tokensUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageLogUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    taskType?: StringFieldUpdateOperationsInput | string
    inputTokens?: IntFieldUpdateOperationsInput | number
    outputTokens?: IntFieldUpdateOperationsInput | number
    latencyMs?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageLogUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    taskType?: StringFieldUpdateOperationsInput | string
    inputTokens?: IntFieldUpdateOperationsInput | number
    outputTokens?: IntFieldUpdateOperationsInput | number
    latencyMs?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageLogUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    taskType?: StringFieldUpdateOperationsInput | string
    inputTokens?: IntFieldUpdateOperationsInput | number
    outputTokens?: IntFieldUpdateOperationsInput | number
    latencyMs?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}