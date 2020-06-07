declare module "builder" {
  namespace builder {
    type NoParamCallback = () => void;

    /**
     * 无返回.
     *
     * @param err 构建出错时，抛出的错误对象.
     * @param stats Stats对象，文档链接：https://webpack.docschina.org/api/node/#stats-%E5%AF%B9%E8%B1%A1-stats-object-
     */
    type BuildCallback = (
      err: NodeJS.ErrnoException | null,
      stats: any
    ) => void;

    /**
     * 无返回.
     *
     * @param err 构建出错时，抛出的错误对象.
     * @param stats Stats对象，文档链接：https://webpack.docschina.org/api/node/#stats-%E5%AF%B9%E8%B1%A1-stats-object-
     * @param watching Watching实例。
     */
    type WatchCallback = (
      err: NodeJS.ErrnoException | null,
      stats: any,
      watching: Watching
    ) => void;

    interface WebpackBuildConfig {}

    interface Watching {
      /**
       * 关闭 Watching。
       * @param callback
       */
      close(callback: NoParamCallback): void;

      /**
       * 作废 Watching。
       */
      invalidate(): void;
    }

    interface MeseBuilder {
      /**
       * 执行构建.
       *
       * @param config webpack配置.
       * @param callback 构建完成后的回调函数.
       */
      build(config: WebpackBuildConfig, callback: BuildCallback): void;
      /**
       * 使用监听方式来执行构建.
       *
       * @param config webpack配置.
       * @param callback 构建完成后的回调函数.
       */
      watch(config: WebpackBuildConfig, callback: WatchCallback): void;
    }
  }

  const builder: builder.MeseBuilder;
  export = builder;
}
