import React from "react";
import AuthForm from "./AuthForm";

function Login({ onLogin }) {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    onLogin(userData);
  }

  return (
    <AuthForm
      title="Log in"
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      inputs={inputs}
      text="Don't have an account?"
      link="/signup"
      linkText="Sign up here!"
    />
  );
}

export default Login;
