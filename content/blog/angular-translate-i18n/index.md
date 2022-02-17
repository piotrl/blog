---
title: 'Angular i18n: Translate Enums'
author: [Piotr Lewandowski]
tags: ['angular', 'i18n']
cover: './cover.png'
date: '2019-07-12'
description: '5 practices translating enums in Angular with built-in i18n.'
---

*Rewritten in Feb 2022. I've adjusted content to new Angular Ivy possibilities.*

----

Built-in Angular translation is powerful and performant with runtime overhead close to zero. Since Angular 10, it got additional features for translating messages in TypeScript like enums.

There are two approaches to mark messages as translatable.
1. For messages in TypeScript: [`$localize` global marker](https://angular.io/api/localize/init/$localize)
2. For messages in HTML: [`i18n` attribute](https://angular.io/guide/i18n-common-prepare#i18n-example)

I'll present both approaches to solve problem of translating enums.

## Problem definition

Its common scenario to use enums for grouping state messages. Let's make an example in simple Todo component.

```typescript
interface TodoItem {
  name: string;
  state: TodoState;
}

// Messages in enum
enum TodoState {
  TODO = 'Started',
  IN_PROGRESS = 'In progress',
  DONE = 'Finished',
}

// Usage
@Component({
  selector: 'todo-list',
  template: `
    <ul>
      <li *ngFor="let item of items">
        {{ item.name }} ({{ item.state }})
      </li>
    </ul>
  `,
})
export class TodoList {

  @Input()
  items: TodoItem[];
}
```

So what is the problem?
1. `{{ items.state }}` will produce generated enums values (0, 1, 2... or 'TODO', 'IN_PROGRESS' or 'Started', 'In Progress'...)
2. In different languages, we'll keep having english messages.

## Suggested solution: `$localize`
### #1 in-place enum translation

In Angular 10, team has introduced global marker `$localize`. We can translate enums and strings in-place. 
This is enough to let angular compiler know to replace messages to different language.

```typescript
enum TodoState {
  TODO = $localize`Not started`,
  IN_PROGRESS = $localize`In progress`,
  DONE = $localize`Finished`,
}
```

### #2 function with switch-case

Sometimes we don't want to put messages into enum, or enum have already predefined values. To provide messages of enum, we can create function with switch-case. Same as before, apply `$localize` marker.

```typescript
enum TodoState {
  TODO, IN_PROGRESS, DONE,
}

function getStateMessage(state: TodoState): string {
  switch(state) {
    case TodoState.TODO:
      return $localize`Not started`;
    case TodoState.IN_PROGRES:
      return $localize`Started`;
    case TodoState.DONE:
      return $localize`Finished`;
    default:
      return $localize`Unknown`;
  }
}
```

## Alternative for Angular <10

Every string visible in UI can to be put into HTML template. For messages in HTML, we can apply `i18n` attribute to mark them as translatable.

For complex messages calculation (enums, or some text logic) we can create *new component responsible only for translation*. We're using this practice widely in our applications, making a clear separation of concerns and focusing only on logic around messages.

### #3 Component with ngSwitchCase

```typescript
enum TodoState {
  TODO, IN_PROGRESS, DONE,
}

@Component({
  selector: 'todo-state-i18n',
  template: `
  <ng-container [ngSwitch]="key">
    <ng-container i18n *ngSwitchCase="todoState.TODO">not started</ng-container>
    <ng-container i18n *ngSwitchCase="todoState.IN_PROGRESS">started</ng-container>
    <ng-container i18n *ngSwitchCase="todoState.DONE">finished</ng-container>
    <ng-container i18n *ngSwitchDefault>not defined</ng-container>
  </ng-container>
  `,
})
export class TodoStateI18n {
  // enum has to be accessed through class field
  todoState = TodoState;

  @Input()
  key: TodoState;
}
```

And final usage:

```typescript
@Component({
  selector: 'todo-list',
  template: `
    <ul>
      <li *ngFor="let item of items">
        {{ item.name }} (<todo-state-i18n key="item.state"></todo-state-i18n>)
      </li>
    </ul>
  `,
})
export class TodoList {

  @Input()
  items: TodoItem[];
}
```

* This works only with regular enums, `const enum` cannot be used within template (at least, not out of the box)
* We happily use this practice not only for enums, but also for string manipulations.
* You still need to remember to update template when new enum values are added (e.g. `TodoState.BLOCKED`)

### #4 Component with ICU messages

[ICU messages](https://angular.io/guide/i18n-common-prepare#icu-expressions) are special syntax to handle `select` or `plural` kind of messages. Here it works pretty same as switch-case, with less verbose syntax.

```typescript
@Component({
  selector: 'todo-state-i18n',
  template: `
  <ng-container i18n>
    {key, select,
      TODO {not started}
      IN_PROGRESS {started}
      DONE {finished}
    }
  </ng-container>
  `,
})
export class TodoStateI18n {

  @Input()
  key: TodoState;
}
```

* Works with const enums
* ICU `select` is not well-supported in translation tools ð
* Useful especially for string enums
* Simpler approach, but also supports HTML elements e.g. `TODO {<span>not</span> started}`)
* To be secure, you need to write unit tests that checks enum values

### Bonus: Testing switch-case component with i18n

Whenever we have switch-cases in template, we can make sure we have 

```typescript
describe('TodoStateI18n', () => {
  let component: TodoStateI18n;
  let fixture: ComponentFixture<TodoStateI18n>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TodoStateI18n,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoStateI18n);
    component = fixture.componentInstance;
  });

  // regular specs
  it('should display correct text for TODO', () => {
    component.value = TodoState.TODO;

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent)
      .toBe('not started');
  });

  // checking if everything is translated
  // Cannot be `const enum`
  Object.values(TodoState)
    .forEach((value) => {
      it(`should translate ${value}`, () => {
        component.value = value;

        fixture.detectChanges();

        expect(fixture.nativeElement.textContent)
          .not
          .toBe('unknown');
      });
    });
});
```
