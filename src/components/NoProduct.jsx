export const NoProduct = ({showNoProdError}) => {
  return (
      <div className={`error-wrapper ${showNoProdError ? "error-visible" : ""}`}>
          <div className="error-text-container">
                <h1>Такого продукту немає</h1>
          </div>
    
    </div>
  );
};
