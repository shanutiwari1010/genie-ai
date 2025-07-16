const Loading = () => {
  return (
    <div className="my-10 flex items-center justify-center">
      <video autoPlay loop muted playsInline width={150}>
        <source src="/loader.webm" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Loading;
