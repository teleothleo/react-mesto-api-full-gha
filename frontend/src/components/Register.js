import { useRef } from "react";

const Register = ({ onSubmit }) => {

    const emailRef = useRef();
    const passwordRef = useRef();

    return (
        <>
            <h2 className="auth__title">Регистрация</h2>
            <form className="auth" onSubmit={(event) => {
                event.preventDefault();
                onSubmit({ email: emailRef.current.value, password: passwordRef.current.value })
            }}>
                <div>
                    <input
                        ref={emailRef}
                        className="form__input form__input-auth"
                        placeholder="Email"
                        required
                        type="email"
                        name="email"
                    />
                    <input
                        ref={passwordRef}
                        className="form__input form__input-auth"
                        placeholder="Пароль"
                        required
                        type="password"
                        name="password"
                    />
                </div>
                <div>
                    <button className="form__submit form__submit-auth" type="submit">Зарегистрироваться</button>
                    <a className="auth__sign-in">Уже зарегистрированы? Войти</a>
                </div>
            </form>
        </>
    );
};

export default Register;