import React from "react";
import AuthForm from "./AuthForm";

function Register({ onRegister }) {
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
    onRegister(userData);
  }

  return (
    <AuthForm
      title="Sign up"
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      inputs={inputs}
      text="Already have an account?"
      link="/signin"
      linkText="Log in here!"
    />
  );
}

export default Register;
