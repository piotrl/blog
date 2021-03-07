---
title: 'TypeScript: Create a condition-based subset types'
author: [Piotr Lewandowski]
tags: ['typescript']
cover: './cover.png'
date: '2018-06-23'
description: 'xyz'
---

## Deep dive into typing system to solve THE ultimate riddle

TL;DR; Source code of experiment. Solution.

In this article, **we’re going to experiment with TypeScript 2.8 conditional and [mapping types](http://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types)**. The goal is to create a type that would filter out all keys from your interface, that aren’t matching condition.

You don’t have to know details of what mapping types are. It’s enough to know that TypeScript allows you to take an existing type and slightly modify it to make a new type. This is part of its [Turing Completeness](https://github.com/Microsoft/TypeScript/issues/14833).

You can think of type as *function *— it takes another type as input, makes some calculations and produces new type as output. If you heard of Partial<Type> or Pick<Type, Keys>, this is exactly how they work.

## 📐Let’s define the problem

Say you have a configuration object. It contains different groups of keys like *IDs*, *Dates* and *functions*. It may come from an API or be maintained by different people for years until it grows huge. (I know, I know, that never happens)

We want to extract only keys of a given type, such as only functions that returns Promise or something more simple like key of type number.

We need a name and definition. Let’s say: SubType<Base, Condition>

We have defined two generics by which will configure SubType:

* Base — the interface that we’re going to modify.

* Condition — another type, this one telling us which properties we would like to keep in the new object.

### Input

For testing purposes, we have Person, which is made of different types: string, number, Function. This is our “huge object” that we want to filter out.

```typescript
interface Person{
    id: number;
    name: string;
    lastName: string;
    load: () => Promise<Person>;
}
```

### Expected outcome

For example SubType of Person based on string type would return only keys of type string:

```typescript
// SubType<Person, string>
    
type SubType = {
    name: string;
    lastName: string;
}
```

description: 'xyz'
---

## 📈Step by step to a solution

### Step 1 — Baseline

The biggest problem is to find and remove keys that doesn’t match our condition. Fortunately, TypeScript 2.8 comes with conditional types! As a little trick, we’re going to create support type for a future calculation.

```typescript
type FilterFlags<Base, Condition> = {
    [Key in keyof Base]: 
        Base[Key] extends Condition ? Key : never
};
```

For each key, we apply a condition. Depending on the result, we set the name as the type or we put never, which is our flag for keys that we don’t want to see in the new type. It’s a special type, the opposite of *any*. Nothing can be assigned to it!

Look how this code is evaluated:

```typescript
FilterFlags<Person, string>; // Step 1

FilterFlags<Person, string> = { // Step 2
    id: number extends string ? 'id' : never;
    name: string extends string ? 'name' : never;
    lastName: string extends string ? 'lastName' : never;
    load: () => Promise<Person> extends string ? 'load' : never;
}

FilterFlags<Person, string> = { // Step 3
    id: never;
    name: 'name';
    lastName: 'lastName';
    load: never;
}
```

Note: 'id' is not a value, but a more precise version of the string type. We’re going to use it later on. Difference between string and 'id' type:

```typescript
const text: string = 'name' // OK
const text: 'id' = 'name' // ERR
```

### Step 2 — List of keys that match type condition

At this point, we have done our crucial work! Now we have a new objective: Gather the names of keys that passed our validation. For SubType<Person, string>, it would be: 'name' | 'lastName'.

```typescript
type AllowedNames<Base, Condition> =
        FilterFlags<Base, Condition>[keyof Base]
```

We’re using the code from the previous step and adding only one more part: [keyof Base] 
What this does is gather the most common types of given properties and ignore *never* (as those can’t be used anyway)*.*

```typescript
type family = {
    type: string;
    sad: never;
    members: number;
    friend: 'Lucy';
}

family['type' | 'members'] // string | number
family['sad' | 'members'] // number (never is ignored)
family['sad' | 'friend'] // 'Lucy'
```

Above, we have an example of returning string | number. So how can we get names? In the first step we replaced the type of key with its name!

```typescript
type FilterFlags = {
    name: 'name';
    lastName: 'lastName';
    id: never;
}

AllowedNames<FilterFlags, string>; // 'name' | 'lastName'
```

We’re close to a solution now.

Now we’re ready to build our final object. We just use `Pick`, which iterates over provided key names and extracts the associated type to the new object.

```typescript

```
    type SubType<Base, Condition> = 
            Pick<Base, AllowedNames<Base, Condition>>

Where Pick is a built-in mapped type, provided in TypeScript since 2.1:

```typescript
Pick<Person, 'id' | 'name'>;
// equals to:
{
   id: number;
   name: string;
}
```

description: 'xyz'
---

## 🎉Full Solution

Summarizing all steps, we created two types that support our SubType implementation:

```typescript
type FilterFlags<Base, Condition> = {
    [Key in keyof Base]:
        Base[Key] extends Condition ? Key : never
};

type AllowedNames<Base, Condition> =
        FilterFlags<Base, Condition>[keyof Base];

type SubType<Base, Condition> =
        Pick<Base, AllowedNames<Base, Condition>>;
```

Note: This is only typing system code, can you imagine that making loops and applying if statements might be possible?

Some people prefer to have types within one expression. You ask, I provide:

```typescript
type SubType<Base, Condition> = Pick<Base, {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;
```

description: 'xyz'
---

## 🔥 Usages

1. Extract only primitive key types from JSON:

```typescript
type JsonPrimitive = SubType<Person, number | string>;

// equals to:
type JsonPrimitive = {
    id: number;
    name: string;
    lastName: string;
}

// Let's assume Person has additional address key
type JsonComplex = SubType<Person, object>;

// equals to:
type JsonComplex = {
    address: {
        street: string;
        nr: number;
    };
}
```

2. Filter out everything except functions:

```typescript
interface PersonLoader {
    loadAmountOfPeople: () => number;
    loadPeople: (city: string) => Person[];
    url: string;
}

type Callable = SubType<PersonLoader, (_: any) => any>

// equals to:
type Callable = {
    loadAmountOfPeople: () => number;
    loadPeople: (city: string) => Person[];
}
```

If you find any other nice use cases, show us in a comment!

description: 'xyz'
---

### 🤔 What this solution won’t solve?

1. One interesting scenario is to create Nullable subtype. But because string | null is not assignable to null, it won’t work. If you have an idea to solve it, let us know in a comment!

```typescript
// expected: Nullable = { city, street }
// actual: Nullable = {}

type Nullable = SubType<{
    street: string | null;
    city: string | null;
    id: string;
}, null>
```

2. RunTime filtering — Remember that types are erased during compile-time. It does nothing to the actual object. If you would like to filter out an object the same way, you would need to write JavaScript code for it.

Also, I would not recommend using Object.keys() on such a structure as runtime result might be different than given type.

description: 'xyz'
---

## Summary

Congratulations! Today we learned how *condition *and *mapped types *work in practice. But what’s more important, we’ve focused to solve the riddle — it’s easy to combine multiple types within one, but filtering out type from keys you don’t need? Now you know. 💪

I like how TypeScript is easy to learn yet hard to master. I constantly discover new ways to solve problems that came up in my daily duties. As follow up, I highly recommend reading [advanced typing](http://www.typescriptlang.org/docs/handbook/advanced-types.html) page in the documentation.

The inspiration for this post comes from a [StackOverflow question ](https://stackoverflow.com/questions/50900533/how-can-i-extract-the-names-of-all-fields-of-a-specific-type-from-an-interface-i/50900933)asking exactly this problem. If you like solving riddles, you might also be interested in what [Dynatrace](https://jobs.lever.co/dynatrace?lever-via=L11FggMUKN) is doing with the software.

**If you’ve learned something new, please:**

→ [follow me **on Twitter (@constjs)](https://twitter.com/constjs) so you won’t miss future posts:
