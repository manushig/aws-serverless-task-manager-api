import { Container, decorate, injectable } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { Controller } from "tsoa";
import { ArticlesRepository } from "./api/articles/ArticlesRepository";
import { ArticlesRepositoryInMemory } from "./api/articles/ArticlesRepositoryInMemory";
import { IocContainer } from "@tsoa/runtime";

const container = new Container();

decorate(injectable(), Controller);

container.load(buildProviderModule());

const inMemoryArticleRepository = new ArticlesRepositoryInMemory();
container.bind<ArticlesRepository>("ArticlesRepository").toDynamicValue(() => inMemoryArticleRepository);

const iocContainer: IocContainer = {
  get: <T>(controller: { prototype: T }): T => {
    return container.get<T>(controller as any);
  }
};

export { iocContainer, container };