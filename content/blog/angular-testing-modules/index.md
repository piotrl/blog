---
title: 'Angular Testing modules'
author: [Piotr Lewandowski]
tags: ['angular', 'jest', 'testing']
cover: './cover.png'
date: '2021-04-27'
description: 'How to have better, configurable mocking experience in tests'
---

What is Testing Module? Surely, you saw one of such in the framework:

* HttpClientTestingModule
* RouterTestingModule
* BrowserTestingModule
* NoopAnimationsModule

We cut the external world here. HttpClientTestingModules replaces HttpClient implementation to NOT do real http calls. Provides better mocking or utilities to simulate complex behaviours of the module.



## Simple testing module

```
@NgModule({
  providers: [
    IconRegistryMock,
    {
       provide: IconRegistry,
       useExisting: IconRegistryMock,
    },
  ],
})
export class IconTestingModule {
}
```



```typescript
@Injectable()
export class IconRegistryMock {
  getIcon(name: string): Observable<string> {
    return of('<svg></svg>');
  }
}

```





## Configurable testing modules

```typescript
TestBed.configureTestingModule({
  imports: [
    FeatureFlagsTestingModule.with({
      settingsEnabled: true,
    }),
  ],
});
```

We can use oportunity to create static factory method, to create module with parameters. Those parameters can be provided to the mock.

Example of implementation:

```typescript
@NgModule()
export class FeatureFlagsTestingModule {

  static with(config: Record<string, boolean>) {
    return {
      ngModule: FeatureFlagsTestingModule,
      providers: [
        {
          provide: FeatureFlagsService,
          useFactory: () => new FeatureFlagsServiceMock(config),
        },
      ],
    };
  }
}
```

