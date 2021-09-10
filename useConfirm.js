export const useConfirm = (message = "", onConfirm, onCancel) => {
    if (onConfirm && typeof onConfirm !== "function") {
      return;
    }
    if(onCancel && typeof onConfirm !== "function") {
        return;
    }
    const confirmAction = () => {
      if (confirm(message)) {
        callback(0);
      } else {
        rejection();
      }
    };
    return confirmAction;
  };
  
  const App = () => {
    const deleteWorld = () => {
      console.log("Deleting the World...");
    };
    const abort = () => console.log("Aborted");
    const confirmDelete = useConfirm("Are you sure?", deleteWorld, abort);
    return (
      <div className="App">
        <button onClick={confirmDelete}>Delete the World</button>
      </div>
    );
  };