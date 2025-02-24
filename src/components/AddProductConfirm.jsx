export const AddProductConfirm = ({ showConfirm }) => {
  return (
    <div className={`error-wrapper ${showConfirm ? "error-visible" : ""}`}>
      <div className="error-text-container">
        <h1>Товар додано</h1>
      </div>
    </div>
  );
};
