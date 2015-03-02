---
title: Code and stuff!
author: the-wintersmith
date: 2012-10-01 15:00
template: article.jade
---

Syntax highlighting with [highlight.js](http://softwaremaniacs.org/soft/highlight/en/).
The theme used is tomorrow, you can find more themes [here](http://jmblog.github.io/color-themes-for-highlightjs/).

<span class="more"></span>

#### JavaScript

```javascript
function getRandomNumber() {
    return 4; // chosen by fair dice roll.
              // guaranteed to be random.
}
```
another javascript test

```javascript
function handlePan(ev) {
  /*var top = (startY + evt.deltaY) + 'px';
  var left = (startX + evt.deltaX) + 'px';
  //console.log('pan x: '+ left + ', y: '+ top);
  cont.style.top = top;
  cont.style.left = left;*/
  cont.style.top = (contPos.top + ev.deltaY) + 'px';
  cont.style.left = (contPos.left + ev.deltaX) + 'px';
}
// load map tile images once you pan 
function loadTiles(tiles) {
  cont.innerHTML = '';
  console.log('map extent: '+ JSON.stringify(mapExtent)); 
  var tiles = webMercatorTiles(mapExtent, zoom);
  tiles.forEach(function(t) {
    var img = document.createElement('img');
    img.src = baseURL + '/'+ t.Z + '/' + t.X + '/' + t.Y + '.png';
    img.style = 'left:'+ (t.left - contPos.left) 
      + 'px;top:' + (t.top - contPos.top) +'px;';
    img.setAttribute('class','tile');
    cont.appendChild(img);
  });
  return somthing;
}

```
**CoffeeScript**

```coffeescript
class Animal
  ### Intellegent design ###
  getDNA: ->
    print 'sequencing...'
    while true
      sleep 1

class Monkey extends Animal
  speak: ->
    print 'ah ah ah'

class Human extends Monkey
  speak: ->
    print ['yolo' unless i % 3] + ['swag' unless i % 5] or i for i in [1..100]
```

### C

```c
#include <stdio.h>

int main(void)
{
  printf("Hello world\n");
  return 0;
}
```

### C++

```cpp
#include <iostream>

int main()
{
  std::cout << "Hello World!" << std::endl;
  return 0;
}
```

### C-sharp

```cs
class ExampleClass
{
    static void Main()
    {
        System.Console.WriteLine("Hello, world!");
    }
}
```

### Erlang

```erlang
io:format("~s~n", ["hello, world"])
```

### Go

```go
package main

import "fmt"

func main() {
   fmt.Println("Hello World!")
}
```

### Java

```java
public class HelloWorld {
   public static void main(String[] args) {
       System.out.println("Hello world!");
   }
}
```

### ObjectiveC

```objectivec
#import <stdio.h>

int main(void)
{
    printf("Hello, World!\n");
    return 0;
}
```

### PHP

```php
<?php echo 'Hello, world'; ?>
```

### Python

```python
print("Hello World")
```

### Ruby

```ruby
puts "Hello world!"
```





