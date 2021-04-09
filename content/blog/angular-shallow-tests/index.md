---
title: 'Angular testing: When to use shallow rendering?'
author: [Piotr Lewandowski]
tags: ['angular', 'testing', 'performance']
date: '2021-04-09'
cover: './cover.png'
draft: false
description: 'Go from 20s -> 50ms for testing huge components suites. Is shallow testing a silver bullet then?'
---

When you test components with multiple layers of children, this is cost. Cost because of rendering. Cost because of the dependency maintenance for all children. 

**Shallow testing skips compiling and rendering child components** during test execution, makes a true unit test.

## When to apply shallow testing?

**Performance**. Where unit test can be run within 5ms, a component test is 50ms. Usually, Page components are the biggest in the codebase. I found such tests can run for 900ms to even 5 seconds. For single test. This is a no-go when having over 10k tests. Shallow tests might be good quick win practice optimizing tests.

**Isolation**. It's quite common to add a new dependency to a resuable directive or component. It tends to break other tests because something is missing in dependency injection tree. 

## How to shallow test Angular components?

This one is simple. You add schema `NO_ERRORS_SCHEMA` and drop all imports, providers and declarations outside what is directly needed by the component we test.  

```typescript
import { NO_ERRORS_SCHEMA } from '@angular/core';

TestBed.configureTestingModule({
    schemas: [NO_ERRORS_SCHEMA],
    declarations: [ComponentWeTest],
});
```

Typically, this removes lots of setup code and unrelated mocks from the test suite.

## How to recognize optimization potential?

The initialization of the test can take much more time and resources than the test itself. The most costly part of it is resolving **Dependency Injection** tree from all listed modules and **compilation** of all child components.

Knowing that, check:

1. ❓ If your TestBed contains things that are not closely coupled with your component
1. ❓ If your TestBed contains too many modules and components
1. ❓ If you make a change in shared component, and you need to adjust TestBed in other, not related components that "somehow" use it under the hood 
1. ⚠️ The single test suite runs for 5 seconds or more!

See example of module that will be great to optimize:
```typescript
TestBed.configureTestingModule({
  declarations: [
    ComponentWeTest,
    MockOfChildComponent1,
    MockOfChildComponent2,
    MockOfChildComponent3, // and so on for up to
    MockOfChildComponent4, // 10, 20 mocked child components
    MockOfChildComponent5,
    MockOfChildComponent6,
  ],
  imports: [
    YourModuleWrappingAllDependenciesForAllModules,
    MatButtonComponent, // + other component library stuff
    DependentModule1,
    DependentModule2,
    DependentModule3,
    DependentModule4, // and so on for up to
    DependentModule1, // 10, 20 imported modules
  ],
})
```

Apply `NO_ERRORS_SCHEMA` and drop all imports, providers and declarations. Keep only direct dependencies and mocks related to `ComponentWeTest`. It's cleaner, faster and easier to maintain.s 

## When not to use `NO_ERRORS_SCHEMA`?

⚠️ It's not silver-bullet! It skips some part of the compilation, so it makes a test truly unit test.

1. Do not use for small components. Do not use for mid components. Only huge Page components are complex enough to gain a lot of time from module resolutions/compilations. At the same time, `Page` component tests tend to be less complex in my experience.
2. You might see issues when you rely on `@ViewChild` annotations in a given component. Since the component is not rendered, `@ViewChild` won't find a proper reference.
3. Compiler won't find some of the regressions like `@Input` name changes, because components are not included in compilation

## Angular vs React

I found it interesting to learn how Shallow Testing practices differ between frameworks. React have a simple API of `mount()` and `shallow()`:

* Call the `mount()`, everything will be compiled no matter how huge component tree is, 
* Call the `shallow()`, all children component will be ignored. No exceptions. 

To my knowledge, you can't mix them and do integration test of *some* components. This is one of the common complaints about the practice. I found Angular approach a little better here. 

Since Angular have module system, you can define which components should be included in test and skipping the rest with `NO_ERRORS_SCHEMA` option. 

```typescript
TestBed.configureTestingModule({
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    ComponentWeTest,
    MaterialTableComponent, // <-- this child will be recognised and rendered
  ],
});
```

This is great for precise integration testing.

## Others writing about shallow testing



* [Nested components tests](https://angular.io/guide/testing-components-scenarios#nested-component-tests) - official Angular docs includes chapter on Shallow Testing
* [Why you shouldn't use NO ERRORS SCHEMA](https://medium.com/@fivedicephoto/why-you-shouldnt-use-no-errors-schema-in-angular-unit-tests-cdd478c30782) - article mentioning potential drawbacks of these practices
* [Why I Never Use Shallow Rendering](https://kentcdodds.com/blog/why-i-never-use-shallow-rendering) - Kent C. Dodds suggests here drawbacks of React Shallow testing
* [Why I Always Use Shallow Rendering](https://hackernoon.com/why-i-always-use-shallow-rendering-a3a50da60942) - Anton Korzunov answers above post of Kent with counter arguments

