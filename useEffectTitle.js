const useTitle = (initialTitle) => {
    const [title, setTitle] = useState(initialTitle);
    const updateTitle = () => {
      const htmltitle = document.querySelector("title");
      htmltitle.innerText = title;
    };
    useEffect(updateTitle, [title]);
    return setTitle;
  };
  
  const App = () => {
    const titleUpdater = useTitle("loading...");
    setTimeout(() => titleUpdater("Home"), 2000);
    return (
      <div className="App">
        <div>Hi</div>
      </div>
    );
  };
  