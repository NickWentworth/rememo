import { useState } from 'react';
import styles from './loginPage.module.css';

// TODO - add email and password requirements

const initialFormData = {
    email: '',
    password: ''
}

export function LoginPage() {
    const [formData, setFormData] = useState(initialFormData);
    const [returningUser, setReturningUser] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    async function handleSubmit(event) {
        event.preventDefault(); // don't want to redirect page

        let userId = '';

        if (returningUser) {
           let response = await fetch(`/api/user/login`, {
                method: 'POST',
                body: JSON.stringify(formData)
            })
            let data = await response.json();

            if (!data.accountExists) {
                setResponseMessage('Invalid email');
                return;
            }
            if (!data.successfulLogin) {
                setResponseMessage('Invalid password');
                return;
            }

            userId = data.userId;
        } else {
            let response = await fetch('/api/user/signup', {
                method: 'POST',
                body: JSON.stringify(formData)
            })
            let data = await response.json();

            if (data.duplicateEmail) {
                setResponseMessage('An account already exists with this email');
                return;
            }

            userId = data.userId;
        }

        // TODO - route to dashboard page and bring along userId
        // TEMP
        setResponseMessage('');
        console.log('Logging in with: ' + userId);
        // ----
    }

    function onInputChanged(event) {
        let data = {...formData};
        data[event.target.name] = event.target.value;
        setFormData(data);
    }

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginWindow + ' boxShadowDark'}>
                <h1>{returningUser ? 'Login' : 'Sign Up'}</h1>

                <form onSubmit={handleSubmit}>
                    <div><p className={styles.responseMessage}>{responseMessage}</p></div>
                    <div><input name='email' type='text' onChange={onInputChanged} value={formData.email} placeholder='Email' required /></div>
                    <div><input name='password' type='text' onChange={onInputChanged} value={formData.password} placeholder='Password' required /></div>
                    <button className={styles.submitButton}>{returningUser ? 'LOGIN' : 'SIGN UP'}</button>
                </form>

                <div>
                    <p>
                        {returningUser ? 'Need an account? ' : 'Already have an account? '}
                        <span
                            className={styles.swapReturningUserText + ' interactable'}
                            onClick={() => {
                                setFormData(initialFormData);
                                setReturningUser(!returningUser);
                                setResponseMessage('');
                            }}
                        >
                            {returningUser ? 'Sign Up' : 'Login'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}
