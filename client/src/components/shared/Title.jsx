import Helmet from "react-helmet";

const Title = ({
  title = "Chat App",
  description = "This is the chat app",
}) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;
