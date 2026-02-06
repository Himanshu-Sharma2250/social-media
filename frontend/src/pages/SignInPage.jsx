import { useState } from 'react';
import {useForm} from "react-hook-form"
import { useAuthStore } from '../store/useAuthStore';
import { NavLink } from 'react-router-dom';

const SignInPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const {login, isLoggingIn} = useAuthStore()

    const {register, handleSubmit} = useForm()

    const on_Submit = async (data) => {
        await login(data);
    };

    const styles = {
        container: { 
            maxWidth: '400px', 
            margin: '100px auto', 
            padding: '30px', 
            border: '1px solid #dbdbdb', 
            borderRadius: '12px', 
            textAlign: 'center', 
            fontFamily: 'sans-serif' 
        },
        title: { 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '20px', 
            color: '#262626' 
        },
        input: { 
            width: '100%', 
            padding: '12px', 
            marginBottom: '15px', 
            borderRadius: '8px', 
            border: '1px solid #efefef', 
            backgroundColor: '#fafafa', 
            boxSizing: 'border-box' 
        },
        button: { 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#0095f6', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: '600', 
            cursor: 'pointer', 
            opacity: isLoggingIn ? 0.7 : 1 
        },
        link: { 
            marginTop: '15px', 
            fontSize: '14px', 
            color: '#8e8e8e' 
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Login</h2>

            <form onSubmit={handleSubmit(on_Submit)}>
                <input style={styles.input} type="email" {...register("email")} placeholder="Email" required />
                <input style={styles.input} type="password" {...register("password")} placeholder="Password" required />
                <button style={styles.button} disabled={isLoggingIn}>
                    {isLoggingIn ? 'Logging in...' : 'Log In'}
                </button>
            </form>

            <div style={styles.link}>
                Don't have an account? <NavLink style={{color: '#0095f6', cursor: 'pointer'}}>Sign up</NavLink>
            </div>
        </div>
    );
};

export default SignInPage
