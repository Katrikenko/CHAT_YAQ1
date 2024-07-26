import React from "react";
import "./field-code.scss"



interface EmailProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error: string;
    label: string;
    placeholder: string;
    
}

const FieldCode: React.FC<EmailProps> = ({
    value, 
    onChange,
    error,
    label,
    placeholder,
}) => {




    const handleClear = () => {
        onChange({ target: { name: "email", value: ''} } as React.ChangeEvent<HTMLInputElement>)
    };

   
    const inputClassName = `field__input ${error && value  ? "input--error" : ""}`

    return (
        <div>
            <div className="field">
          <label className="field__label">{label}</label>
        <input
        className={inputClassName} 
        name="code" 
        value={value} 
        type="number" 
        placeholder={placeholder}
        onChange={onChange}
        />
        <span className={`field__icon ${value ? "clear" : ""}`} onClick={handleClear}></span>
        </div>
        <div>
        { 
            error && value && (
                <div className="block__error">
                <img className="icon-error" src="./svg/danger.svg" alt="error" />
                <p><span className="form__error" id="emailError">  {error}</span></p>
                </div>
            )
        }
        </div>
        
        </div>
    )
}

export default FieldCode;