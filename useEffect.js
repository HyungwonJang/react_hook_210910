const App = () => {
    const sayHello = () => console.log("hello");
    useEffect(() => {
      sayHello();
    });
    const [number, setNumber] = useState(0);
    const [aNumber, setAnumber] = useState(0);
    return (
      <div className="App">
        <div>Hi</div>
        <button onClick={() => setNumber(number + 1)}>{number}</button>
        <button onClick={() => setAnumber(aNumber + 1)}>{aNumber}</button>
      </div>
    );
  };
  
  const App = () => {
    const sayHello = () => console.log("hello");
    const [number, setNumber] = useState(0);
    const [aNumber, setAnumber] = useState(0);
    useEffect(sayHello, []);
    return (
      <div className="App">
        <div>Hi</div>
        <button onClick={() => setNumber(number + 1)}>{number}</button>
        <button onClick={() => setAnumber(aNumber + 1)}>{aNumber}</button>
      </div>
    );
  };
  