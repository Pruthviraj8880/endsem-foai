function Loader({ message = 'Loading...', small = false }) {
  return (
    <div className={`loader-box ${small ? 'small-loader' : ''}`}>
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}

export default Loader;
