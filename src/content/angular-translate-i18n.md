---
title: 'Angular - Translate Enums (i18n)'
author: [Piotr Lewandowski]
tags: [angular, typescript]
image: img/angular-i18n-enums-cover.jpeg
date: '2019-07-12'
draft: false
---

Built-in Angular translation engine supports (so-far) only translation within templates, so you might think it's not possible to translate parts of TypeScript like enums. 

In fact, it's quite easy if you follow one practice.

## Model from server

To make things easy to reason about, let's have a Todo App :)

```typescript
interface TodoItem {
  name: string;
  state: TodoState;
}

enum TodoState {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
```

## Usage

```typescript
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
1. `{{ items.state }}` will produce generated enums values (0, 1, 2... or 'TODO', 'IN_PROGRESS'...)
2. We need to convert enum value into string, however this has to be within template, not TypeScript

### Bad example
Often we tend to create method with switch-case, which is unfortunate because Angular i18n is not aware of those strings, and so - it won't touch them during translation.

```typescript  
// Don't do it
getStateMessage(state: TodoState) {
  switch(state) {
    case TodoState.TODO:
      return 'not started';
    case TodoState.IN_PROGRES:
      return 'started';
    case TodoState.DONE:
      return 'finished';
    default:
      return 'unknown';
  }
}
```

## How to make it translatable?

There is only one rule to follow:

> Every string visible in UI has to be put in template

Usually in our team, for complex string calculation (enums, or some text logic) we create *new component responsible only for translation*.

We're using it widely in our applications, making a clear distinction between screen-logic and text-logic.

### Solution #1

```typescript
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

### Solution #2 - ICU messages

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
* Useful especially for string enums
* Simpler approach, but also supports HTML elements e.g. `TODO {<span>not</span> started}`)
* To be secure, you need to write unit tests that checks enum values

### Testing

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

### References
Cover photo by VanveenJF on Unsplash
