import './LoadingSpinner.css';
function LoadingSpinner() {
  return (
    <div className="loading">
      <p>Loading games...</p>
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;