import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../global.scss"
import "./recoveryPassword.scss";
import FieldPassword from "../../component/field-password";
import FieldCode from "../../component/field-code";
import LoadingButton from "../../component/loading-button";




export const REG_EXP_EMAIL = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/);
export const REG_EXP_PASSWORD = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
);


const FIELD_NAME = {
  CODE: "code",
  PASSWORD: "password",
  NEW_PASSWORD: "newPassword",
};

const FIELD_ERROR = {

  EMAIL: "Переконайтеся, що ви ввели свою електронну адресу правильно",
  CODE: "Код, який ви ввели, невірний. Будь ласка, перевірте його та спробуйте ще раз",
  PASSWORD:
    "Переконайтеся, що ви ввели свій пароль правильно",
    NEW_PASSWORD: "Паролі не співпадають",
};


const RecoveryPasswordPage: React.FC = () => {
  const navigate = useNavigate()

  const calculateIsFormValid = (errors: any) => {
    return Object.values(errors).every((error) => error === "");
  };

 
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    [FIELD_NAME.CODE]: "",
    [FIELD_NAME.PASSWORD]: "",
    [FIELD_NAME.NEW_PASSWORD]: "",
  });

  const [error, setError] = useState({
    [FIELD_NAME.CODE]: "",
    [FIELD_NAME.PASSWORD]: "",
    [FIELD_NAME.NEW_PASSWORD]: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const clearForm = () => {
    setFormData({
      [FIELD_NAME.CODE]: "",
      [FIELD_NAME.PASSWORD]: "",
      [FIELD_NAME.NEW_PASSWORD]: "",
    });
    setError({
      [FIELD_NAME.CODE]: "",
      [FIELD_NAME.PASSWORD]: "",
      [FIELD_NAME.NEW_PASSWORD]: "",
    });
  };

  const passwordRequirements = [
    {text: "Мінімум 8 символів", isMet: formData[FIELD_NAME.PASSWORD].length >= 8},
    {text: "Містить принаймні одну цифру", isMet: /\d/.test(formData[FIELD_NAME.PASSWORD]) },
    {text: "Без спеціальних символів (!$@%#&)", isMet: !/[!@$%#^&*]/.test(formData[FIELD_NAME.PASSWORD]) },
  ];

  const validate = (name: string, value: any) => {
  
    if (name === FIELD_NAME.PASSWORD) {
      if (!REG_EXP_PASSWORD.test(String(value))) {
        return FIELD_ERROR.PASSWORD;
      }
    }
  
    if (name === FIELD_NAME.NEW_PASSWORD) {
      if (value !== formData[FIELD_NAME.PASSWORD]) {
        return FIELD_ERROR.NEW_PASSWORD;
      }
    }
    return "";
  };

  const handleInputChange = (name: string, value: string) => {
    const errorMessage = validate(name, value);

    setFormData({
      ...formData,
      [name]: value,
    });

    setError({
      ...error,
      [name]: errorMessage,
    });

    const newIsFormValid = calculateIsFormValid({
      ...error,
      [name]: errorMessage,
    });
    setIsFormValid(newIsFormValid);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    handleInputChange(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const isFormValid = calculateIsFormValid(error);

    if(isFormValid) {
      try {
        const {firstName, email, password} = formData;

        const res = await fetch("http://localhost:9999/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstName, email, password }),
          });

          // const data = await res.json();

          //-----------

          if (res.ok) {
            clearForm();
          navigate("/signup-confirm");
          }

        } catch (err) {
          console.log(err)
      } 
    }
    }
  

  return (
    <div className="page--recovery">
    
        <div>
          <img src="img/logo.png" alt="logo" className="logo" />
        </div>
        
      <section className="page__section form__section">
        
        <form className="form__container" onSubmit={handleSubmit}>


          <div className="text__section">          
        <h2 className="title">Новий пароль</h2>
        <p className="text--light" >Введіть код підтвердження, який ми надіслали на вашу електронну адресу</p>   
          </div>

        
        <div className="field">

        <FieldCode
        label="Код" 
        onChange={(value: string) => handleInputChange(FIELD_NAME.CODE, value)}
        value={formData[FIELD_NAME.CODE]}
        error={error[FIELD_NAME.CODE]}
        placeholder="Введіть код"/>

        </div>
        
        <div className="field">

        <FieldPassword
        label={"Пароль"}
        value={formData[FIELD_NAME.PASSWORD]}
        onChange={handleChange}
        name={FIELD_NAME.PASSWORD}
        error={error[FIELD_NAME.PASSWORD]}
        requirements={passwordRequirements}
        showPassword={showPassword}
        onTogglePassword={togglePasswordVisibility}
        placeholder="Створіть пароль" />

        </div>
        
        <div className="field">

        <FieldPassword
        label={"Підтвердити новий пароль"}
        value={formData[FIELD_NAME.NEW_PASSWORD]}
        onChange={handleChange}
        error={error[FIELD_NAME.NEW_PASSWORD]}
        showPassword={showPassword}
        name={FIELD_NAME.NEW_PASSWORD}
        onTogglePassword={togglePasswordVisibility}
        placeholder="Введіть пароль ще раз" />

        </div>
        
        </form>

        <div className="social-login--down">
        <LoadingButton
        className="button button--dark"
        isLoading={isSubmitting}
        text="Увійти"
        type="submit"
        />


        </div>

      
        
      </section>
    </div>
  );
};

export default RecoveryPasswordPage;
