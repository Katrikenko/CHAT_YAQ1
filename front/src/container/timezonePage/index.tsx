import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

import "../../global.scss"
import "./timezone.scss";
import FieldNickname from "../../component/field-nickname";


export const REG_EXP_NICKNAME = new RegExp(/^[A-Za-z0-9_-]{5,}$/);

const FIELD_NAME = {
  NICKNAME: "nickname",
};

const FIELD_ERROR = {
  NICKNAME: "Цей нікнейм використовується. Спробуйте інший",
};



const TimezonePage: React.FC = () => {
  //   const authContext = useContext(AuthContext);


  const navigate = useNavigate()

  const calculateIsFormValid = (errors: any) => {
    return Object.values(errors).every((error) => error === "");
  };

  const [isFormValid, setIsFormValid] = useState(false);

  const [formData, setFormData] = useState({
    [FIELD_NAME.NICKNAME]: "",
  });

  const [error, setError] = useState({
    [FIELD_NAME.NICKNAME]: "",
  })

  const clearForm = () => {
    setFormData({
      [FIELD_NAME.NICKNAME]: "",
    });
    setError({
      [FIELD_NAME.NICKNAME]: "",
    });
  };

  const validate = (value: string) => {
  
      if (!REG_EXP_NICKNAME.test(value.replace(/^@/, ""))) {
        return FIELD_ERROR.NICKNAME;
      }
    return "";
  };

  const handleChange = (value: string) => {
    // const { name, value } = e.target;
    
    const errorMessage = validate(value);

    

    setFormData({
      ...formData,
      [FIELD_NAME.NICKNAME]: value,
    });

    setError({
      ...error,
      [FIELD_NAME.NICKNAME]: errorMessage,
    });
    //=============================================

    const newIsFormValid = calculateIsFormValid({
      ...error,
      [FIELD_NAME.NICKNAME]: errorMessage,
    });

    setIsFormValid(newIsFormValid);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isFormValid = calculateIsFormValid(error);

    if(isFormValid) {
      try {
        const { nickname } = formData;

        const res = await fetch("http://localhost:9999/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: nickname.replace(/^@/, "") }),
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
    <div className="page--sign-in">
      <aside className="page__section">
        <div>
          <img src="img/logo.png" alt="logo" className="logo" />
        </div>
        <div><h1 className="title text">Захоплюючі розмови на теми, що вас цікавлять!</h1>
        <p className="text">Наш чат створений для того, щоб об'єднати людей з різними  інтересами і допомогти відкривати нові хобі!</p></div>
        <div>
          <img src="img/mcbook.png" alt="mcbook" className="aside_img" />
        </div>
      </aside>
      <section className="page__section form__section">
        <form className="form__container" onSubmit={handleSubmit}>
        <h2 className="title"> Часовий пояс</h2>       
        <div className="text__section">
        <p className="text--light">
        Вкажіть ваш часовий пояс, щоб ми могли налаштувати час повідомлень відповідно до вашого місцевого часу.
        </p>
        </div>
        <div className="field">

          <FieldNickname 
          label="Часовий пояс" 
          placeholder="Введіть ваш @нікнейм" 
          onChange={handleChange} 
          value={formData.nickname}
          error={error[FIELD_NAME.NICKNAME]} />

        </div>
        
        <div className="privacy-policy">
            <p>Реєструючись, ви приймаєте наші{" "}<a href="/" className="link--privacy-policy">
            Умови і Політику конфіденційності</a></p>
        </div>

        <button className="button button--dark" type="submit">Зареєструватися</button>
        </form>

        
      </section>
    </div>
  );
};

export default TimezonePage;
