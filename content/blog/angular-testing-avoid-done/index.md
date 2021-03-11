---
title: 'Angular Testing: Avoid done() function'
author: [Piotr Lewandowski]
tags: ['angular', 'jest', 'testing']
cover: './cover.png'
date: '2021-03-03'
description: 'Let’s talk about harmfulness of real asynchronicity in tests'
---

Have you ever encountered random test instability on Continuous Integration? Called some test were just “flaky”? I guess you did! There might be lots of reasons for flakiness of tests. I found asynchronous operations are great contributor to [flakiness score](https://engineering.fb.com/2020/12/10/developer-tools/probabilistic-flakiness/).

Here **I want to describe mocking async as simple alternative to done()** that could avoid many potential build failures.

I’m going to use Observable to simulate asynchronous operations. It is not limited to RxJs though. The article applies to any kind of asynchronous operations under the hood of components and services.

## How to check the value produced from Observable, Promise, or callback?

To access variables in the callback, we have to be in its function scope!

```typescript
  it('should be green', () => {
    anyObservable()
      .subscribe((el) => {
        expect(el).toBeTruthy();
      });
  });
```

It looks innocent, sometimes even works! When it does not work? Simply when anyObservable goes async and calls `subscribe()` with small delay. In above example, test is always green then, because test executes faster than `subscribe()` callback is called. It’s also green when the value does not match `expect()`.
> It’s simply never checked. Just like [volkswagen engines emissions test](https://en.wikipedia.org/wiki/Volkswagen_emissions_scandal) — always green.

### When we’re handling asynchronous operation?

Think of any DOM event listeners, HTTP calls, Websockets, animations, own state management events, timers, intervals, Promises and more. We do lots of async things in our components. It would be unwise if we just assume those things does not affect tests.

To overcome this, frameworks like Jest or Karma provide `done()` function. It’s a marker for test runners not to finish the test until we call it.

```typescript
  it('should be green for async operation', (done) => {
    timeout(500)
      .subscribe((el) => {
        expect(el).toBeTruthy();
        done();
      });
  });
```

Bingo, isn’t it? So, why do I have the intention to discourage using `done()`?

## Poor assumptions of done()

The example above seems to be correct, but it only works under very specific circumstances. There are some common false assumptions of what the done() function does that lead to this confusion.

1. **🚀 When Observable emits 1000x times** in a loop by mistake = test is green

1. **😩 When Observable emits 2x**, but the second time it does something different than we expect = test is green

1. **🛑 When Observable errors** after first emit = test is green

1. **⌛️ When Observable never emits** = test timeouts = slow unit test

1. **🏁 When Observable does complete before first emit** = test timeouts = slow unit test

and more…

As you see, even when some situation goes wrong, test is green. When we use done() in callback, we’re not precise. Those are examples of real bugs we found in tests, not a theoretical mumbo jumbo.

## Do we always need to use done() in callback?

When callbacks are **synchronous**, we don’t really need to use expect() inside callback.

```typescript
  it('should be green for sync', () => {
    // given
    const result = [];
  
    // when
    of(1, 2)
      .subscribe((el) => result.push(el));
  
    // then
    expect(result).toEqual([1, 2]);
  });
```

1. **When Observable emits 1000x times** in loop by mistake = test fails **✅**

1. **When Observable emits 2x**, but second times it does something different than we expect = test fails **✅**

1. **When Observable errors** after first emit = test fails **✅**

1. **When Observable never emits** = test fails **✅**

1. **When Observable does complete before first emit** = test fails **✅**

Wouldn’t it be beautiful if we could just skip asynchronous nature of the events?

## How to mock async operations? fakeAsync()

Testing asynchronous code is the more typical. Asynchronous tests can be painful. The best way to handle them? Avoid!

Asynchronous is a side effect, same as a system time clock. We need to avoid them if we want to have a stable and robust test suite.

In Angular, we have absolute genius mock. It makes everything synchronous and controlled from the tests — fakeAsync().

```typescript
  it('should be green for async', fakeAsync(() => {
    // given
    const result = [];
  
    // when
    interval(1000).subscribe((el) => result.push(el));
    tick(2000);
  
    // then
    expect(result).toEqual([0, 1]);
  }));
```

☝️ Above, we have an interval(1000) emitting new increment every second starting from 0. Typically, **we don’t want to wait real 2 seconds** to check conditions. For 10 000 tests it means 5 hours of waiting. 

With `fakeAsync()` time is frozen. We’re in charge with `tick()` function. Whenever we want. Whatever amount of time should pass. With precision to millisecond.

Again, everything is synchronous. You just don’t need done() function.

## Additional advantages of using fakeAsync()

1. We won’t forget done() when we don’t use it

1. Test flow is clear and static— expect() always at the end, always executing

1. We’re sure we test exactly one async behavior at the time

1. We won’t make test utterly slow by using real async operations — think of setTimeout for 5 seconds.
