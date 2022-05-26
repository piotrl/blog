---
title: 'Angular i18n - $localize with plurals'
author: [Piotr Lewandowski]
tags: ['angular', 'i18n']
cover: './cover.jpeg'
date: '2022-01-06'
description: 'Angular supports plurals but not in dynamic $localize translations. How to use plurals with $localize properly?'
---

Angular used to support translations only in HTML. It was missing use-case of more dynamic translations. Since Angular 10, you can also do it in TypeScript files with `$localize` marker.

Simply like that:

```typescript
@Component({
  template: `<div>{{message}}</div>`
})
class HelloComponent {
  message = $localize`Hello World!`;
}
```

Typically, when text includes numbers it has to be pluralized. Many languages have different grammar rules.

In HTML, we got plurals built-in.

```html

```

but it won't work in TypeScript `$localize`.

### Plurals in TypeScript

Luckily, there is pipe we can use to do plural magic for us - [PluralPipe](https://github.com/angular/angular/blob/13.1.1/packages/common/src/pipes/i18n_plural_pipe.ts#L31);

Typically, we use pipes in HTML, but those can also be injected.

```typescript
@Component({
  template: `<div>{{message}}</div>`
})
class HelloComponent {
  amount = 1;
  message = this.plural.transform(this.amount, {
    '=0': $localize`No worlds`,
    'one': $localize``
  });
  
  constructor(private plural: I18nPluralPipe) {}
}
```

### Drawbacks

There is one drawback that won't work for every use case.
