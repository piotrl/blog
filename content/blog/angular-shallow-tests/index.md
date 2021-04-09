---
title: 'Angular testing: When to use shallow rendering?'
author: [Piotr Lewandowski]
tags: ['angular', 'testing', 'performance']
date: '2021-04-09'
cover: './cover.png'
draft: false
description: 'Go from 20s -> 50ms for testing huge components suites. Is shallow testing a silver bullet then?'
---

## What is shallow testing?

When you test components with multiple layers of children, this is cost. Cost because of rendering. Cost because of the dependency maintenance for all children. 

Shallow testing allows skipping compiling and rendering child components during test execution, making tests truly unit.

## When to apply shallow testing?

#### First, performance.

Where unit test can be run within 5ms, a component test is 50ms. Usually, in the codebase, Page components are the biggest. When I did look at our codebase, such tests run for 900ms to even 5 seconds. For single test. 

This is a huge no-go when having 10k tests or more. This is the time when we started to look for practices to optimize testing infrastructure.

#### Second, isolation.

It's quite common to add a new dependency to a resuable directive or component. It tends to break other tests because something is missing in dependency injection tree. 

## How to shallow test Angular components?

This one is super simple, actually removing lots of code.

```typescript
TestBed.configureTestingModule(
  {
    schemas: [NO_ERRORS_SCHEMA], // <-- HERE
    declarations: [
      ComponentWeTest,
    ],
      imports: [
        // only TestingModules
        // for direct dependencies of ComponentWeTest
      ],
      providers: [
        // only mocks for direct dependencies of ComponentWeTest
        // or mocks that we modify for test behaviour
      ],
    });
```

## How it looks like?

To get better understanding what `NO_ERRORS_SCHEMA` does, let's see an example:

```typescript
@Component({
  template: `
    <div *ngIf="enableTable">
      <mat-table [columns]="['First name']" [rows]="rows"></mat-table>
    </div>
  `
})
class ComponentWeTest {
  @Input()
  rows: string[] = ['Piotr'];
  
  enableTable = true;
}
```

 With full compilation we'll end up rendering:

```html
<div>
  <mat-table>
    <table>
      <tr><th>First name</th></tr>
      <tr><td>Piotr</td></tr>
    </table>
  </mat-table>
</div>
```

With shallow testing:

```html
<div>
  <mat-table columns="['First name']" rows="['Piotr']"></mat-table>
</div>
```

`<mat-table>` it's just regular HTML element with attributes. Compilation and rendering is skipped.

## The most costly parts of the Angular Component test

This might surprise one, the initialization part of the test can take much more time and resources than the test itself.

The most costly part of initialization Angular Component test:

1. **Compilation** of all child components
1. Resolving **Dependency Injection** tree from all listed modules


## How to recognize optimization potential?

1. ❓ If your TestBed contains things that are not closely coupled with your component
1. ❓ If your TestBed contains many modules and components
1. ❓ If you make a change in shared component, and you need to adjust TestBed in other, not related components that "somehow" use it under the hood 
1. ⚠️ The single test suite runs for 5 seconds or more!

Example of module that will be great to optimize:
```typescript
TestBed.configureTestingModule(
  {
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



## When not to use `NO_ERRORS_SCHEMA`?

⚠️ It's not silver-bullet! It skips some part of the compilation, so it makes a test truly unit test.

1. Do not use for small components. Do not use for mid components. Only huge Page components are complex enough to gain a lot of time from module resolutions/compilations. At the same time, `Page` component tests tend to be less complex in my experience.
2. You might see issues when you rely on `@ViewChild` annotations in a given component. Since the component is not rendered, `@ViewChild` won't find a proper reference.
3. Compiler won't find some of the regressions like `@Input` name changes, because components are not included in compilation

## Angular vs React

I found it interesting to learn how Shallow Testing practices differ between frameworks. React have a simple API of `mount()` and `shallow()`:

* Call the `mount()`, everything will be compiled no matter how huge component tree is, 
* Call the `shallow()`, all children component will be ignored. No exceptions. 

To my knowledge, you can't mix them and that's why `shallow()` contains lots of negative comments in React world because you can't reliably do integration test of *some* components.

I found Angulars approach a little better here. 

Since Angular have module system, you can define which components should be included in test and skipping the rest with `NO_ERRORS_SCHEMA` option. 

```typescript
TestBed.configureTestingModule(
  {
    schemas: [NO_ERRORS_SCHEMA],
    declarations: [
      ComponentWeTest,
      MaterialTableComponent, // <-- this child will be recognised and rendered
    ],
  });
```

This is great for precise integration testing.

## Others writing about shallow testing



* [Nested components tests](https://angular.io/guide/testing-components-scenarios#nested-component-tests) - official Angular docs on Shallow Testing
* [Why you shouldn't use NO_ERRORS_SCHEMA](https://medium.com/@fivedicephoto/why-you-shouldnt-use-no-errors-schema-in-angular-unit-tests-cdd478c30782) - article mentioning potential drawbacks of these practices
* [Why I Never Use Shallow Rendering](https://kentcdodds.com/blog/why-i-never-use-shallow-rendering) - Kent C. Dodds suggests here drawbacks of React Shallow testing
* [Why I Always Use Shallow Rendering](https://hackernoon.com/why-i-always-use-shallow-rendering-a3a50da60942) - Anton Korzunov answers above post of Kent with counter arguments

