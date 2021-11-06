# useState

```javascript
import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./style.css";

function App() {
  const [item, setItem] = useState(1);
  return (
    <div>
      <h1>Hello CodeSandBox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

item, setItem의 이름을 하는 것은 선택사항(이름은 중요치 않음)

useState는 array를 return해야 하고
array의 첫번째 요소는 item, 두번째 요소는 setItem이 됨

이렇게 쓰게 되면 useState를 부른 곳에 값을 return할 수 있음

함수를 arrow 함수로 바꾸고 (그냥 취향이라고 함)

```javascript
const App = () => {
  const [item, setItem] = useState(1);
  const incrementItem = () => setItem(item + 1);
  const decrementItem = () => setItem(item - 1);
  return (
    <div>
      <h1>Hello CodeSandBox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button onclick={incrementItem}>increment</button>
      <button onclick={decrementItem}>decrement</button>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

이것을 class로 바꿔보자

함수 아래에

```javascript
class AppUgly extends React.Component {
  state = {
    item: 1,
  };
  render() {
    const { item } = this.state;
    return (
      <div classname="App">
        <h1>Hello CodeSandBox</h1>
        <h2>Start editing to see some magic happen!</h2>
        <button onclick={this.incrementItem}>increment</button>
        <button onclick={this.decrementItem}>decrement</button>
      </div>
    );
  }
  incrementItem = () => {
    this.setState((state) => {
      return {
        item: state.item + 1,
      };
    });
  };
  decrementItem = () => {
    this.setState((state) => {
      return {
        item: state.item - 1,
      };
    });
  };
}
```

비교해 보면 코드량에서 엄청난 차이가 남

# useInput

```javascript
const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  return { value };
};
const App = () => {
  const name = useInput("Mr.");
  return (
    <div>
      <h1>Hello</h1>
      <input placeholder="Name" {...name} />
    </div>
  );
};
```

```javascript
const name = useInput("Mr.");
```

{...name} = value={name.value}
useInput은 value를 return할거고 그렇다면 name은 value랑 같아지게 됨
{...name} 이렇게 쓰면 name안의 모든 것을 풀어주기 때문에 value={name.value}를 쓰지 않아도 됨

이 부분에 hook을 써 볼건데 이 기본값(mr.)을 입력된 value와 함께 return하고 싶을 때 return {value}를 입력

useInput은 "Mr."을 기본값으로 가졌는데 그 값은 initialValue로 받아 useState의 initialValue로 전달되어 value로 이동함

여기서 onchange 함수를 만들어 보자 \***\*(근데 왜??)\*\***

안에 내용을 입력해야 하니까?

onchange함수는 event를 가짐
console.log에서 event.target을 보고 싶다면

```javascript
const onChange = (event) => {
  console.log(event.target);
};
```

이렇게 하면 되고, 이제 return값에 onchange를 추가

```javascript
const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (event) => {
    console.log(event.target);
  };
  return { value, onChange };
};
```

이렇게 될 경우,

```javascript
<input placeholder="Name" {...name} />
```

{...name}에서 onChange={name.onChange}도 같이 포함하게 됨

그 다음은 유효성 검사를 할 건데, validator function을 쓰면 됨
유효성 검사란? 입력하는 문자에 제한을 두는 것. ex) 글자 수 제한, 특수문자 제한 등

```javascript
const useInput = (initialValue, validator) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setValue(value);
  };
  return { value, onChange };
};
const App = () => {
  const name = useInput("Mr.");
  return (
    <div>
      <h1>Hello</h1>
      <input placeholder="Name" {...name} />
    </div>
  );
};
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

\***\*이거에 대한 언급이 X\*\***

```javascript
const onChange = (event) => {
  const {
    target: { value },
  } = event;
  setValue(value);
};
```

```javascript
const onChange = (event) => {
  const {
    target: { value },
  } = event;
  let willUpdate = true;
  // willUpdate는 true니까 항상 업데이트가 됨
  if (willUpdate) {
    setValue(value);
    // 왜 이게 if 안으로 들어가는지도 설명이 X
  }
};
```

validator을 확인해보고 싶다면

```javascript
if(typeof validator===function) {
  willUpdate = validator(value)
}
```

그리고 아래부분에 함수를 만듬

```javascript
const maxLen = (value) => value.length < 10;
// const App안에 넣음
```

validator 타입이 함수라면, willUpdate에 validator의 결과를 업로드함

이 경우, maxlen이 validator 함수가 될 것이고 입력에 따라서 false가 될 수도, true가 될 수도 있음 (false라면 조건 이상으로 입력이 되지 않음)

\***\*근데 궁금한거 maxLen 변수가 validator 함수라는 걸 어떻게 인식함?\*\***

```javascript
///다른 예시
const notInclude = (value) => !value.includes("@");
// value 앞에 !를 붙임으로서 @는 입력되지 않음
```

```javascript
//완성

import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./style.css";

const useInput = (initialValue, validator) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    if (typeof validator === "function") {
      willUpdate - validator(value);
    }
    if (willUpdate) {
      setValue(value);
    }
  };
  return { value, onChange };
};
const App = () => {
  const name = useInput("Mr.", maxlen); // 기본값으로 Mr.
  const notInclude = (value) => !value.includes("@"); // @를 포함하지 않음
  const maxLen = (value) => value.length < 10; // 문자의 수는 10 미만임
  return (
    <div>
      <h1>Hello</h1>
      <input placeholder="Name" {...name} />
    </div>
  );
};
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

# useTabs

```javascript
//시작
import React, { useState } from "react";
import ReactDOM from "react-dom";

const App = () => {
  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
};
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

```javascript
//API나 다른 곳에서 뭔가를 가져오려고 하면

const content = [
  {
    tab: "section 1",
    content: "I'm the content of the section 1",
  },
  {
    tab: "section 2",
    content: "I'm the content of the section 2",
  },
];
```

```javascript
//두 개의 버튼을 만들어 주자

const App = () => {
  return (
    <div className="App">
      <h1>Hello</h1>
      {content.map((section) => (
        <button>{section.tab}</button>
      ))}
      //왜 map 함수를 쓰는지...? => 한번의 코드로 여러개의 버튼 생성 가능
    </div>
  );
};
```

```javascript
// 1. hook을 만들자
const useTabs = (initialTab, allTabs) => {
  // 5. function이 시작될 때 에러를 확인하려면
  if (!allTabs || !Array.isArray(allTabs)) {
    return
  }
  // 6. 아래 const App에 인수로 content를 받지 않아도 그냥 return 시키고 종료함
  const [currentIndex, setCurrentIndex] = useState(initialTab);
  //3. 내가 선택한 section을 return하고 싶다면
  return {
    currentItem: allTabs[currentIndex]
    // 4. currentItem은 allTabs를 가지고 return 될 것이고
    // currentIndex를 index값으로 갖음
  }
};
// 2. hook을 사용하려면
const App = () => {
  // 1. useTabs는 currentItem을 return하기 때문에
  const {currentItem} = useTabs(0, content)
  return (
    <div className="App">
      <h1>Hello</h1>
      {content.map((section) => (
        <button>{section.tab}</button>
      ))}
      <div>{currentItem.content}</div>
    </div>
  );

```

```javascript
// 1. 자동화 하기
const useTabs = (initialTab, allTabs) => {
  if (!allTabs || !Array.isArray(allTabs)) {
    return
  }
  const [currentIndex, setCurrentIndex] = useState(initialTab);
  return {
    currentItem: allTabs[currentIndex]
    // 2. 자동화 하기 위해 change 버튼을 넣어줌
    // setCurrentIndex가 state를 업데이트 해줄 것.
    changeItem: setCurrentIndex
  }
};

const App = () => {
  const {currentItem} = useTabs(0, content)
  return (
    <div className="App">
      // 3. map에는 section 외에도 index를 가지고,
      // onClick 함수를 통해 버튼으로 index를 바꿔줌
      {content.map((section, index) => (
        <button onClick={() => changeItem(index)}>{section.tab}</button>
      ))}
      <div>{currentItem.content}</div>
    </div>
  );

```

완성

```javascript
import React, { useState } from "react";
import ReactDOM from "react-dom";

const useTabs = (initialTab, allTabs) => {
  if (!allTabs || !Array.isArray(allTabs)) {
    return
  }
  const [currentIndex, setCurrentIndex] = useState(initialTab);
  return {
    currentItem: allTabs[currentIndex]
    changeItem: setCurrentIndex
  }
};

const App = () => {
  const {currentItem} = useTabs(0, content)
  return (
    <div className="App">
      {content.map((section, index) => (
        <button onClick={() => changeItem(index)}>{section.tab}</button>
      ))}
      <div>{currentItem.content}</div>
    </div>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

```

# useEffect

시작

```javascript
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const App = () => {
  const [number, setNumber] = useState(0);
  const [aNumber, setAnumber] = useState(0);
  return (
    <div>
      <div>Hi</div>
      <button onClick={() => setNumber(number + 1)}></button>
      <button onClick={() => setNumber(aNumber + 1)}></button>
    </div>
  );
};
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

// useEffect는 componentWillmount와 componentDidMount와 componentWillUpdate와 비슷한 함수임
```

useEffect의 예제를 주자면,

```javascript
const App = () => {
  const sayHello = () => console.log("hello")
  useEffect(() => {
    sayHello()
    // 1. useEffect 안에 인수로 임의의 함수를 하나 만들고,
    // 해당하는 함수를 간단히 확인용으로만 만든다
  })

  <button onClick={() => setNumber(number + 1)}>{number}</button>
  <button onClick={() => setNumber(aNumber + 1)}>{aNumber}</button>
  // 이 두 개의 버튼은 클릭할 때 마다 업데이트 될 것임

```

이렇게 되면 버튼을 클릭할 때마다 숫자가 올라가며, App이 다시 업데이트 되면서 console에 hello가 찍힘

useEffect는 componentDidMount의 역할을 해서 새로고침을 하거나, 또는 componentDidUpdate의 역할도 하기 때문에 버튼을 클릭하면 sayHello() 함수를 실행하게 됨

useEffect는 두 개의 argument를 받는데, 하나는 function으로서의 effect를 받고, 나머지 하나는 dependency를 받는다. 만약, deps가 있다면 effect는 deps리스트에 있는 값일 때만 값이 변화함

```javascript
useEffect(sayHello(), []})
```

따라서 배열을 하나 더 인수로 받고, 저 배열이 비어있지 않은 경우에 그 값은 변한다. 그렇게 되면 useEffect가 활성화된다.

ex) number가 변할 때만 sayHello가 변하도록 해 보자

```javascript
useEffect(sayHello(), [number]})
```

이렇게 해도, number가 바뀐다고 useEffect가 활성화 되지는 않음

순서를 바꿔야 함

```javascript
const App = () => {
  useEffect(sayHello(), [number]})
  const [number, setNumber] = useState(0);
  const [aNumber, setAnumber] = useState(0);

// 가 아니라

const App = () => {
  const [number, setNumber] = useState(0);
  const [aNumber, setAnumber] = useState(0);
  useEffect(sayHello(), [number]})

// 이렇게 해야 바뀐 number가 useState에 업데이트 되고 나서 useEffect에서도 활성화가 됨
```

또한 useEffect는 함수를 인자로 받을 수 있기 때문에 많은 것을 할 수 있음

# useTitle

## 문서 제목의 업데이트를 담당하는 hooks를 작성, useEffect를 사용함

시작

```javascript
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const useTitle = (initialTitle) => {
  const [title, setTitle] = useState(initialTitle);
  const updateTitle = () => {
    const htmlTitle = document.querySelector("title");
    htmlTitle.innerText = title;
  };
  useEffect(updateTitle, [title]);
  // useEffect는 component가 마운트 될때 updateTitle을 부를 것이고, title이 업데이트 되면 updateTitle을 다시 부를 것임
  return setTitle;
};

const App = () => {
  const titleUpdater = useTitle("loading...");
  return (
    <div className="App">
      <div>Hi</div>
    </div>
  );
};
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

# useClick

시작
``` javascript
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const App = () => {
  return (
    <div className="App">
      <div>Hi</div>
    </div>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

이 케이스에서는 레퍼런스를 만들어 보려고 함
레퍼런스는 기본적으로 컴포넌트의 어떤 부분을 선택할 수 있는 것인데,
예를 들자면 document.getElementByID()와 비슷한 것임

``` javascript
const App = () => {
  const potato = useRef()
  return (
    <div className="App">
      <div>Hi</div>
      <input ref={potato} placeholder="la"/>
      // 5초 뒤에 focus하도록 하고 싶음(난 3초 뒤에)
    </div>
  )
}
```
그렇다면 이제 potato에 시간설정을 걸어줌

``` javascript
setTimeout(() => potato.current.focus(), 3000)
```

여기까지가 레퍼런스에 대한 이해

이제 useClick을 시작

``` javascript
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const App = () => {
  return (
    <div className="App">
      <div>Hi</div>
      <input ref={potato} placeholder="la"/>
    </div>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

``` javascript
const useClick = (onClick) => {
  const element = useRef()
  return element;
}
```
레퍼런스를 만들었고,

``` javascript
const App = () => {
  const title = useClick()
  return (
    <div className="App">
      <h1 ref={title}>Hi</h1>
      // 이렇게 되면 title에 접근할 수 있음
    </div>
  )
}
```

``` javascript
const useClick = (onClick) => {
  useEffect(() => {
    if(element.current) {
      element.current.addEventListener("click", onClick)
    }
  })
  const element = useRef()
  return element;
}
```

여기까지 정리

useClick을 사용해서 useRef()를 만들었고, 같은 레퍼런스를 return했음
그리고 주어진 레퍼런스를 title에 넘겼고, 상호작용이 가능함

이제 useEffect에선 레퍼런스 안에 element.current가 있는지 확인하는 것

이제 onClick을 만들어 보자

``` javascript
const App = () => {
  const sayHello = () => console.log("say Hello")
  const title = useClick(sayHello)
  return (
    <div className="App">
      <h1 ref={title}>Hi</h1>
    </div>
  )
}
```
이 모든 것은 레퍼런스

useEffect는 componentDidunmount 상태에서 작동하는데, 위의 경우는 component가 mount되었을 때 addEventListener을 추가함

따라서 componentWillunMount일 때 addEventListener을 지워주어야 함

useEffect에서 function을 return함으로서 이를 해결함

``` javascript
const useClick = (onClick) => {
  useEffect(() => {
    if(element.current) {
      element.current.addEventListener("click", onClick)
    } // useEffect가 mount일 때 작동
    return () => {
      if(element.current) {
        element.current.removeEventListener("click", onClick)
      } // useEffect가 unmount일때 작동
    }
  }, [])
  const element = useRef()
  return element;
}
```
기본적으로는 useEffect가 mount되었을 때 이것을 call한다는 것.

# useConfirm

보통 useConfirm은 사용자가 무언가를 하기 전에 확인하는 작업
사용자가 버튼을 클릭하면 확인 메세지를 보여주는 용도, 실행하려는 작업에 대해 한번 더 확인하는 작업이라고 생각하면 편함

``` javascript
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const useConfirm = (message="", callback) => {
  if(typeof callback !== "function") {
    return;
  }
  // callback의 타입이 함수가 아니라면 그냥 return 한다.
  // 이건 사실 필요는 없지만 함수형 프로그램을 이해하는 데 도움이 될 것.
  const confirmAction = () => {
    if(confirm(message)) {
      callback()
    }
  }
  return confirmAction;
}

const App = () => {
  const DeleteWorld = () => console.log("Deleting the world...")
  const confirmDelete = useConfirm("are you sure", DeleteWorld)
  return (
    <div className="App">
      <div>Hi</div>
      <button onClick={confirmDelete} >delete the world</button>
    </div>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

confirmDelete는 실제로 confirmAction이고 confirmAction을 부르면 브라우저에 있는 confirm에 갈 것이고 true라고 하면 callback이 실행되면서 DeleteWorld를 실행시킨다.

또한 취소 함수를 만들 수 있음

``` javascript
const useConfirm = (message="", callback, rejection) => {
  if(typeof callback !== "function") {
    return;
  }
  const confirmAction = () => {
    if(confirm(message)) {
      callback()
    } else {rejection()}
  }
  return confirmAction;
}


const App = () => {
  const DeleteWorld = () => console.log("Deleting the world...")
  const abort = () => console.log("Aborted")
  const confirmDelete = useConfirm("are you sure", DeleteWorld, abort)
  return (
    <div className="App">
      <div>Hi</div>
      <button onClick={confirmDelete} >delete the world</button>
    </div>
  )
}

```

이렇게 바꿈
``` javascript

const useConfirm = (message="", onConfirm, onCancel) => {
  if(!onConfirm || typeof onConfirm !== "function") {
    return;
  }
  if(onCancel && typeof onCancel !== "function") {
    return;
  }

  const confirmAction = () => {
    if(confirm(message)) {
      onConfirm()
    } else {onCancel()}
  }
  return confirmAction;
}
```


# usePreventLeave

보통 웹사이트에서 볼 수 있는데, 창을 닫을 때 경고메시지를 날리는 것

(저장을 하지 않았다던가 하는)

 ``` javascript
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const usePreventLeave = () => {
  // 이건 hooks를 전혀 사용하지 않음
  const listener = (event) => {
    event.preventDefault();
    event.returnValue = "";
  }
  const enablePrevent = () => window.addEventListener("beforeunload", listener)
    // api에 뭔가를 보냈고 사람들이 닫지 않기를 원한다면 보호할 수 있게 끔 활성화하는 함수 하지만 api가 괜찮다는 응답을 하면 닫아도 됨
  const disablePrevent = () => window.removeEventListener("beforeunload", listener)
  return {enablePrevent, disablePrevent}
}

const App = () => {
  const {enablePrevent, disablePrevent} = usePreventLeave()
  return (
    <div className="App">
      <button onClick = {enablePrevent}>Protect</button>
      <button onClick = {disablePrevent}>Unprotect</button>
    </div>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

window가 beforeunload이기 때문에 beforeunload는 window가 닫히기 전에 function을 실행시킴



# useBeforeLeave

마우스가 페이지를 벗어나면 생기는 함수, 페이지를 떠나지 말라는 등의 팝업창으로 활용 가능

 ``` javascript
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const useBeforeLeave = (onBefore) => {
  if (typeof onBefore !== "function") {
    return;
    // onBefore이 함수가 아니라면 아무 것도 하지 않음
  }
  const handle = () => {
    // 실행시킬 함수 이름은 handle
    onBefore()
  }
  useEffect(() => {
    document.addEventListener("mouseleave", handle);
    // componentWillUnMount일때는 이 이벤트를 지우자
    return () => document.removeEventListener("mouseleave", handle)
  }, [])
  //한번만 하는 것을 원하기에 대괄호 삽입
}

const App = () => {
  const begForLife = () => console.log("Pls don't leave")
  useBeforeLeave(begForLife)
  return (
    <div className="App">
      <div>Hi</div>
    </div>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

여기까지 완료, 이 다음부터는 최적화하는 작업

 ``` javascript
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const useBeforeLeave = (onBefore) => {
  if (typeof onBefore !== "function") {
    return;
  }
  const handle = (event) => {
    // 마우스가 어느 위치로 나가는 지 좌표값을 받아 작성
    const {clientY} = event
    if (clientY<=0) {
      onBefore()
    }
  }
  useEffect(() => {
    document.addEventListener("mouseleave", handle);
    return () => document.removeEventListener("mouseleave", handle)
  }, [])
}

const App = () => {
  const begForLife = () => console.log("Pls don't leave")
  useBeforeLeave(begForLife)
  return (
    <div className="App">
      <div>Hi</div>
    </div>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

# useFadeIn

생각보다 꽤 간단한데,

기본적으로 하나의 element를 가지고, 서서히 나타나게 만들 것임.

 ``` javascript
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const useFadeIn = (duration=1, delay=0) => {
  // duration은 애니메이션 효과 시간설정
  if (typeof duration !== "number" || typeof delay !== "number"){
    return;
  }
  const element = useRef()
  useEffect(() => {
    if (element.currnet) {
      const {current} = element;
      current.style.transition = `opacity ${duration}s ease-in-out ${delay}s`
      current.style.opacity = 1
    }
  }, [])
  // componentDidMount에서만 동작할 수 있도록, dependency를 비워둘 것
  return {ref: element, style: {opacity:0}}
}

const App = () => {
  const FadeInH1 = useFadeIn(2, 5) // 5초 딜레이 후 2초 동안 실행
  const FadeInP = useFadeIn(4, 5) // 5초 딜레이 후 4초동안 실행
  return (
    <div className="App">
      <h1 {...FadeInH1}>Hi</h1>
      <p {...FadeInP}>asdfasdfadsf</p>
    </div>
    // spred를 활용하여 ref: element, style: {opacity:0}를 useFadeIn 안으로 넣고, h1 태그 안에서는 지운다.
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

# useNetwork

useNetwork는 navigator가 online또는 offline이 되는 것을 막아 줄 것임.

 ``` javascript
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const useNetwork = onChange => {
  const [status, setStatus] = useState(navigator.onLine);
  // navigator.online을 설정함으로서 true 또는 false를 말할 것
  const handleChange = () => {
    // 두 개를 하나의 onChange로 바꾸어 사용하는 것이 나을 듯
    if(typeof onChagne === "function") {
      onChange(navigator.onLine)
    }
    setStatus(navigator.onLine)
  }
  useEffect(() => {
    window.addEventListener("online", handleChange)
    window.addEventListener("offline", handleChange)
    () => {
      window.removeEventListener("online", handleChange)
      window.removeEventListener("offline", handleChange)
      // componentWillUnmount일 때 이벤트를 지워줄 필요가 있음
    }
  }, [])
  return status
  // 네트워크의 상태를 리턴
  }

const App = () => {
  const handleNetworkChange = (online) => {
    // 이 함수는 아래 h1태그 내용처럼 하기 싫을 때, network가 바뀔 때 함수가 작동되도록 하고 싶을 때
    console.log(online?"we just went online":"we are offline")
  }
  const onLine = useNetwork(handleNetworkChange)
    return (
    <div className="App">
      <h1>{onLine ? "Online" : "Offline"}</h1>
    </div>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

# useScroll


